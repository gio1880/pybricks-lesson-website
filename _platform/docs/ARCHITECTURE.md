# STEM Learning Platform Architecture

## Overview

The STEM Learning Platform is a comprehensive, hidden educational system designed to deliver structured robotics and programming education across 10 interconnected learning paths. The platform organizes content hierarchically, separating concerns between documentation, curriculum content, and application code.

## Platform Hierarchy

The platform is structured as a multi-level hierarchy that flows from broad to specific:

```
Platform
├── Categories (Engineering, Programming, Design, etc.)
│   ├── Paths (10 unique learning journeys)
│   │   ├── Levels (Progressive difficulty within a path)
│   │   │   ├── Modules (Focused topic areas)
│   │   │   │   ├── Lessons (Individual learning units)
│   │   │   │   │   ├── Explanations (Theory and concepts)
│   │   │   │   │   ├── Examples (Code and demonstrations)
│   │   │   │   │   ├── Exercises (Hands-on practice)
│   │   │   │   │   └── Quizzes (Knowledge checks)
│   │   │   │   ├── Assessments (Level evaluation)
│   │   │   │   └── Projects (Major deliverables)
```

### Hierarchy Details

**Categories**: Broad classifications that group related learning paths
- Engineering (robotics mechanics, fabrication)
- Programming (block coding, Python, Java)
- Design (CAD, 3D modeling)
- Competition (FLL, FTC)
- Tools (simulation, documentation)
- Professional Development (portfolio, engineering notebook)

**Paths**: Complete learning journeys with a coherent theme (10 total)
- Each path has a unique ID, title, difficulty level, and duration
- Paths may have prerequisites (dependencies on other paths)
- Paths contain color and icon identifiers for UI

**Levels**: Progressive stages within a path (typically 3-5 per path)
- Organized by skill advancement
- Build upon prior knowledge
- Prepare learners for next path or level

**Modules**: Focused topic areas within a level (typically 2-4 per level)
- Cover specific skills or concepts
- Contain a sequence of lessons
- Include assessments and projects

**Lessons**: Individual learning units (typically 3-6 per module)
- Include explanation, examples, exercises, and quizzes
- Last 15-30 minutes when completed thoroughly
- Can be of type: lesson, assessment, or project

**Assessment/Project**: Evaluations integrated into the curriculum
- Assessments are formative (mid-module checkpoint)
- Projects are summative (major deliverable)

## Folder Structure

```
_platform/
├── app/                          # Application code (React/Vue/etc)
│   ├── assets/                   # Images, icons, fonts
│   ├── components/               # UI components
│   ├── pages/                    # Page components
│   ├── layouts/                  # Layout components
│   ├── styles/                   # CSS/styling
│   └── utils/                    # Utility functions
│
├── content/                      # Content files (JSON)
│   ├── paths/                    # Path structure definitions
│   │   ├── 01-robotics-foundations/
│   │   │   ├── levels/          # Level metadata
│   │   │   └── modules/         # Module content files
│   │   ├── 02-block-coding/
│   │   │   ├── levels/
│   │   │   └── modules/
│   │   ├── 03-python-micropython/
│   │   │   ├── levels/
│   │   │   └── modules/
│   │   ├── [04-10 similar paths...]
│   │   └── paths.json           # (OPTIONAL) Master path registry
│   │
│   ├── assessments/              # Assessment files
│   │   ├── python-basics-checkpoint.json
│   │   ├── [other assessments...]
│   │   └── assessments-index.json
│   │
│   └── projects/                 # Project files
│       ├── fll-autonomous-mission.json
│       ├── [other projects...]
│       └── projects-index.json
│
├── data/                         # Data files and registries
│   ├── paths.json               # Master paths registry (all 10 paths with full structure)
│   ├── categories.json          # Category definitions
│   ├── metadata.json            # Platform-wide metadata
│   └── index.json               # Comprehensive content index
│
└── docs/                        # Documentation
    ├── ARCHITECTURE.md          # This file
    ├── CONTENT-GUIDE.md         # How to write curriculum
    ├── planning/
    │   ├── ROADMAP.md          # Development roadmap
    │   └── PROJECT-TIMELINE.md
    ├── curriculum/              # Curriculum plans for each path
    │   ├── 01-robotics-foundations/
    │   │   ├── README.md
    │   │   └── [planning documents...]
    │   ├── 02-block-coding/
    │   │   ├── README.md
    │   │   └── [...]
    │   └── [03-10 similar...]
    ├── api/
    │   └── ENDPOINTS.md         # API documentation
    └── technical/
        ├── DATABASE.md
        └── DEPLOYMENT.md
```

## Content Organization

### Path Structure (content/paths/)

Each path is in its own directory with consistent structure:

```
03-python-micropython/
├── levels/
│   ├── level-1.json            # Level metadata and overview
│   ├── level-2.json
│   ├── level-3.json
│   └── level-4.json
│
└── modules/
    ├── variables-and-types.json
    ├── control-flow.json
    ├── functions.json
    ├── data-structures.json
    └── [other module files...]
```

### Module Content Format

Each module file (`variables-and-types.json`) contains:

```json
{
  "id": "variables-and-types",
  "title": "Module Title",
  "path": "python-micropython",
  "level": "level-1",
  "order": 2,
  "lessons": [
    {
      "id": "lesson-id",
      "title": "Lesson Title",
      "type": "lesson|assessment|project",
      "duration": 20,
      "explain": { "title": "...", "content": "...", "keyPoints": [...] },
      "example": { "title": "...", "code": "...", "output": "..." },
      "exercise": { "instructions": "...", "type": "code", "validation": {...} },
      "quiz": { "questions": [...] }
    }
  ]
}
```

### Assessment Format

Assessment files contain:

```json
{
  "id": "assessment-id",
  "title": "Assessment Title",
  "path": "python-micropython",
  "level": "level-1",
  "passingScore": 70,
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice|code|essay",
      "question": "...",
      "options": [...],
      "validation": {...}
    }
  ],
  "feedback": { "excellent": {...}, "good": {...}, "needsWork": {...} }
}
```

### Project Format

Project files contain:

```json
{
  "id": "project-id",
  "title": "Project Title",
  "description": "...",
  "path": "pybricks-fll",
  "learningObjectives": [...],
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase Name",
      "tasks": [
        {
          "id": "task-1-1",
          "title": "Task Name",
          "deliverable": "..."
        }
      ]
    }
  ],
  "successCriteria": [...],
  "rubric": {...}
}
```

## Separation of Concerns

### Documentation (docs/)

**Purpose**: Plan, explain, and guide
- Curriculum development plans
- Architecture and design decisions
- Content guidelines and templates
- Development roadmaps
- Technical specifications

**Who uses it**: Curriculum developers, content creators, developers

### Content (content/)

**Purpose**: Deliver structured learning material
- Lessons with explanations and examples
- Exercises and quizzes
- Assessments and checkpoints
- Projects and deliverables
- All in structured JSON format

**Who uses it**: Learners (via the app), platform developers

### Data (data/)

**Purpose**: Index and register content
- Master paths.json with all 10 paths and full hierarchy
- Content indices and catalogs
- Metadata for platform configuration
- Registration of all lessons, assessments, projects

**Who uses it**: App backend, API servers, search/discovery

### Application (app/)

**Purpose**: Deliver user experience
- React/Vue components for UI
- Page layouts and navigation
- Styling and responsive design
- Integration with content and data
- Student progress tracking

**Who uses it**: Learners, teachers, administrators

## Data Flow

1. **Content Creation**
   - Curriculum developers write lesson content in JSON format
   - Content is placed in `content/paths/XX-path-name/modules/`

2. **Registration**
   - Content is indexed in `data/paths.json` or module-level indices
   - Metadata is updated in platform registries

3. **Discovery**
   - App queries `data/` files to find available paths, levels, modules
   - Uses indices to build navigation and structure

4. **Delivery**
   - App fetches specific lesson/assessment/project from `content/`
   - Renders using components and styles in `app/`
   - Tracks progress in backend database

5. **Evaluation**
   - Assessments are submitted
   - Validation rules from content files determine scoring
   - Progress is updated

## Adding Content

### Adding a New Path

1. Create directory: `content/paths/XX-path-name/`
   - Use numeric prefix (01-10) in order
   - Use kebab-case for name

2. Create subdirectories:
   - `levels/` for level metadata
   - `modules/` for lesson content

3. Create level metadata files: `levels/level-N.json`

4. Create module files: `modules/module-name.json` with full lesson structure

5. Update `data/paths.json` to register the new path

6. Create documentation in `docs/curriculum/XX-path-name/README.md`

### Adding a New Level

1. Create `content/paths/XX-path-name/levels/level-N.json` with:
   - Level ID, title, subtitle
   - Order (1-5)
   - List of modules in this level

2. Create module files for this level

3. Update path registration in `data/paths.json`

### Adding a New Module

1. Create `content/paths/XX-path-name/modules/module-name.json` with:
   - Module ID, title, description
   - List of lessons

2. Populate with lesson objects containing:
   - Explanation (theory)
   - Examples (code/demo)
   - Exercise (hands-on practice)
   - Quiz (knowledge check)

### Adding a New Lesson

1. Add lesson object to module file with:
   - ID, title, type (lesson/assessment/project)
   - Duration estimate
   - Explain section (title, content, key points)
   - Example section (code, output, annotations)
   - Exercise section (instructions, starter code, validation)
   - Quiz section (questions with options)

2. Include learning objectives and key points

3. Provide clear explanations and realistic examples

### Adding an Assessment

1. Create file: `content/assessments/assessment-name.json`

2. Include:
   - Assessment metadata (ID, title, passing score)
   - Mix of question types (multiple-choice, code, essay)
   - Validation rules for automatic grading
   - Feedback for different score ranges

3. Register in `content/assessments/assessments-index.json`

### Adding a Project

1. Create file: `content/projects/project-name.json`

2. Include:
   - Project metadata and description
   - Learning objectives
   - Requirements (hardware, software, knowledge)
   - Phases with tasks and deliverables
   - Resources (tutorials, templates)
   - Success criteria and rubric

3. Register in `content/projects/projects-index.json`

## Routing Scheme

The application uses this routing structure:

```
/paths                          # Browse all paths
/paths/:pathId                  # View path overview
/paths/:pathId/levels/:levelId  # View level overview
/paths/:pathId/levels/:levelId/modules/:moduleId  # Module content
/paths/:pathId/levels/:levelId/modules/:moduleId/lessons/:lessonId  # Lesson
/assessments/:assessmentId      # Take assessment
/projects/:projectId            # View project brief
/my-progress                    # Student dashboard
/my-projects                    # Student's submitted projects
```

## Configuration

### Platform Metadata (data/metadata.json)

```json
{
  "platformName": "PyLearn STEM",
  "version": "1.0.0",
  "totalPaths": 10,
  "categories": ["engineering", "programming", "design", ...],
  "settings": {
    "enableProgress": true,
    "enableProjects": true,
    "autoSaveProgress": true
  }
}
```

## Development Workflow

### Curriculum Development

1. Create path plan in `docs/curriculum/XX-path-name/README.md`
2. Break down into levels and modules
3. Write lesson content in JSON
4. Create assessments and projects
5. Get peer review before publishing
6. Update registries and indices

### Content Review Checklist

- [ ] All lessons have explanations with key points
- [ ] All lessons have realistic code examples
- [ ] All lessons have exercises with clear instructions
- [ ] All lessons have 3-5 quiz questions
- [ ] Explanations use accessible language
- [ ] Code examples are properly commented
- [ ] Validation rules are correct
- [ ] Learning objectives are clear
- [ ] Content is accurate and up-to-date

## Best Practices

### Content Writing

1. **Be Clear**: Use simple language; explain concepts before using them
2. **Be Practical**: Include real-world examples and hands-on exercises
3. **Be Consistent**: Use same terminology and formatting throughout
4. **Be Thorough**: Include key points, explanations, and examples
5. **Be Current**: Keep examples and best practices up-to-date

### Naming Conventions

- Paths: `NN-path-name` (numeric prefix, kebab-case)
- Modules: `module-name` (kebab-case)
- Lessons: `lesson-name` (kebab-case)
- IDs: `kebab-case` (no spaces, lowercase)
- Variables in code: `snake_case`
- Classes in code: `PascalCase`

### File Organization

- Keep related content together
- Use consistent naming patterns
- Maintain clear folder structure
- Use indices to link related content
- Document metadata clearly

## Scalability Considerations

- **Content**: Modular structure allows adding paths indefinitely
- **Users**: Platform designed for 1-10,000 concurrent learners
- **Indexing**: Registries should be cached for performance
- **Search**: Content indexed by tags and keywords
- **Analytics**: Track engagement per lesson, assessment, project

## Security Considerations

- Content is read-only from student perspective
- Assessments use backend validation (not client-side)
- Projects require authentication
- Progress is user-specific and protected
- Admin functions require role-based access control

## Testing

All paths, levels, modules should be:
- Functionally tested (content loads, displays correctly)
- Content tested (examples work, code is accurate)
- User tested (appropriate difficulty, clear instructions)
- Assessments validated (scoring works, feedback is helpful)

---

## Quick Reference

**Master Registry**: `data/paths.json` - Complete list of all 10 paths with full hierarchy

**Content Locations**:
- Lessons: `content/paths/XX-path-name/modules/module-name.json`
- Assessments: `content/assessments/assessment-name.json`
- Projects: `content/projects/project-name.json`

**Documentation**:
- Curriculum plans: `docs/curriculum/XX-path-name/`
- Content guidelines: `docs/CONTENT-GUIDE.md`
- Architecture: `docs/ARCHITECTURE.md` (this file)
- Roadmap: `docs/planning/ROADMAP.md`

**Application Integration**:
- Routes handle paths, levels, modules, lessons
- Assessments handled separately
- Projects integrated into curriculum

---

Last updated: March 2026
For questions or clarifications, see CONTENT-GUIDE.md
