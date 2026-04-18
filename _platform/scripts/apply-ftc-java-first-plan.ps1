$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$dataPath = Join-Path $root "data/paths.json"
$data = Get-Content $dataPath -Raw | ConvertFrom-Json

$ftc = $data | Where-Object { $_.id -eq "ftc-java" }
if (-not $ftc) {
  throw "Could not find ftc-java path in data/paths.json"
}

$ftc.subtitle = "Java First, Then FTC Competition Programming"
$ftc.description = "Build strong Java fundamentals first, then apply them to FTC SDK development for reliable teleop and autonomous competition programs."

$newLevels = @(
  [pscustomobject]@{
    id = "level-1"
    title = "Java Core Foundations"
    subtitle = "Language essentials before robotics SDKs"
    order = 1
    modules = @(
      [pscustomobject]@{
        id = "mod-1-1"
        title = "Java Setup and Syntax"
        description = "Set up Java and learn the structure of runnable programs"
        order = 1
        lessons = @(
          [pscustomobject]@{ id = "lesson-1-1-1"; title = "Installing JDK and Running Java"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-1-1-2"; title = "Java Program Structure and main"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-1-1-3"; title = "Variables and Primitive Types"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-1-1-4"; title = "Input, Output, and Debug Prints"; type = "lesson" },
          [pscustomobject]@{ id = "checkpoint-1-1"; title = "Java Foundations Check"; type = "assessment" },
          [pscustomobject]@{ id = "project-1-1"; title = "Robot Status Console"; type = "project" }
        )
      },
      [pscustomobject]@{
        id = "mod-1-2"
        title = "Control Flow and Methods"
        description = "Decisions, loops, and reusable methods"
        order = 2
        lessons = @(
          [pscustomobject]@{ id = "lesson-1-2-1"; title = "if else Decision Logic"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-1-2-2"; title = "for and while Loops"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-1-2-3"; title = "Methods, Parameters, and Returns"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-1-2-4"; title = "Method Decomposition for Reuse"; type = "lesson" },
          [pscustomobject]@{ id = "checkpoint-1-2"; title = "Control Flow Check"; type = "assessment" },
          [pscustomobject]@{ id = "project-1-2"; title = "Mission Command Simulator"; type = "project" }
        )
      }
    )
  },
  [pscustomobject]@{
    id = "level-2"
    title = "Java Core for Robotics Software"
    subtitle = "OOP, robustness, and state modeling"
    order = 2
    modules = @(
      [pscustomobject]@{
        id = "mod-2-1"
        title = "Object-Oriented Java"
        description = "Classes, interfaces, and subsystem modeling"
        order = 1
        lessons = @(
          [pscustomobject]@{ id = "lesson-2-1-1"; title = "Classes and Objects"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-2-1-2"; title = "Encapsulation and Constructors"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-2-1-3"; title = "Inheritance and Interfaces"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-2-1-4"; title = "Modeling Robot Subsystems as Classes"; type = "lesson" },
          [pscustomobject]@{ id = "checkpoint-2-1"; title = "OOP Check"; type = "assessment" },
          [pscustomobject]@{ id = "project-2-1"; title = "Subsystem Class Library"; type = "project" }
        )
      },
      [pscustomobject]@{
        id = "mod-2-2"
        title = "Collections, Exceptions, and State"
        description = "Structured data, error handling, and state machines"
        order = 2
        lessons = @(
          [pscustomobject]@{ id = "lesson-2-2-1"; title = "Arrays, Lists, and Maps"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-2-2-2"; title = "Exception Handling and Safe Fallbacks"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-2-2-3"; title = "Enums and State Machines"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-2-2-4"; title = "Logging and Configuration Basics"; type = "lesson" },
          [pscustomobject]@{ id = "checkpoint-2-2"; title = "Java Robustness Check"; type = "assessment" },
          [pscustomobject]@{ id = "project-2-2"; title = "Match Strategy Planner Engine"; type = "project" }
        )
      }
    )
  },
  [pscustomobject]@{
    id = "level-3"
    title = "FTC SDK Transition"
    subtitle = "Apply Java skills inside the FTC stack"
    order = 3
    modules = @(
      [pscustomobject]@{
        id = "mod-3-1"
        title = "FTC SDK Fundamentals"
        description = "OpModes, lifecycle, hardware mapping, and telemetry"
        order = 1
        lessons = @(
          [pscustomobject]@{ id = "lesson-3-1-1"; title = "FTC Control System and App Roles"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-3-1-2"; title = "OpModes and Lifecycle"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-3-1-3"; title = "HardwareMap and Device Initialization"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-3-1-4"; title = "Telemetry, Timing, and Debugging"; type = "lesson" },
          [pscustomobject]@{ id = "checkpoint-3-1"; title = "SDK Basics Check"; type = "assessment" },
          [pscustomobject]@{ id = "project-3-1"; title = "Sensor Health Monitor OpMode"; type = "project" }
        )
      },
      [pscustomobject]@{
        id = "mod-3-2"
        title = "OnBot Java and Android Studio Workflow"
        description = "Development workflows for FTC teams"
        order = 2
        lessons = @(
          [pscustomobject]@{ id = "lesson-3-2-1"; title = "OnBot Java Workflow"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-3-2-2"; title = "Android Studio Project Structure"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-3-2-3"; title = "Build, Deploy, and Iterative Testing"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-3-2-4"; title = "Team Workflow and Version Control"; type = "lesson" },
          [pscustomobject]@{ id = "checkpoint-3-2"; title = "Dev Workflow Check"; type = "assessment" },
          [pscustomobject]@{ id = "project-3-2"; title = "Deployment and Test Harness"; type = "project" }
        )
      }
    )
  },
  [pscustomobject]@{
    id = "level-4"
    title = "Competition Programming"
    subtitle = "Teleop and autonomous systems for match play"
    order = 4
    modules = @(
      [pscustomobject]@{
        id = "mod-4-1"
        title = "Teleop Architecture"
        description = "Driver control systems and subsystem coordination"
        order = 1
        lessons = @(
          [pscustomobject]@{ id = "lesson-4-1-1"; title = "Gamepad Mapping and Input Layers"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-4-1-2"; title = "Drive Control Tank and Mecanum"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-4-1-3"; title = "Multi Subsystem Coordination"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-4-1-4"; title = "Driver Feedback and Safety Controls"; type = "lesson" },
          [pscustomobject]@{ id = "checkpoint-4-1"; title = "Teleop Quality Check"; type = "assessment" },
          [pscustomobject]@{ id = "project-4-1"; title = "Competition Teleop Program"; type = "project" }
        )
      },
      [pscustomobject]@{
        id = "mod-4-2"
        title = "Autonomous Architecture"
        description = "Reliable autonomous routines with sensing and recovery"
        order = 2
        lessons = @(
          [pscustomobject]@{ id = "lesson-4-2-1"; title = "Autonomous Routine Structure"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-4-2-2"; title = "IMU Odometry and Pose Concepts"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-4-2-3"; title = "Vision Detection Integration"; type = "lesson" },
          [pscustomobject]@{ id = "lesson-4-2-4"; title = "Recovery Logic and Reliability Tuning"; type = "lesson" },
          [pscustomobject]@{ id = "checkpoint-4-2"; title = "Autonomous Readiness Check"; type = "assessment" },
          [pscustomobject]@{ id = "project-4-2"; title = "Competition Autonomous Mission"; type = "project" }
        )
      }
    )
  }
)

$ftc.levels = $newLevels

$data | ConvertTo-Json -Depth 100 | Set-Content -Path $dataPath -Encoding UTF8

$moduleFileMap = @{
  "mod-1-1" = "ftc-overview.json"
  "mod-1-2" = "ftc-blocks-introduction.json"
  "mod-2-1" = "java-fundamentals.json"
  "mod-2-2" = "object-oriented-programming.json"
  "mod-3-1" = "onbot-java.json"
  "mod-3-2" = "android-studio-development.json"
  "mod-4-1" = "teleop-programming.json"
  "mod-4-2" = "autonomous-programming.json"
}

$moduleDir = Join-Path $root "content/paths/05-ftc-java/modules"
if (-not (Test-Path $moduleDir)) {
  New-Item -ItemType Directory -Path $moduleDir | Out-Null
}

function New-FtcLessonBody {
  param(
    [object]$lessonMeta,
    [string]$moduleTitle,
    [string]$levelId
  )

  $type = $lessonMeta.type
  $duration = switch ($type) {
    "assessment" { 25 }
    "project" { 75 }
    default { 25 }
  }

  $useSdk = $levelId -in @("level-3", "level-4")
  $code = if ($useSdk) {
@"
// $($lessonMeta.title)
@TeleOp(name = "HealthCheck")
public class HealthCheckOpMode extends LinearOpMode {
    @Override
    public void runOpMode() {
        waitForStart();
        telemetry.addData("status", "running");
        telemetry.update();
    }
}
"@
  } else {
@"
// $($lessonMeta.title)
public class LessonSnippet {
    public static void main(String[] args) {
        int missionScore = 42;
        boolean ready = true;
        if (ready) {
            System.out.println("Mission score: " + missionScore);
        }
    }
}
"@
  }

  $exerciseTitle = if ($type -eq "project") { "Build Project: $($lessonMeta.title)" } else { "Practice: $($lessonMeta.title)" }
  $exerciseInstructions = if ($type -eq "project") {
    "1. Build a working version of this project in Java.`n2. Include clear class/method names and comments where needed.`n3. Add at least one reliability safeguard (validation, fallback, or error handling).`n4. Demonstrate the project and record expected output/behavior.`n5. Reflect on one improvement for the next iteration."
  } else {
    "1. Recreate the example logic with your own variable names.`n2. Modify one condition or value and predict output.`n3. Run and compare expected vs actual behavior.`n4. Add one readability or reliability improvement."
  }

  [ordered]@{
    id = $lessonMeta.id
    title = $lessonMeta.title
    type = $type
    duration = $duration
    explain = [ordered]@{
      title = "Understanding $($lessonMeta.title)"
      content = "This lesson develops practical skill in $($lessonMeta.title) within '$moduleTitle'. Students apply Java-first thinking, then connect it to robotics execution and reliability."
      keyPoints = @(
        "Apply core Java concepts before FTC-specific abstractions",
        "Use clear code structure and naming",
        "Validate behavior through output or telemetry",
        "Build toward competition-ready reliability"
      )
    }
    example = [ordered]@{
      title = "$($lessonMeta.title) Example"
      code = $code
      annotations = @(
        [ordered]@{ line = 3; note = "Define core runtime structure" },
        [ordered]@{ line = 5; note = "Initialize key values for control logic" },
        [ordered]@{ line = 7; note = "Report state for verification" }
      )
      output = if ($useSdk) { "status: running" } else { "Mission score: 42" }
    }
    exercise = [ordered]@{
      title = $exerciseTitle
      instructions = $exerciseInstructions
      type = "code"
      initialCode = $code
      solution = $code
      validation = [ordered]@{
        type = "output_contains"
        contains = if ($useSdk) { @("status", "running") } else { @("Mission score", "42") }
      }
    }
    quiz = [ordered]@{
      questions = @(
        [ordered]@{
          id = "q1"
          question = "Why do we front-load standard Java before deeper FTC SDK work?"
          type = "multiple-choice"
          options = @(
            [ordered]@{ text = "To build stronger software foundations and reduce SDK confusion"; correct = $true },
            [ordered]@{ text = "Because FTC does not use Java"; correct = $false },
            [ordered]@{ text = "To avoid writing projects"; correct = $false },
            [ordered]@{ text = "Because testing is optional"; correct = $false }
          )
        },
        [ordered]@{
          id = "q2"
          question = "What improves reliability in competition code?"
          type = "multiple-choice"
          options = @(
            [ordered]@{ text = "Clear structure plus validation and fallback behavior"; correct = $true },
            [ordered]@{ text = "Long single-method programs"; correct = $false },
            [ordered]@{ text = "Skipping telemetry"; correct = $false },
            [ordered]@{ text = "Hardcoding all values without review"; correct = $false }
          )
        }
      )
    }
  }
}

foreach ($level in $ftc.levels) {
  foreach ($module in $level.modules) {
    $fileName = $moduleFileMap[$module.id]
    if (-not $fileName) {
      throw "No file mapping found for module $($module.id)"
    }

    $moduleDoc = [ordered]@{
      id = ($fileName -replace "\.json$", "")
      title = $module.title
      path = "ftc-java"
      level = $level.id
      module = $module.id
      order = $module.order
      description = $module.description
      lessons = @()
    }

    foreach ($lessonMeta in $module.lessons) {
      $moduleDoc.lessons += (New-FtcLessonBody -lessonMeta $lessonMeta -moduleTitle $module.title -levelId $level.id)
    }

    $filePath = Join-Path $moduleDir $fileName
    $moduleDoc | ConvertTo-Json -Depth 100 | Set-Content -Path $filePath -Encoding UTF8
  }
}

$projectDir = Join-Path $root "content/projects"
if (-not (Test-Path $projectDir)) {
  New-Item -ItemType Directory -Path $projectDir | Out-Null
}

$levelProjects = @(
  [ordered]@{
    id = "ftc-java-level-1-java-cli-challenge"
    title = "FTC Java Level 1 Java CLI Challenge"
    description = "Build a multi-command Java console utility that simulates robot status and mission commands."
    path = "ftc-java"
    level = "level-1"
    difficulty = "beginner"
    duration = "1 week"
    learningObjectives = @(
      "Write and run Java console programs",
      "Use variables, control flow, and methods together",
      "Design clear command-driven interactions",
      "Validate user input and outputs"
    )
  },
  [ordered]@{
    id = "ftc-java-level-2-software-architecture-challenge"
    title = "FTC Java Level 2 Software Architecture Challenge"
    description = "Create a class-based robot simulator that models subsystems, states, and command routing."
    path = "ftc-java"
    level = "level-2"
    difficulty = "intermediate"
    duration = "1-2 weeks"
    learningObjectives = @(
      "Model robot subsystems with OOP",
      "Use collections and enums for program state",
      "Handle failures with exceptions and fallbacks",
      "Organize maintainable Java code"
    )
  },
  [ordered]@{
    id = "ftc-java-level-3-sdk-integration-challenge"
    title = "FTC Java Level 3 SDK Integration Challenge"
    description = "Deliver a tested FTC SDK mini-package with hardware init, telemetry checks, and repeatable deployment workflow."
    path = "ftc-java"
    level = "level-3"
    difficulty = "intermediate"
    duration = "1-2 weeks"
    learningObjectives = @(
      "Build and run FTC OpModes reliably",
      "Map and validate hardware devices",
      "Use telemetry for debugging",
      "Follow repeatable team dev workflow"
    )
  },
  [ordered]@{
    id = "ftc-java-level-4-competition-package-capstone"
    title = "FTC Java Level 4 Competition Package Capstone"
    description = "Produce a match-ready package with teleop and autonomous programs plus tuning notes and reliability evidence."
    path = "ftc-java"
    level = "level-4"
    difficulty = "advanced"
    duration = "2-3 weeks"
    learningObjectives = @(
      "Implement production-style teleop architecture",
      "Design robust autonomous routines",
      "Track reliability metrics across repeated runs",
      "Document engineering decisions for team handoff"
    )
  }
)

foreach ($proj in $levelProjects) {
  $projectDoc = [ordered]@{
    id = $proj.id
    title = $proj.title
    description = $proj.description
    path = $proj.path
    level = $proj.level
    difficulty = $proj.difficulty
    duration = $proj.duration
    learningObjectives = $proj.learningObjectives
    phases = @(
      [ordered]@{
        id = "phase-1"
        title = "Planning and Design"
        duration = "2-3 days"
        tasks = @(
          [ordered]@{ id = "task-1-1"; title = "Define requirements"; deliverable = "Requirements checklist and success metrics" },
          [ordered]@{ id = "task-1-2"; title = "Design approach"; deliverable = "Architecture sketch and component plan" }
        )
      },
      [ordered]@{
        id = "phase-2"
        title = "Implementation"
        duration = "3-5 days"
        tasks = @(
          [ordered]@{ id = "task-2-1"; title = "Build core functionality"; deliverable = "Working first version" },
          [ordered]@{ id = "task-2-2"; title = "Add validation and safeguards"; deliverable = "Reliable behavior across test cases" }
        )
      },
      [ordered]@{
        id = "phase-3"
        title = "Testing and Optimization"
        duration = "2-3 days"
        tasks = @(
          [ordered]@{ id = "task-3-1"; title = "Run repeated tests"; deliverable = "Test log with pass/fail outcomes" },
          [ordered]@{ id = "task-3-2"; title = "Tune for consistency"; deliverable = "Improved reliability and performance" }
        )
      },
      [ordered]@{
        id = "phase-4"
        title = "Documentation and Demo"
        duration = "1-2 days"
        tasks = @(
          [ordered]@{ id = "task-4-1"; title = "Document implementation"; deliverable = "Concise technical notes and usage guide" },
          [ordered]@{ id = "task-4-2"; title = "Present and reflect"; deliverable = "Demo plus reflection on next improvements" }
        )
      }
    )
    successCriteria = @(
      [ordered]@{ criterion = "Functional Completion"; description = "Project runs as designed for its level" },
      [ordered]@{ criterion = "Code Quality"; description = "Readable, organized, and maintainable implementation" },
      [ordered]@{ criterion = "Reliability"; description = "Consistent results across repeated tests" },
      [ordered]@{ criterion = "Communication"; description = "Clear documentation and demonstration" }
    )
  }

  $filePath = Join-Path $projectDir ("{0}.json" -f $proj.id)
  $projectDoc | ConvertTo-Json -Depth 100 | Set-Content -Path $filePath -Encoding UTF8
}

# Validation
$toCheck = @(
  $dataPath,
  (Get-ChildItem (Join-Path $root "content/paths/05-ftc-java/modules") -Filter "*.json" | Select-Object -ExpandProperty FullName),
  (Get-ChildItem (Join-Path $root "content/projects") -Filter "ftc-java-level-*.json" | Select-Object -ExpandProperty FullName)
)

$invalid = @()
foreach ($f in $toCheck) {
  try {
    Get-Content $f -Raw | ConvertFrom-Json | Out-Null
  } catch {
    $invalid += $f
  }
}

Write-Output "Updated FTC plan and files."
Write-Output "Modules updated: $((Get-ChildItem (Join-Path $root 'content/paths/05-ftc-java/modules') -Filter '*.json').Count)"
Write-Output "Level projects written: $((Get-ChildItem (Join-Path $root 'content/projects') -Filter 'ftc-java-level-*.json').Count)"
if ($invalid.Count -eq 0) {
  Write-Output "Validation: all JSON valid"
} else {
  Write-Output "Validation failed for:"
  $invalid | ForEach-Object { Write-Output " - $_" }
}
