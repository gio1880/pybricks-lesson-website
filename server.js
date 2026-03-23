/**
 * PyLearn Student Platform Backend Server
 * Express.js server with session-based auth, REST API, and JSON file storage
 */

const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Simple password hashing using Node.js built-in crypto (no external dependencies)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return salt + ':' + hash;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === testHash;
}

// ============================================
// CONFIGURATION
// ============================================

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'pylearn-dev-secret-key-change-in-prod';

// Data directory and file paths
const DATA_DIR = path.join(__dirname, 'data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

// Write lock for preventing race conditions
let writeLocks = {};

// ============================================
// INITIALIZATION & HELPERS
// ============================================

/**
 * Ensure data directory and files exist
 */
function initializeDataFiles() {
  // Create data directory if it doesn't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Initialize students.json with default teacher
  if (!fs.existsSync(STUDENTS_FILE)) {
    const defaultTeacher = {
      id: 'teacher-default',
      name: 'Teacher',
      username: 'teacher',
      password_hash: hashPassword('pylearn2026'),
      role: 'teacher',
      created_at: new Date().toISOString()
    };
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify([defaultTeacher], null, 2));
    console.log('\n✓ Created default teacher account');
    console.log('  Default teacher account: username=teacher, password=pylearn2026\n');
  }

  // Initialize progress.json as empty object
  if (!fs.existsSync(PROGRESS_FILE)) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify({}, null, 2));
  }
}

/**
 * Simple file-based lock mechanism to prevent race conditions
 */
async function acquireLock(fileKey, timeout = 5000) {
  const startTime = Date.now();
  while (writeLocks[fileKey]) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Lock acquisition timeout');
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  writeLocks[fileKey] = true;
}

function releaseLock(fileKey) {
  delete writeLocks[fileKey];
}

/**
 * Read students from JSON file
 */
function readStudents() {
  try {
    const data = fs.readFileSync(STUDENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading students file:', err);
    return [];
  }
}

/**
 * Write students to JSON file
 */
async function writeStudents(students) {
  await acquireLock('students');
  try {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));
  } finally {
    releaseLock('students');
  }
}

/**
 * Read progress from JSON file
 */
function readProgress() {
  try {
    const data = fs.readFileSync(PROGRESS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading progress file:', err);
    return {};
  }
}

/**
 * Write progress to JSON file
 */
async function writeProgress(progress) {
  await acquireLock('progress');
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
  } finally {
    releaseLock('progress');
  }
}

/**
 * Generate unique ID
 */
function generateId() {
  return 'student-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Find student by username
 */
function findStudentByUsername(username) {
  const students = readStudents();
  return students.find(s => s.username === username);
}

/**
 * Find student by ID
 */
function findStudentById(id) {
  const students = readStudents();
  return students.find(s => s.id === id);
}

/**
 * Get student progress or create default
 */
function getOrCreateProgress(studentId) {
  const progress = readProgress();
  if (!progress[studentId]) {
    progress[studentId] = {
      lessonProgress: {},
      lastLogin: new Date().toISOString(),
      totalTime: 0
    };
  }
  return progress[studentId];
}

// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json());
app.use(express.static(__dirname));

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

/**
 * Middleware: Require authentication
 */
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  next();
}

/**
 * Middleware: Require teacher role
 */
function requireTeacher(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'teacher') {
    return res.status(403).json({ success: false, error: 'Teacher access required' });
  }
  next();
}

// ============================================
// AUTH API ENDPOINTS
// ============================================

/**
 * POST /api/login
 * Login a user with username and password
 */
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success: false, error: 'Username and password required' });
    }

    const student = findStudentByUsername(username);
    if (!student) {
      return res.json({ success: false, error: 'Invalid credentials' });
    }

    const passwordMatch = verifyPassword(password, student.password_hash);
    if (!passwordMatch) {
      return res.json({ success: false, error: 'Invalid credentials' });
    }

    // Store in session
    req.session.user = {
      id: student.id,
      name: student.name,
      username: student.username,
      role: student.role
    };

    // Update last login in progress
    if (student.role === 'student') {
      const progress = readProgress();
      const studentProgress = getOrCreateProgress(student.id);
      studentProgress.lastLogin = new Date().toISOString();
      progress[student.id] = studentProgress;
      await writeProgress(progress);
    }

    res.json({
      success: true,
      user: req.session.user
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * POST /api/logout
 * Logout the current user
 */
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

/**
 * GET /api/me
 * Get current logged-in user info
 */
app.get('/api/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.session.user });
});

// ============================================
// STUDENT PROGRESS API ENDPOINTS
// ============================================

/**
 * GET /api/progress
 * Get the logged-in student's progress data
 */
app.get('/api/progress', requireAuth, (req, res) => {
  try {
    if (req.session.user.role !== 'student') {
      return res.status(403).json({ success: false, error: 'Student access required' });
    }

    const progress = getOrCreateProgress(req.session.user.id);
    res.json({ success: true, data: progress });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * POST /api/progress
 * Save/merge progress for logged-in student
 */
app.post('/api/progress', requireAuth, async (req, res) => {
  try {
    if (req.session.user.role !== 'student') {
      return res.status(403).json({ success: false, error: 'Student access required' });
    }

    const { lessonProgress, totalTime } = req.body;
    const progress = readProgress();
    const studentProgress = getOrCreateProgress(req.session.user.id);

    // Merge lesson progress
    if (lessonProgress) {
      studentProgress.lessonProgress = {
        ...studentProgress.lessonProgress,
        ...lessonProgress
      };
    }

    // Update total time if provided
    if (typeof totalTime === 'number') {
      studentProgress.totalTime = totalTime;
    }

    studentProgress.lastLogin = new Date().toISOString();
    progress[req.session.user.id] = studentProgress;
    await writeProgress(progress);

    res.json({ success: true, data: studentProgress });
  } catch (err) {
    console.error('Post progress error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * GET /api/leaderboard
 * Get anonymized class progress
 */
app.get('/api/leaderboard', requireAuth, (req, res) => {
  try {
    const students = readStudents();
    const progress = readProgress();

    // Build leaderboard with lesson completion counts (anonymized)
    const leaderboard = students
      .filter(s => s.role === 'student')
      .map(s => {
        const studentProgress = progress[s.id] || { lessonProgress: {}, totalTime: 0 };
        const lessonsCompleted = Object.keys(studentProgress.lessonProgress || {}).length;
        return {
          name: s.name,
          lessonsCompleted,
          totalTime: studentProgress.totalTime || 0
        };
      })
      .sort((a, b) => b.lessonsCompleted - a.lessonsCompleted);

    res.json({ success: true, data: leaderboard });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// ADMIN API ENDPOINTS
// ============================================

/**
 * GET /api/admin/students
 * Get list of all students (no passwords)
 */
app.get('/api/admin/students', requireAuth, requireTeacher, (req, res) => {
  try {
    const students = readStudents();
    const progress = readProgress();

    // Return students without passwords
    const studentList = students
      .filter(s => s.role === 'student')
      .map(s => {
        const studentProgress = progress[s.id] || { lessonProgress: {}, lastLogin: null };
        const lessonsCompleted = Object.keys(studentProgress.lessonProgress || {}).length;
        return {
          id: s.id,
          name: s.name,
          username: s.username,
          created_at: s.created_at,
          lessonsCompleted,
          lastLogin: studentProgress.lastLogin
        };
      });

    res.json({ success: true, data: studentList });
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * POST /api/admin/students
 * Create a new student
 */
app.post('/api/admin/students', requireAuth, requireTeacher, async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.json({ success: false, error: 'Name, username, and password required' });
    }

    // Check if username already exists
    if (findStudentByUsername(username)) {
      return res.json({ success: false, error: 'Username already exists' });
    }

    const students = readStudents();
    const newStudent = {
      id: generateId(),
      name,
      username,
      password_hash: hashPassword(password),
      role: 'student',
      created_at: new Date().toISOString()
    };

    students.push(newStudent);
    await writeStudents(students);

    // Initialize progress for new student
    const progress = readProgress();
    progress[newStudent.id] = {
      lessonProgress: {},
      lastLogin: null,
      totalTime: 0
    };
    await writeProgress(progress);

    res.json({
      success: true,
      data: {
        id: newStudent.id,
        name: newStudent.name,
        username: newStudent.username,
        created_at: newStudent.created_at
      }
    });
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * POST /api/admin/students/bulk
 * Create multiple students at once
 */
app.post('/api/admin/students/bulk', requireAuth, requireTeacher, async (req, res) => {
  try {
    const { students: newStudents } = req.body;

    if (!Array.isArray(newStudents) || newStudents.length === 0) {
      return res.json({ success: false, error: 'Students array required' });
    }

    const students = readStudents();
    const progress = readProgress();
    const created = [];
    const errors = [];

    for (let i = 0; i < newStudents.length; i++) {
      const { name, username, password } = newStudents[i];

      if (!name || !username || !password) {
        errors.push({ index: i, error: 'Name, username, and password required' });
        continue;
      }

      if (findStudentByUsername(username)) {
        errors.push({ index: i, error: 'Username already exists' });
        continue;
      }

      const newStudent = {
        id: generateId(),
        name,
        username,
        password_hash: hashPassword(password),
        role: 'student',
        created_at: new Date().toISOString()
      };

      students.push(newStudent);
      progress[newStudent.id] = {
        lessonProgress: {},
        lastLogin: null,
        totalTime: 0
      };

      created.push({
        id: newStudent.id,
        name: newStudent.name,
        username: newStudent.username
      });
    }

    await writeStudents(students);
    await writeProgress(progress);

    res.json({
      success: errors.length === 0,
      data: { created, errors }
    });
  } catch (err) {
    console.error('Bulk create error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * DELETE /api/admin/students/:id
 * Remove a student
 */
app.delete('/api/admin/students/:id', requireAuth, requireTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    const students = readStudents();
    const initialLength = students.length;
    const filtered = students.filter(s => s.id !== id);

    if (filtered.length === initialLength) {
      return res.json({ success: false, error: 'Student not found' });
    }

    await writeStudents(filtered);

    // Also remove from progress
    const progress = readProgress();
    delete progress[id];
    await writeProgress(progress);

    res.json({ success: true });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * POST /api/admin/students/:id/reset-password
 * Reset a student's password
 */
app.post('/api/admin/students/:id/reset-password', requireAuth, requireTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.json({ success: false, error: 'Password required' });
    }

    const students = readStudents();
    const student = students.find(s => s.id === id);

    if (!student) {
      return res.json({ success: false, error: 'Student not found' });
    }

    student.password_hash = hashPassword(password);
    await writeStudents(students);

    res.json({ success: true });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * GET /api/admin/progress
 * Get all students' progress (teacher overview)
 */
app.get('/api/admin/progress', requireAuth, requireTeacher, (req, res) => {
  try {
    const students = readStudents();
    const progress = readProgress();

    const progressData = students
      .filter(s => s.role === 'student')
      .map(s => {
        const studentProgress = progress[s.id] || { lessonProgress: {}, lastLogin: null, totalTime: 0 };
        return {
          id: s.id,
          name: s.name,
          username: s.username,
          lessonsCompleted: Object.keys(studentProgress.lessonProgress || {}).length,
          lastLogin: studentProgress.lastLogin,
          totalTime: studentProgress.totalTime || 0,
          lessonProgress: studentProgress.lessonProgress
        };
      });

    res.json({ success: true, data: progressData });
  } catch (err) {
    console.error('Get admin progress error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * POST /api/admin/reset-progress/:id
 * Reset a student's progress
 */
app.post('/api/admin/reset-progress/:id', requireAuth, requireTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    const progress = readProgress();
    if (!progress[id]) {
      return res.json({ success: false, error: 'Student not found' });
    }

    progress[id] = {
      lessonProgress: {},
      lastLogin: progress[id].lastLogin,
      totalTime: 0
    };

    await writeProgress(progress);
    res.json({ success: true });
  } catch (err) {
    console.error('Reset progress error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// ADMIN PANEL ROUTE
// ============================================

app.get('/admin', (req, res) => {
  res.send(getAdminPanelHTML());
});

/**
 * Generate admin panel HTML
 */
function getAdminPanelHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PyLearn Admin Panel</title>
  <style>
    :root {
      --color-primary: #4F46E5;
      --color-secondary: #06B6D4;
      --color-success: #10B981;
      --color-warning: #F59E0B;
      --color-error: #EF4444;
      --color-dark-bg: #0F172A;
      --color-card-bg: #1E293B;
      --color-border: #334155;
      --color-text-primary: #F1F5F9;
      --color-text-muted: #94A3B8;
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --transition-normal: 300ms ease-in-out;
      --radius-md: 0.5rem;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: var(--color-dark-bg);
      color: var(--color-text-primary);
      font-family: var(--font-sans);
      font-size: 16px;
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border);
    }

    .header h1 {
      font-size: 2rem;
      color: var(--color-primary);
    }

    .logout-btn {
      background-color: var(--color-error);
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 1rem;
      transition: background-color var(--transition-normal);
    }

    .logout-btn:hover {
      background-color: #DC2626;
    }

    .login-container {
      max-width: 400px;
      margin: 5rem auto;
      background-color: var(--color-card-bg);
      padding: 2rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    .login-container h2 {
      margin-bottom: 1.5rem;
      text-align: center;
      color: var(--color-primary);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--color-text-primary);
      font-weight: 500;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      background-color: var(--color-dark-bg);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-family: var(--font-sans);
      font-size: 1rem;
      transition: border-color var(--transition-normal);
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .btn {
      background-color: var(--color-primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 1rem;
      transition: background-color var(--transition-normal);
      font-weight: 500;
    }

    .btn:hover {
      background-color: #4338CA;
    }

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .btn-danger {
      background-color: var(--color-error);
    }

    .btn-danger:hover {
      background-color: #DC2626;
    }

    .btn-success {
      background-color: var(--color-success);
    }

    .btn-success:hover {
      background-color: #059669;
    }

    .alert {
      padding: 1rem;
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
    }

    .alert-error {
      background-color: rgba(239, 68, 68, 0.1);
      color: #FCA5A5;
      border: 1px solid var(--color-error);
    }

    .alert-success {
      background-color: rgba(16, 185, 129, 0.1);
      color: #86EFAC;
      border: 1px solid var(--color-success);
    }

    .section {
      margin-bottom: 3rem;
    }

    .section h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--color-secondary);
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 0.5rem;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background-color: var(--color-card-bg);
      padding: 1.5rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    .stat-card h3 {
      color: var(--color-text-muted);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-card .value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .table-wrapper {
      overflow-x: auto;
      background-color: var(--color-card-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: rgba(0, 0, 0, 0.2);
      border-bottom: 2px solid var(--color-border);
    }

    th {
      padding: 1rem;
      text-align: left;
      color: var(--color-text-primary);
      font-weight: 600;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid var(--color-border);
    }

    tbody tr:hover {
      background-color: rgba(79, 70, 229, 0.05);
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .form-section {
      background-color: var(--color-card-bg);
      padding: 1.5rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      margin-bottom: 1.5rem;
    }

    .form-section h3 {
      margin-bottom: 1rem;
      color: var(--color-primary);
    }

    .inline-form {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 1rem;
      align-items: end;
    }

    @media (max-width: 768px) {
      .inline-form {
        grid-template-columns: 1fr;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }

    .hidden {
      display: none !important;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Login Section -->
    <div id="loginSection" class="login-container">
      <h2>Teacher Login</h2>
      <form id="loginForm">
        <div class="form-group">
          <label for="loginUsername">Username</label>
          <input type="text" id="loginUsername" name="username" required>
        </div>
        <div class="form-group">
          <label for="loginPassword">Password</label>
          <input type="password" id="loginPassword" name="password" required>
        </div>
        <button type="submit" class="btn">Login</button>
      </form>
      <div id="loginError" class="alert alert-error hidden" style="margin-top: 1rem;"></div>
    </div>

    <!-- Admin Section -->
    <div id="adminSection" class="hidden">
      <!-- Header -->
      <div class="header">
        <div>
          <h1>PyLearn Admin Panel</h1>
          <p style="color: var(--color-text-muted);">Welcome, <strong id="teacherName"></strong></p>
        </div>
        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>

      <!-- Success/Error Messages -->
      <div id="message" class="alert hidden"></div>

      <!-- Overview Section -->
      <div class="section">
        <h2>Class Overview</h2>
        <div class="stats">
          <div class="stat-card">
            <h3>Total Students</h3>
            <div class="value" id="statTotalStudents">0</div>
          </div>
          <div class="stat-card">
            <h3>Average Lessons Completed</h3>
            <div class="value" id="statAvgLessons">0</div>
          </div>
          <div class="stat-card">
            <h3>Class Total Time</h3>
            <div class="value" id="statTotalTime">0h</div>
          </div>
        </div>
      </div>

      <!-- Add Student Section -->
      <div class="section">
        <h2>Add Students</h2>

        <!-- Single Student -->
        <div class="form-section">
          <h3>Add Single Student</h3>
          <form id="addStudentForm" class="inline-form">
            <input type="text" id="newStudentName" placeholder="Student Name" required>
            <input type="text" id="newStudentUsername" placeholder="Username" required>
            <input type="password" id="newStudentPassword" placeholder="Password" required>
            <button type="submit" class="btn btn-success">Add</button>
          </form>
        </div>

        <!-- Bulk Import -->
        <div class="form-section">
          <h3>Bulk Import Students</h3>
          <p style="color: var(--color-text-muted); margin-bottom: 1rem; font-size: 0.875rem;">
            Enter one student per line in format: <code style="background: var(--color-dark-bg); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">Name,Username,Password</code>
          </p>
          <form id="bulkImportForm">
            <div class="form-group">
              <textarea id="bulkStudentData" placeholder="Alice,alice123,pass123&#10;Bob,bob456,pass456&#10;Charlie,charlie789,pass789" style="min-height: 150px;"></textarea>
            </div>
            <button type="submit" class="btn btn-success">Import Students</button>
          </form>
        </div>
      </div>

      <!-- Students List Section -->
      <div class="section">
        <h2>Student Management</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Lessons Completed</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="studentTableBody">
              <tr><td colspan="5" style="text-align: center; color: var(--color-text-muted);">Loading...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Progress Overview Section -->
      <div class="section">
        <h2>Student Progress Details</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Lessons Completed</th>
                <th>Total Time (min)</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="progressTableBody">
              <tr><td colspan="6" style="text-align: center; color: var(--color-text-muted);">Loading...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = '/api';
    let currentUser = null;
    let studentsList = [];

    // ============================================
    // INITIALIZATION
    // ============================================

    async function init() {
      // Check if already logged in
      try {
        const response = await fetch(\`\${API_BASE}/me\`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.user.role === 'teacher') {
            currentUser = result.user;
            showAdminPanel();
            await loadStudents();
            return;
          }
        }
      } catch (err) {
        console.error('Init error:', err);
      }

      // Not logged in, show login form
      document.getElementById('loginSection').classList.remove('hidden');
    }

    // ============================================
    // AUTH FUNCTIONS
    // ============================================

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const response = await fetch(\`\${API_BASE}/login\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success && result.user.role === 'teacher') {
          currentUser = result.user;
          document.getElementById('loginSection').classList.add('hidden');
          showAdminPanel();
          await loadStudents();
        } else {
          showError('loginError', result.error || 'Login failed');
        }
      } catch (err) {
        showError('loginError', 'Network error');
        console.error('Login error:', err);
      }
    });

    async function logout() {
      try {
        await fetch(\`\${API_BASE}/logout\`, { method: 'POST' });
        currentUser = null;
        document.getElementById('adminSection').classList.add('hidden');
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
      } catch (err) {
        console.error('Logout error:', err);
      }
    }

    function showAdminPanel() {
      document.getElementById('adminSection').classList.remove('hidden');
      document.getElementById('teacherName').textContent = currentUser.name;
    }

    // ============================================
    // LOAD AND DISPLAY STUDENTS
    // ============================================

    async function loadStudents() {
      try {
        const response = await fetch(\`\${API_BASE}/admin/students\`);
        const result = await response.json();

        if (result.success) {
          studentsList = result.data;
          await loadProgress();
          displayStudents();
          updateStats();
        }
      } catch (err) {
        console.error('Load students error:', err);
      }
    }

    let progressData = [];

    async function loadProgress() {
      try {
        const response = await fetch(\`\${API_BASE}/admin/progress\`);
        const result = await response.json();

        if (result.success) {
          progressData = result.data;
        }
      } catch (err) {
        console.error('Load progress error:', err);
      }
    }

    function displayStudents() {
      const tbody = document.getElementById('studentTableBody');
      tbody.innerHTML = '';

      if (studentsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted);">No students yet</td></tr>';
        return;
      }

      studentsList.forEach(student => {
        const row = document.createElement('tr');
        const lastLogin = student.lastLogin ? new Date(student.lastLogin).toLocaleDateString() : 'Never';
        row.innerHTML = \`
          <td><strong>\${escapeHtml(student.name)}</strong></td>
          <td><code style="background: var(--color-dark-bg); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">\${escapeHtml(student.username)}</code></td>
          <td>\${student.lessonsCompleted}</td>
          <td>\${lastLogin}</td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-small" onclick="showResetPasswordModal('\${student.id}', '\${escapeHtml(student.name)}')">Reset Password</button>
              <button class="btn btn-small btn-danger" onclick="deleteStudent('\${student.id}', '\${escapeHtml(student.name)}')">Delete</button>
            </div>
          </td>
        \`;
        tbody.appendChild(row);
      });
    }

    function displayProgress() {
      const tbody = document.getElementById('progressTableBody');
      tbody.innerHTML = '';

      if (progressData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--color-text-muted);">No progress data</td></tr>';
        return;
      }

      progressData.forEach(progress => {
        const row = document.createElement('tr');
        const lastLogin = progress.lastLogin ? new Date(progress.lastLogin).toLocaleDateString() : 'Never';
        row.innerHTML = \`
          <td><strong>\${escapeHtml(progress.name)}</strong></td>
          <td><code style="background: var(--color-dark-bg); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">\${escapeHtml(progress.username)}</code></td>
          <td>\${progress.lessonsCompleted}</td>
          <td>\${progress.totalTime}</td>
          <td>\${lastLogin}</td>
          <td>
            <button class="btn btn-small btn-danger" onclick="resetProgress('\${progress.id}', '\${escapeHtml(progress.name)}')">Reset Progress</button>
          </td>
        \`;
        tbody.appendChild(row);
      });
    }

    // ============================================
    // ADD STUDENT FUNCTIONS
    // ============================================

    document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('newStudentName').value;
      const username = document.getElementById('newStudentUsername').value;
      const password = document.getElementById('newStudentPassword').value;

      try {
        const response = await fetch(\`\${API_BASE}/admin/students\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, username, password })
        });

        const result = await response.json();

        if (result.success) {
          showMessage('success', \`Student \${name} added successfully!\`);
          document.getElementById('addStudentForm').reset();
          await loadStudents();
        } else {
          showMessage('error', result.error || 'Failed to add student');
        }
      } catch (err) {
        showMessage('error', 'Network error');
        console.error('Add student error:', err);
      }
    });

    document.getElementById('bulkImportForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const bulkData = document.getElementById('bulkStudentData').value.trim();
      if (!bulkData) {
        showMessage('error', 'Please enter student data');
        return;
      }

      const students = bulkData.split('\\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => {
          const [name, username, password] = line.split(',').map(s => s.trim());
          return { name, username, password };
        });

      try {
        const response = await fetch(\`\${API_BASE}/admin/students/bulk\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ students })
        });

        const result = await response.json();

        if (result.success) {
          showMessage('success', \`Successfully added \${result.data.created.length} students!\`);
          document.getElementById('bulkImportForm').reset();
          await loadStudents();
        } else {
          const errorCount = result.data.errors.length;
          const createdCount = result.data.created.length;
          showMessage('error', \`Created \${createdCount}, Failed \${errorCount}: \${result.data.errors.map(e => e.error).join(', ')}\`);
          await loadStudents();
        }
      } catch (err) {
        showMessage('error', 'Network error');
        console.error('Bulk import error:', err);
      }
    });

    // ============================================
    // DELETE AND RESET FUNCTIONS
    // ============================================

    async function deleteStudent(id, name) {
      if (!confirm(\`Are you sure you want to delete \${name}? This cannot be undone.\`)) {
        return;
      }

      try {
        const response = await fetch(\`\${API_BASE}/admin/students/\${id}\`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          showMessage('success', \`Student \${name} deleted successfully!\`);
          await loadStudents();
        } else {
          showMessage('error', result.error || 'Failed to delete student');
        }
      } catch (err) {
        showMessage('error', 'Network error');
        console.error('Delete student error:', err);
      }
    }

    function showResetPasswordModal(id, name) {
      const newPassword = prompt(\`Enter new password for \${name}:\`);
      if (newPassword) {
        resetPassword(id, name, newPassword);
      }
    }

    async function resetPassword(id, name, password) {
      try {
        const response = await fetch(\`\${API_BASE}/admin/students/\${id}/reset-password\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });

        const result = await response.json();

        if (result.success) {
          showMessage('success', \`Password for \${name} reset successfully!\`);
          await loadStudents();
        } else {
          showMessage('error', result.error || 'Failed to reset password');
        }
      } catch (err) {
        showMessage('error', 'Network error');
        console.error('Reset password error:', err);
      }
    }

    async function resetProgress(id, name) {
      if (!confirm(\`Reset all progress for \${name}?\`)) {
        return;
      }

      try {
        const response = await fetch(\`\${API_BASE}/admin/reset-progress/\${id}\`, {
          method: 'POST'
        });

        const result = await response.json();

        if (result.success) {
          showMessage('success', \`Progress for \${name} reset successfully!\`);
          await loadStudents();
        } else {
          showMessage('error', result.error || 'Failed to reset progress');
        }
      } catch (err) {
        showMessage('error', 'Network error');
        console.error('Reset progress error:', err);
      }
    }

    // ============================================
    // STATS FUNCTIONS
    // ============================================

    function updateStats() {
      document.getElementById('statTotalStudents').textContent = studentsList.length;

      if (progressData.length === 0) {
        document.getElementById('statAvgLessons').textContent = '0';
        document.getElementById('statTotalTime').textContent = '0h';
      } else {
        const totalLessons = progressData.reduce((sum, p) => sum + p.lessonsCompleted, 0);
        const avgLessons = (totalLessons / progressData.length).toFixed(1);
        document.getElementById('statAvgLessons').textContent = avgLessons;

        const totalTime = progressData.reduce((sum, p) => sum + (p.totalTime || 0), 0);
        const hours = (totalTime / 60).toFixed(1);
        document.getElementById('statTotalTime').textContent = \`\${hours}h\`;
      }

      displayProgress();
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    function showMessage(type, message) {
      const messageEl = document.getElementById('message');
      messageEl.textContent = message;
      messageEl.className = \`alert alert-\${type}\`;
      messageEl.classList.remove('hidden');

      setTimeout(() => {
        messageEl.classList.add('hidden');
      }, 5000);
    }

    function showError(elementId, message) {
      const el = document.getElementById(elementId);
      el.textContent = message;
      el.classList.remove('hidden');
    }

    function escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Initialize on page load
    init();
  </script>
</body>
</html>`;
}

// ============================================
// STATIC FILE SERVING
// ============================================

// Serve index.html as fallback for root routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ============================================
// SERVER STARTUP
// ============================================

initializeDataFiles();

app.listen(PORT, () => {
  console.log(`\n✓ PyLearn Server running at http://localhost:${PORT}`);
  console.log(`  Admin panel: http://localhost:${PORT}/admin\n`);
});
