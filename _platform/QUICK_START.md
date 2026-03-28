# Quick Start Guide - STEM Learning Platform

## Platform Overview

The STEM Learning Platform is a comprehensive robotics and programming education system with 10 interconnected learning paths.

## Directory Structure

```
_platform/
├── data/              # Platform registries and indices
├── content/           # Curriculum content (JSON)
├── app/              # Application code (React/etc)
├── docs/             # Documentation and planning
└── [index.html]      # Platform entry point
```

## The 10 Learning Paths

1. **Robotics Foundations** - Start here (beginner)
2. **Block Coding** - Visual programming
3. **Python & MicroPython** - Text-based programming
4. **Pybricks for FLL** - FLL competition focus
5. **FTC Java** - FTC competition programming
6. **CAD & 3D Design** - Digital design tools
7. **Robotics Engineering** - Mechanical design
8. **Simulation Lab** - Virtual robotics
9. **3D Printing & Fabrication** - Digital to physical
10. **Portfolio & Engineering Notebook** - Documentation (ongoing)

## Key Files

### Master Registry
- **`data/paths.json`** - Complete structure of all 10 paths with full hierarchy

### Sample Content
- **`content/paths/03-python-micropython/modules/variables-and-types.json`** - Example lesson module with 3 complete lessons
- **`content/assessments/python-basics-checkpoint.json`** - Example 12-question assessment
- **`content/projects/fll-autonomous-mission.json`** - Example project with 5 phases

### Documentation
- **`docs/ARCHITECTURE.md`** - Platform design and structure
- **`docs/CONTENT-GUIDE.md`** - How to write curriculum content
- **`docs/planning/ROADMAP.md`** - 6-phase development roadmap
- **`docs/curriculum/[PATH]/README.md`** - Plan for each of 10 paths

## Getting Started

### To Understand the Platform
1. Read `ARCHITECTURE.md` for the overall design
2. Review `data/paths.json` to see the full structure
3. Look at sample content files for examples

### To Create Content
1. Read `CONTENT-GUIDE.md` completely
2. Use the provided templates
3. Follow the quality checklist
4. Submit for peer review

### To Develop the Frontend
1. Read `ARCHITECTURE.md` section on Data Flow
2. Review the routing scheme
3. Use sample content for mockups
4. Reference the API specifications

### To Plan Curriculum
1. Read the relevant path's README in `docs/curriculum/`
2. Check the ROADMAP for timeline
3. Review CONTENT-GUIDE for standards
4. Start with Priority 1 paths (Foundations, Block Coding)

## Content Organization

Each path has a directory:
```
content/paths/NN-path-name/
├── levels/
│   ├── level-1.json
│   ├── level-2.json
│   └── ...
└── modules/
    ├── module-1.json
    ├── module-2.json
    └── ...
```

Assessments and projects go in:
```
content/assessments/     # Individual assessments
content/projects/        # Major projects
```

## Development Phases

- **Phase 1** ✅ (Complete): Scaffold & Architecture
- **Phase 2** (In Planning): Content Authoring Pipeline (Q1-Q2 2026)
- **Phase 3** (Planned): Student-Facing Features (Q2-Q3 2026)
- **Phase 4** (Planned): Teacher & Admin Tools (Q3 2026)
- **Phase 5** (Planned): Integration with PyLearn (Q4 2026)
- **Phase 6** (Planned): Full Launch (Q4 2026 - Q1 2027)

See `docs/planning/ROADMAP.md` for detailed timeline.

## Content Status

| Path | Status | Modules | Lessons | Assessment | Project |
|------|--------|---------|---------|------------|---------|
| 01 - Robotics Foundations | Planning | — | — | — | — |
| 02 - Block Coding | Planning | — | — | — | — |
| 03 - Python & MicroPython | Planning | 1 Sample | 3 Sample | Sample ✓ | — |
| 04 - Pybricks for FLL | Planning | — | — | — | Sample ✓ |
| 05 - FTC Java | Planning | — | — | — | — |
| 06 - CAD & 3D Design | Planning | — | — | — | — |
| 07 - Robotics Engineering | Planning | — | — | — | — |
| 08 - Simulation Lab | Planning | — | — | — | — |
| 09 - 3D Printing & Fabrication | Planning | — | — | — | — |
| 10 - Portfolio & Notebook | Planning | — | — | — | — |

## Useful Commands

### Validate JSON
```bash
# Check if paths.json is valid
python -m json.tool data/paths.json > /dev/null && echo "Valid!"
```

### Find specific content
```bash
# Find all lesson files
find content/paths -name "*.json"

# Find assessments
find content/assessments -name "*.json"
```

## Key Concepts

### Learning Hierarchy
Path → Level → Module → Lesson → (Explanation, Example, Exercise, Quiz)

### Assessment Types
- **Checkpoint**: Mid-module verification
- **Unit Assessment**: End of level
- **Capstone Project**: Major deliverable

### Content Quality Standards
- Clear, accessible explanations
- Real, tested code examples
- Hands-on exercises with validation
- Detailed quiz explanations
- Professional documentation

## Next Actions

1. **For Content Development**: Review `docs/curriculum/` for your assigned path, follow `CONTENT-GUIDE.md`
2. **For Frontend**: Read `ARCHITECTURE.md` data flow section, use sample content for UI mockups
3. **For Planning**: Check `docs/planning/ROADMAP.md` for timeline and resource requirements
4. **For Feedback**: Contact the curriculum team with questions

## Resources

- **Official Documentation**: `docs/ARCHITECTURE.md` and `docs/CONTENT-GUIDE.md`
- **Sample Content**: Look in `content/` directories
- **Curriculum Plans**: `docs/curriculum/[PATH]/README.md` for each path
- **Development Plan**: `docs/planning/ROADMAP.md`
- **Completion Status**: `COMPLETION_SUMMARY.md`

---

**Platform Version**: 1.0.0 (Foundation)

**Last Updated**: March 25, 2026

**Questions?** Refer to the documentation files or contact the platform team.
