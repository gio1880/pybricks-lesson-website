# Content Creation Guide

## Introduction

This guide provides comprehensive instructions for creating curriculum content for the STEM Learning Platform. Whether you're writing lessons, assessments, or projects, this guide ensures consistency, quality, and effectiveness.

## Before You Start

### Prerequisites
- Understand the platform architecture (see `ARCHITECTURE.md`)
- Know which path and level you're writing for
- Have access to the content templates
- Understand JSON syntax and structure

### Required Information
- Path ID and title
- Level number
- Module name and description
- Learning objectives
- Target audience and prerequisites

### Tools You'll Need
- Text editor (VS Code, Sublime, etc.)
- JSON validator
- Git for version control
- References and resources for the content

---

## Lesson Content Writing

### Overview

A lesson is an individual learning unit that typically takes 15-30 minutes to complete. Each lesson contains four main sections:

1. **Explain** - Theoretical content and key concepts
2. **Example** - Code demonstrations or real-world examples
3. **Exercise** - Hands-on practice with feedback
4. **Quiz** - Knowledge assessment

### JSON Structure

```json
{
  "id": "lesson-id",
  "title": "Lesson Title",
  "type": "lesson",
  "duration": 20,
  "explain": { /* explanation section */ },
  "example": { /* example section */ },
  "exercise": { /* exercise section */ },
  "quiz": { /* quiz section */ }
}
```

### The Explain Section

Purpose: Introduce concepts and theory in clear, accessible language.

**Format:**
```json
"explain": {
  "title": "Understanding [Concept]",
  "content": "Multi-paragraph explanation...",
  "keyPoints": [
    "Key concept 1",
    "Key concept 2",
    "Key concept 3"
  ]
}
```

**Guidelines:**
- Start with a relatable analogy or real-world connection
- Use simple language; avoid jargon or explain it when used
- Break complex concepts into smaller parts
- Use numbered lists for sequences
- Use bullet points for related items
- Keep paragraphs short (3-4 sentences)
- Always include 3-5 key points

**Example:**
```json
"explain": {
  "title": "Understanding Variables",
  "content": "A variable is like a labeled container that holds a value. When you create a variable, you give it a name and assign it a value. The computer remembers that value whenever you use the variable's name.\n\nThink of variables like mail boxes. Each mailbox has a label (the variable name) and contains something inside (the value)...",
  "keyPoints": [
    "Variables are containers that store values",
    "Variables have names that describe what they contain",
    "You can change the value of a variable at any time",
    "Variable names should be descriptive and meaningful"
  ]
}
```

### The Example Section

Purpose: Show how the concept works in practice with concrete code examples.

**Format:**
```json
"example": {
  "title": "Example Title",
  "code": "# Code example here\nprint('Hello')",
  "annotations": [
    {
      "line": 1,
      "note": "Explanation of this line"
    }
  ],
  "output": "Expected output here"
}
```

**Guidelines:**
- Code should be real, working code (test it first!)
- Keep examples focused on one concept
- Include 5-15 lines of code maximum
- Add inline comments in code
- Number lines in annotations (starting at 1)
- Show actual output from running the code
- Use annotations to highlight important parts

**Example:**
```json
"example": {
  "title": "Creating and Using Variables",
  "code": "# Creating variables\nstudent_name = \"Alex\"\nstudent_age = 14\n\n# Using variables\nprint(student_name)\nprint(student_age)",
  "annotations": [
    {
      "line": 2,
      "note": "String variable with a student's name"
    },
    {
      "line": 3,
      "note": "Integer variable with age"
    },
    {
      "line": 6,
      "note": "print() displays the variable value"
    }
  ],
  "output": "Alex\n14"
}
```

### The Exercise Section

Purpose: Provide hands-on practice with self-checking feedback.

**Format:**
```json
"exercise": {
  "title": "Exercise Title",
  "instructions": "Step-by-step instructions...",
  "type": "code|interactive|written",
  "initialCode": "# Starting code template",
  "solution": "# Complete solution",
  "validation": {
    "type": "output_contains|code_check|regex",
    "contains": ["required output", "strings"]
  }
}
```

**Guidelines:**
- Instructions should be numbered steps
- Provide starter code to reduce friction
- Target 10-20 minutes of work
- Use clear, specific instructions
- Include hints if possible
- Validation must be automatic where possible
- Provide full solution for reference

**Example:**
```json
"exercise": {
  "title": "Create Your First Variables",
  "instructions": "1. Create a variable named 'robot_name' with your robot's name\n2. Create a variable named 'battery_level' with a number 0-100\n3. Print both variables",
  "type": "code",
  "initialCode": "# Create your variables here\n\n# Print them\nprint(robot_name)\nprint(battery_level)",
  "solution": "robot_name = \"Speedster\"\nbattery_level = 85\n\nprint(robot_name)\nprint(battery_level)",
  "validation": {
    "type": "output_contains",
    "contains": ["Speedster", "85"]
  }
}
```

### The Quiz Section

Purpose: Check understanding and reinforce learning.

**Format:**
```json
"quiz": {
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "type": "multiple-choice",
      "options": [
        {
          "text": "Correct answer",
          "correct": true,
          "explanation": "Why this is correct..."
        },
        {
          "text": "Wrong answer",
          "correct": false,
          "explanation": "Why this is incorrect..."
        }
      ]
    }
  ]
}
```

**Guidelines:**
- Include 3-5 quiz questions per lesson
- Start with easier questions, progress to harder
- Provide explanations for both correct and incorrect answers
- Use multiple-choice for objective questions
- Use code-based questions to test application
- Avoid trick questions
- Each option should be plausible

**Question Types:**

**Multiple Choice:**
```json
{
  "id": "q1",
  "question": "What will print?",
  "type": "multiple-choice",
  "options": [
    {"text": "Correct", "correct": true, "explanation": "Because..."},
    {"text": "Wrong", "correct": false, "explanation": "Because..."}
  ]
}
```

**Code Exercise:**
```json
{
  "id": "q2",
  "question": "Write code that creates a variable x with value 5",
  "type": "code",
  "validation": {
    "type": "code_check",
    "requirements": ["variable x created", "x equals 5"]
  }
}
```

**Short Answer:**
```json
{
  "id": "q3",
  "question": "Explain what a variable is in 1-2 sentences",
  "type": "essay"
}
```

---

## Module Organization

### Module File Structure

```json
{
  "id": "module-id",
  "title": "Module Title",
  "subtitle": "Optional subtitle",
  "path": "path-id",
  "level": "level-1",
  "module": "mod-1-1",
  "order": 1,
  "description": "What students will learn...",
  "lessons": [ /* array of lesson objects */ ]
}
```

### Guidelines for Modules

- One JSON file per module
- Typically 3-6 lessons per module
- Include module description
- Order lessons from simple to complex
- Last lesson in module should be challenging
- Provide clear learning progression
- Include mix of lesson types

### Example Module Structure

```json
{
  "id": "variables-and-types",
  "title": "Variables and Data Types",
  "path": "python-micropython",
  "level": "level-1",
  "order": 2,
  "description": "Master the fundamental concept of variables and how Python handles different data types.",
  "lessons": [
    {
      "id": "what-are-variables",
      "title": "What Are Variables?",
      "type": "lesson",
      /* ... lesson content ... */
    },
    {
      "id": "numbers-integers-and-floats",
      "title": "Numbers: Integers and Floats",
      "type": "lesson",
      /* ... lesson content ... */
    },
    {
      "id": "strings-and-text",
      "title": "Strings and Text",
      "type": "lesson",
      /* ... lesson content ... */
    }
  ]
}
```

---

## Assessment Writing

### Overview

Assessments check student understanding and are typically placed at the end of levels or modules.

### Structure

```json
{
  "id": "assessment-id",
  "title": "Assessment Title",
  "path": "path-id",
  "level": "level-1",
  "duration": 45,
  "passingScore": 70,
  "categories": {
    "category1": 25,
    "category2": 25,
    "category3": 50
  },
  "questions": [ /* array of questions */ ],
  "feedback": {
    "excellent": { "minScore": 90, "message": "..." },
    "good": { "minScore": 70, "message": "..." },
    "needsWork": { "minScore": 0, "message": "..." }
  }
}
```

### Guidelines

- Mix question types (multiple-choice, code, essay)
- Vary difficulty level (easy, medium, hard)
- Allocate points to measure different competencies
- Set realistic passing score (typically 70%)
- Provide constructive feedback for each score range
- Test both knowledge and application
- Avoid ambiguous questions

### Question Categories

Organize by competency area:
- Conceptual understanding (25%)
- Practical application (25%)
- Problem-solving (25%)
- Integration (25%)

### Example Assessment

```json
{
  "id": "python-basics-checkpoint",
  "title": "Python Basics Assessment",
  "duration": 45,
  "passingScore": 70,
  "categories": {
    "variables": 25,
    "data-types": 20,
    "operations": 25,
    "logic": 30
  },
  "questions": [
    {
      "id": "q1",
      "category": "variables",
      "type": "multiple-choice",
      "difficulty": "easy",
      "question": "Which is a valid variable name?",
      "options": [
        {"text": "my_speed", "correct": true, "explanation": "Valid Python name"},
        {"text": "2speed", "correct": false, "explanation": "Can't start with number"}
      ]
    },
    // More questions...
  ],
  "feedback": {
    "excellent": {
      "minScore": 90,
      "message": "Excellent work! You're ready for advanced topics."
    },
    "good": {
      "minScore": 70,
      "message": "Good understanding. Review areas where you struggled."
    },
    "needsWork": {
      "minScore": 0,
      "message": "More practice needed. Review the lessons again."
    }
  }
}
```

---

## Project Creation

### Overview

Projects are comprehensive learning experiences that integrate multiple skills and result in a tangible deliverable.

### Structure

```json
{
  "id": "project-id",
  "title": "Project Title",
  "description": "What students will build",
  "path": "path-id",
  "level": "level-3",
  "difficulty": "intermediate",
  "duration": "4-6 weeks",
  "learningObjectives": [ /* 5-7 key objectives */ ],
  "phases": [ /* 4-5 project phases with tasks */ ],
  "successCriteria": [ /* specific, measurable criteria */ ],
  "rubric": { /* detailed grading rubric */ }
}
```

### Project Phases

Each project should have 4-5 phases:

1. **Planning & Design** (3-4 days)
   - Understand requirements
   - Design approach
   - Prepare materials

2. **Foundation** (3-5 days)
   - Build core functionality
   - Test basic features
   - Refine approach

3. **Implementation** (4-7 days)
   - Add features
   - Integrate components
   - Test thoroughly

4. **Optimization & Testing** (2-3 days)
   - Improve performance
   - Handle edge cases
   - Final testing

5. **Documentation & Presentation** (2-3 days)
   - Write documentation
   - Prepare presentation
   - Reflect on learning

### Success Criteria

Write specific, measurable criteria:

**Good**:
- "Autonomous program completes 3 missions reliably (80%+ success)"
- "Code includes 5+ well-named functions with documentation"
- "Robot navigates field in under 30 seconds"

**Poor**:
- "Robot works well"
- "Code is organized"
- "Documentation is complete"

### Rubric Structure

```json
"rubric": {
  "criterion1": {
    "excellent": "Clear description of excellent work",
    "good": "Clear description of good work",
    "satisfactory": "Clear description of satisfactory work",
    "needsImprovement": "Clear description of needs improvement"
  }
}
```

### Example Project

See `content/projects/fll-autonomous-mission.json` for a complete example.

---

## Writing Tips & Best Practices

### Clarity & Accessibility

1. **Use Simple Language**
   - Avoid unnecessary jargon
   - Explain technical terms when first used
   - Use concrete examples
   - Keep sentences short

2. **Be Consistent**
   - Use same terminology throughout
   - Follow naming conventions
   - Maintain consistent style
   - Use consistent formatting

3. **Make It Relatable**
   - Connect to real-world applications
   - Use relevant examples
   - Reference student interests
   - Show practical value

4. **Be Precise**
   - Avoid vague language
   - Be specific about expectations
   - Give exact output examples
   - Use "should" for requirements

### Code Example Standards

**Always:**
- Test code before including (does it actually work?)
- Use realistic examples
- Follow Python/Java best practices
- Include comments for clarity
- Use meaningful variable names
- Keep examples focused

**Never:**
- Include code with errors
- Use cryptic variable names (x, y, foo)
- Mix multiple concepts in one example
- Skip important steps
- Use outdated syntax

### Robotics-Specific Writing

1. **Hardware References**
   - Be specific about sensors/motors
   - Include port numbers and connections
   - Specify motor directions
   - Note calibration requirements

2. **Real-World Context**
   - Connect to actual competitions
   - Reference field layouts
   - Discuss mission strategies
   - Share team experiences

3. **Testing Guidance**
   - Explain how to test code
   - Provide expected results
   - Discuss debugging approaches
   - Share common mistakes

### Quality Checklist

Before publishing, verify:

- [ ] **Content Clarity**
  - [ ] Explanations are clear and accessible
  - [ ] Technical terms are defined
  - [ ] Examples are realistic and working

- [ ] **Code Quality**
  - [ ] All code examples have been tested
  - [ ] Code follows style guidelines
  - [ ] Variable names are meaningful
  - [ ] Comments explain key concepts

- [ ] **Exercise Quality**
  - [ ] Instructions are step-by-step
  - [ ] Starter code reduces friction
  - [ ] Validation rules are correct
  - [ ] Solution is provided

- [ ] **Assessment Quality**
  - [ ] Questions are clear and unambiguous
  - [ ] Mix of question types
  - [ ] Difficulty varies
  - [ ] Explanations are helpful

- [ ] **Format & Structure**
  - [ ] JSON is valid
  - [ ] All required fields present
  - [ ] IDs are unique and meaningful
  - [ ] Ordering is logical

- [ ] **Learning Progression**
  - [ ] Builds on prerequisites
  - [ ] Difficulty increases appropriately
  - [ ] Mix of theory and practice
  - [ ] Recap and reinforcement

---

## Content Templates

### Lesson Template

```json
{
  "id": "lesson-id",
  "title": "Lesson Title",
  "type": "lesson",
  "duration": 20,
  "explain": {
    "title": "Understanding [Concept]",
    "content": "Start with a relatable analogy or context. Then explain the core concept in 2-3 sentences. Provide additional context or examples. Explain why this matters.",
    "keyPoints": [
      "Key concept 1",
      "Key concept 2",
      "Key concept 3",
      "Key concept 4"
    ]
  },
  "example": {
    "title": "Example: [Specific Example]",
    "code": "# Real, tested code example\n# Keep it focused on one concept\nprint('Hello')",
    "annotations": [
      {
        "line": 1,
        "note": "Explanation of this line"
      }
    ],
    "output": "Hello"
  },
  "exercise": {
    "title": "Practice: [Task Name]",
    "instructions": "1. First step\n2. Second step\n3. Third step",
    "type": "code",
    "initialCode": "# Starter code\n# Students fill in missing parts\nprint()",
    "solution": "# Complete working solution",
    "validation": {
      "type": "output_contains",
      "contains": ["expected", "output"]
    }
  },
  "quiz": {
    "questions": [
      {
        "id": "q1",
        "question": "Question about the concept?",
        "type": "multiple-choice",
        "options": [
          {
            "text": "Correct answer",
            "correct": true,
            "explanation": "This is correct because..."
          },
          {
            "text": "Incorrect answer",
            "correct": false,
            "explanation": "This is incorrect because..."
          }
        ]
      }
    ]
  }
}
```

### Module Template

```json
{
  "id": "module-id",
  "title": "Module Title",
  "subtitle": "What students will learn",
  "path": "path-id",
  "level": "level-1",
  "module": "mod-1-1",
  "order": 1,
  "description": "Brief overview of module content and learning outcomes.",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "First Lesson: Introduction",
      /* ... lesson content ... */
    },
    {
      "id": "lesson-2",
      "title": "Second Lesson: Core Concept",
      /* ... lesson content ... */
    },
    {
      "id": "lesson-3",
      "title": "Third Lesson: Application",
      /* ... lesson content ... */
    }
  ]
}
```

### Assessment Template

```json
{
  "id": "assessment-id",
  "title": "Assessment: [Topic]",
  "description": "Brief description of what is being assessed",
  "path": "path-id",
  "level": "level-1",
  "duration": 30,
  "passingScore": 70,
  "categories": {
    "concept": 30,
    "application": 40,
    "analysis": 30
  },
  "questions": [
    {
      "id": "q1",
      "category": "concept",
      "type": "multiple-choice",
      "difficulty": "easy",
      "question": "Basic knowledge question?",
      "options": [
        {"text": "Correct", "correct": true, "explanation": "..."},
        {"text": "Wrong", "correct": false, "explanation": "..."}
      ]
    }
  ],
  "feedback": {
    "excellent": {
      "minScore": 90,
      "message": "Congratulations! You've mastered this topic."
    },
    "good": {
      "minScore": 70,
      "message": "Good work! Review any weak areas."
    },
    "needsWork": {
      "minScore": 0,
      "message": "More practice needed. Review the lessons."
    }
  }
}
```

### Project Template

```json
{
  "id": "project-id",
  "title": "Project: [Name]",
  "subtitle": "Brief tagline",
  "description": "What students will build and learn",
  "path": "path-id",
  "level": "level-3",
  "difficulty": "intermediate",
  "duration": "4-6 weeks",
  "learningObjectives": [
    "Objective 1",
    "Objective 2",
    "Objective 3"
  ],
  "phases": [
    {
      "id": "phase-1",
      "title": "Planning",
      "duration": "3-4 days",
      "tasks": [
        {
          "id": "task-1-1",
          "title": "Task Name",
          "description": "What to do",
          "deliverable": "What to turn in"
        }
      ]
    }
  ],
  "successCriteria": [
    {
      "criterion": "Criterion 1",
      "description": "Specific, measurable requirement",
      "evidence": "How to verify"
    }
  ],
  "rubric": {
    "criterion": {
      "excellent": "Description",
      "good": "Description",
      "satisfactory": "Description",
      "needsImprovement": "Description"
    }
  }
}
```

---

## File Naming Conventions

### Lesson & Module Files
- Use kebab-case (lowercase with hyphens)
- Be descriptive but concise
- Examples:
  - `variables-and-types.json`
  - `motor-control-basics.json`
  - `debugging-techniques.json`

### Assessment Files
- Pattern: `[topic]-[assessment-type].json`
- Examples:
  - `python-basics-checkpoint.json`
  - `fll-navigation-quiz.json`
  - `ftc-programming-final.json`

### Project Files
- Pattern: `[project-name].json`
- Examples:
  - `fll-autonomous-mission.json`
  - `robot-design-challenge.json`
  - `engineering-competition.json`

### Directory Structure
```
content/
├── paths/
│   ├── 01-robotics-foundations/
│   │   ├── levels/
│   │   │   └── level-1.json
│   │   └── modules/
│   │       ├── introduction-to-robotics.json
│   │       └── motors-and-motion.json
│   ├── 02-block-coding/
│   └── [...]
├── assessments/
│   ├── python-basics-checkpoint.json
│   └── [...]
└── projects/
    ├── fll-autonomous-mission.json
    └── [...]
```

---

## Peer Review Process

### Before Review
1. Run JSON validator - must be valid JSON
2. Test all code examples - they must work
3. Check all required fields present
4. Verify naming conventions followed
5. Self-review against quality checklist

### Review Checklist for Peers

**Content Quality**
- [ ] Explanations are clear and accurate
- [ ] Examples are realistic and helpful
- [ ] Code examples have been tested
- [ ] Exercises match learning objectives
- [ ] Quizzes accurately test learning

**Writing Quality**
- [ ] Grammar and spelling correct
- [ ] Language is accessible
- [ ] Consistent tone and style
- [ ] Proper technical terminology
- [ ] No jargon without explanation

**Structure & Format**
- [ ] All required JSON fields present
- [ ] Proper JSON formatting and validity
- [ ] IDs are unique and meaningful
- [ ] Proper ordering and sequencing
- [ ] Annotations align with code

**Learning Design**
- [ ] Appropriate for target level
- [ ] Builds on prerequisites
- [ ] Sufficient practice provided
- [ ] Clear learning objectives
- [ ] Mix of theory and practice

**Technical Accuracy**
- [ ] Code examples are correct
- [ ] Output matches expectations
- [ ] Explanations are technically accurate
- [ ] Robotics examples are practical
- [ ] Best practices demonstrated

### Reviewer Sign-Off

```json
{
  "reviewed_by": "Reviewer Name",
  "date": "2026-03-25",
  "status": "approved|needs_revision",
  "comments": "Optional comments or suggestions"
}
```

---

## Common Mistakes to Avoid

1. **Vague Learning Objectives**
   - ❌ "Learn about variables"
   - ✅ "Create and use variables to store robot sensor data"

2. **Untested Code Examples**
   - ❌ Copy-pasted code that might have errors
   - ✅ Code you've actually run and verified

3. **Inconsistent Terminology**
   - ❌ Switching between "wheel" and "tire" or "motor" and "engine"
   - ✅ Define terms once, use consistently

4. **Missing Explanations**
   - ❌ "Here's the code" (just showing code)
   - ✅ "Here's what this does and why" (explained)

5. **Too Complex Examples**
   - ❌ 50 lines mixing 5 concepts
   - ✅ 10 lines focusing on one concept

6. **Unclear Exercises**
   - ❌ "Make something interesting"
   - ✅ "Create a function that moves the robot forward 50 cm"

7. **Ambiguous Questions**
   - ❌ "What is best?"
   - ✅ "Which approach is most energy-efficient?"

8. **Inconsistent Formatting**
   - ❌ Different quote styles, indentation, spacing
   - ✅ Consistent style throughout

---

## Getting Help

### Questions About:

- **Platform Architecture**: See `ARCHITECTURE.md`
- **Development Roadmap**: See `docs/planning/ROADMAP.md`
- **Specific Paths**: See `docs/curriculum/[path]/README.md`
- **JSON Syntax**: Use online JSON validator or editor
- **Content Style**: Check existing published content for examples

### Resources

- Sample lesson: `content/paths/03-python-micropython/modules/variables-and-types.json`
- Sample assessment: `content/assessments/python-basics-checkpoint.json`
- Sample project: `content/projects/fll-autonomous-mission.json`
- Templates: See "Content Templates" section above

---

## Quality Assurance Checklist

Before marking content as complete:

**Content**
- [ ] All explanations use clear language
- [ ] Key points are relevant and important
- [ ] Examples are realistic and working
- [ ] Exercises have clear instructions
- [ ] Quizzes test understanding
- [ ] Difficulty matches learning level

**Code**
- [ ] All examples tested and working
- [ ] Code follows style guidelines
- [ ] Variable names are meaningful
- [ ] Comments explain key parts
- [ ] Output shown is accurate

**Format**
- [ ] Valid JSON (validated)
- [ ] All required fields present
- [ ] IDs are unique
- [ ] Naming conventions followed
- [ ] Proper indentation

**Learning Design**
- [ ] Addresses learning objectives
- [ ] Builds on prerequisites
- [ ] Mix of theory and practice
- [ ] Appropriate for target level
- [ ] Logical sequence

**Accuracy**
- [ ] Technical content accurate
- [ ] Robotics examples practical
- [ ] Best practices demonstrated
- [ ] No outdated information
- [ ] Peer reviewed and approved

---

Last updated: March 2026

For examples and templates, see the sample content files in `content/`.

For questions, refer to the specific path curriculum documentation or contact the curriculum team.
