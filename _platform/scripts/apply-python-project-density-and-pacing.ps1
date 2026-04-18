$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$dataPath = Join-Path $root "data/paths.json"
$data = Get-Content $dataPath -Raw | ConvertFrom-Json

$python = $data | Where-Object { $_.id -eq "python-micropython" }
if (-not $python) {
  throw "Could not find python-micropython in data/paths.json"
}

$pythonProjectMap = @{
  "mod-1-1" = @{ id = "project-1-1"; title = "Robot Status Console" }
  "mod-1-2" = @{ id = "project-1-2"; title = "Robot Config Validator" }
  "mod-1-3" = @{ id = "project-1-3"; title = "Mission Score Calculator" }
  "mod-2-1" = @{ id = "project-2-1"; title = "Safety Decision Engine" }
  "mod-2-2" = @{ id = "project-2-2"; title = "Autonomous Retry Controller" }
  "mod-3-1" = @{ id = "project-3-1"; title = "Robot Utilities Library" }
  "mod-3-2" = @{ id = "project-3-2"; title = "Sensor Log Analyzer" }
  "mod-4-1" = @{ id = "project-4-1"; title = "Hub Diagnostic Script" }
  "mod-4-2" = @{ id = "project-4-2"; title = "Line Follow and Stop Utility" }
}

# 1) Update data/paths.json for Python modules to include module-end project entries.
foreach ($level in $python.levels) {
  foreach ($module in $level.modules) {
    $projectMeta = $pythonProjectMap[$module.id]
    if (-not $projectMeta) { continue }

    $existingProject = $module.lessons | Where-Object { $_.type -eq "project" }
    if ($existingProject) {
      $existingProject.id = $projectMeta.id
      $existingProject.title = $projectMeta.title
    } else {
      $module.lessons += [pscustomobject]@{
        id = $projectMeta.id
        title = $projectMeta.title
        type = "project"
      }
    }
  }
}

$data | ConvertTo-Json -Depth 100 | Set-Content -Path $dataPath -Encoding UTF8

# 2) Update python module JSON files with project lesson bodies and tuned pacing.
$pythonModuleDir = Join-Path $root "content/paths/03-python-micropython/modules"
$moduleFiles = Get-ChildItem $pythonModuleDir -Filter "*.json"

function New-PythonProjectLesson {
  param(
    [string]$lessonId,
    [string]$lessonTitle,
    [string]$moduleTitle
  )

  $code = @"
# $lessonTitle
battery_level = 82
target_distance_cm = 35
path_clear = True

if path_clear and battery_level > 40:
    print(f"Run mission to {target_distance_cm}cm")
else:
    print("Hold and recheck")
"@

  return [ordered]@{
    id = $lessonId
    title = $lessonTitle
    type = "project"
    duration = 60
    explain = [ordered]@{
      title = "Project Brief: $lessonTitle"
      content = "This module-end project applies concepts from '$moduleTitle' to a useful robot utility students can run, test, and iterate."
      keyPoints = @(
        "Build practical utility, not just syntax drills",
        "Use clear variable names and modular logic",
        "Validate expected output with test cases",
        "Reflect on reliability improvements"
      )
    }
    example = [ordered]@{
      title = "Starter Utility Pattern"
      code = $code
      annotations = @(
        [ordered]@{ line = 2; note = "Define measurable runtime state" },
        [ordered]@{ line = 5; note = "Use boolean logic for go or hold decisions" },
        [ordered]@{ line = 6; note = "Emit clear operational output" }
      )
      output = "Run mission to 35cm"
    }
    exercise = [ordered]@{
      title = "Build and Demonstrate"
      instructions = "1. Build the full utility for this module topic.`n2. Include at least one function and one validation check.`n3. Run three test cases and log outputs.`n4. Add one improvement for readability or reliability.`n5. Submit code and short reflection."
      type = "code"
      initialCode = $code
      solution = $code
      validation = [ordered]@{
        type = "output_contains"
        contains = @("Run mission", "Hold")
      }
    }
    quiz = [ordered]@{
      questions = @(
        [ordered]@{
          id = "q1"
          question = "What is the primary goal of this project lesson?"
          type = "multiple-choice"
          options = @(
            [ordered]@{ text = "Create a useful module-level coding utility"; correct = $true },
            [ordered]@{ text = "Memorize syntax with no application"; correct = $false },
            [ordered]@{ text = "Skip testing and iteration"; correct = $false },
            [ordered]@{ text = "Write code without output checks"; correct = $false }
          )
        },
        [ordered]@{
          id = "q2"
          question = "What makes a student project more reliable?"
          type = "multiple-choice"
          options = @(
            [ordered]@{ text = "Multiple test cases and explicit validation"; correct = $true },
            [ordered]@{ text = "One single run only"; correct = $false },
            [ordered]@{ text = "Removing checks to save time"; correct = $false },
            [ordered]@{ text = "Hardcoded behavior with no review"; correct = $false }
          )
        }
      )
    }
  }
}

foreach ($file in $moduleFiles) {
  $doc = Get-Content $file.FullName -Raw | ConvertFrom-Json
  $moduleId = $doc.module
  $projectMeta = $pythonProjectMap[$moduleId]
  if (-not $projectMeta) { continue }

  $projectLesson = $doc.lessons | Where-Object { $_.type -eq "project" }
  if ($projectLesson) {
    # Replace existing project lesson with tuned version and standardized 60-minute pacing.
    $doc.lessons = @($doc.lessons | Where-Object { $_.type -ne "project" })
  }

  $newProject = New-PythonProjectLesson -lessonId $projectMeta.id -lessonTitle $projectMeta.title -moduleTitle $doc.title
  $doc.lessons += $newProject

  $doc | ConvertTo-Json -Depth 100 | Set-Content -Path $file.FullName -Encoding UTF8
}

# 3) Tune FTC module project pacing to 90 minutes (two class blocks).
$ftcModuleDir = Join-Path $root "content/paths/05-ftc-java/modules"
$ftcFiles = Get-ChildItem $ftcModuleDir -Filter "*.json"

foreach ($f in $ftcFiles) {
  $doc = Get-Content $f.FullName -Raw | ConvertFrom-Json
  foreach ($lesson in $doc.lessons) {
    if ($lesson.type -eq "project") {
      $lesson.duration = 90
      if ($lesson.exercise -and $lesson.exercise.instructions) {
        $lesson.exercise.instructions = "1. Implement the full project in Java using module concepts.`n2. Include robust structure (classes/methods) and telemetry or output checks.`n3. Run and record at least three test scenarios.`n4. Add one fallback or recovery behavior.`n5. Package for team review."
      }
    }
  }
  $doc | ConvertTo-Json -Depth 100 | Set-Content -Path $f.FullName -Encoding UTF8
}

# 4) Write four level-end Python integration project files.
$projectDir = Join-Path $root "content/projects"
$pythonLevelProjects = @(
  [ordered]@{
    id = "python-level-1-foundations-utility-challenge"
    title = "Python Level 1 Foundations Utility Challenge"
    description = "Build a practical command-line utility that tracks robot setup, config, and simple mission metrics."
    level = "level-1"
    difficulty = "beginner"
    duration = "1 week"
  },
  [ordered]@{
    id = "python-level-2-control-flow-challenge"
    title = "Python Level 2 Control Flow Challenge"
    description = "Create a decision-driven controller script with retries, safeguards, and status outputs."
    level = "level-2"
    difficulty = "beginner-to-intermediate"
    duration = "1-2 weeks"
  },
  [ordered]@{
    id = "python-level-3-functions-data-challenge"
    title = "Python Level 3 Functions and Data Challenge"
    description = "Develop a modular data-processing utility for sensor logs and mission analytics."
    level = "level-3"
    difficulty = "intermediate"
    duration = "1-2 weeks"
  },
  [ordered]@{
    id = "python-level-4-micropython-hardware-capstone"
    title = "Python Level 4 MicroPython Hardware Capstone"
    description = "Deliver a tested MicroPython utility package for motor and sensor operations on robot hardware."
    level = "level-4"
    difficulty = "intermediate"
    duration = "2 weeks"
  }
)

foreach ($p in $pythonLevelProjects) {
  $projectDoc = [ordered]@{
    id = $p.id
    title = $p.title
    description = $p.description
    path = "python-micropython"
    level = $p.level
    difficulty = $p.difficulty
    duration = $p.duration
    learningObjectives = @(
      "Integrate module concepts into a real utility",
      "Design readable, testable Python code",
      "Validate behavior across multiple cases",
      "Document decisions and improvements"
    )
    phases = @(
      [ordered]@{ id = "phase-1"; title = "Planning"; duration = "1-2 days"; tasks = @([ordered]@{ id = "task-1-1"; title = "Define utility goals"; deliverable = "Goals and requirements checklist" }, [ordered]@{ id = "task-1-2"; title = "Design flow"; deliverable = "Pseudo-flow and test plan" }) },
      [ordered]@{ id = "phase-2"; title = "Build"; duration = "2-4 days"; tasks = @([ordered]@{ id = "task-2-1"; title = "Implement core logic"; deliverable = "Working utility" }, [ordered]@{ id = "task-2-2"; title = "Add validation"; deliverable = "Reliable handling for expected inputs" }) },
      [ordered]@{ id = "phase-3"; title = "Test and Improve"; duration = "1-2 days"; tasks = @([ordered]@{ id = "task-3-1"; title = "Run test cases"; deliverable = "Test log and outputs" }, [ordered]@{ id = "task-3-2"; title = "Refine reliability"; deliverable = "Improved consistency" }) },
      [ordered]@{ id = "phase-4"; title = "Document and Demo"; duration = "1 day"; tasks = @([ordered]@{ id = "task-4-1"; title = "Write usage notes"; deliverable = "Short readme and reflection" }, [ordered]@{ id = "task-4-2"; title = "Demo utility"; deliverable = "Instructor or peer walkthrough" }) }
    )
    successCriteria = @(
      [ordered]@{ criterion = "Utility Value"; description = "Project solves a practical robotics workflow need" },
      [ordered]@{ criterion = "Code Quality"; description = "Readable and maintainable Python structure" },
      [ordered]@{ criterion = "Reliability"; description = "Behavior verified with multiple test cases" },
      [ordered]@{ criterion = "Communication"; description = "Clear demonstration and documentation" }
    )
  }

  $out = Join-Path $projectDir ("{0}.json" -f $p.id)
  $projectDoc | ConvertTo-Json -Depth 100 | Set-Content -Path $out -Encoding UTF8
}

# 5) Validation
$toValidate = @(
  $dataPath,
  (Get-ChildItem $pythonModuleDir -Filter "*.json" | Select-Object -ExpandProperty FullName),
  (Get-ChildItem $ftcModuleDir -Filter "*.json" | Select-Object -ExpandProperty FullName),
  (Get-ChildItem $projectDir -Filter "python-level-*.json" | Select-Object -ExpandProperty FullName)
)

$invalid = @()
foreach ($filePath in $toValidate) {
  try {
    Get-Content $filePath -Raw | ConvertFrom-Json | Out-Null
  } catch {
    $invalid += $filePath
  }
}

Write-Output "Python project density and pacing updates applied."
Write-Output "Python modules updated: $($moduleFiles.Count)"
Write-Output "FTC modules tuned for project pacing: $($ftcFiles.Count)"
Write-Output "Python level project files: $((Get-ChildItem $projectDir -Filter 'python-level-*.json').Count)"
if ($invalid.Count -eq 0) {
  Write-Output "Validation: all JSON valid"
} else {
  Write-Output "Validation failed for:"
  $invalid | ForEach-Object { Write-Output " - $_" }
}
