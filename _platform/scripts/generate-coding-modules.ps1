$ErrorActionPreference = "Stop"

$root = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { (Get-Location).Path }
$dataPath = Join-Path $root "data/paths.json"
$data = Get-Content $dataPath -Raw | ConvertFrom-Json

$moduleFileMap = @{
  "python-micropython|mod-1-1" = "getting-started-with-python.json"
  "python-micropython|mod-1-2" = "variables-and-types.json"
  "python-micropython|mod-1-3" = "basic-operations.json"
  "python-micropython|mod-2-1" = "conditionals.json"
  "python-micropython|mod-2-2" = "loops.json"
  "python-micropython|mod-3-1" = "functions.json"
  "python-micropython|mod-3-2" = "lists-and-collections.json"
  "python-micropython|mod-4-1" = "micropython-basics.json"
  "python-micropython|mod-4-2" = "motor-and-sensor-control.json"
  "ftc-java|mod-1-1" = "ftc-overview.json"
  "ftc-java|mod-1-2" = "ftc-blocks-introduction.json"
  "ftc-java|mod-2-1" = "java-fundamentals.json"
  "ftc-java|mod-2-2" = "object-oriented-programming.json"
  "ftc-java|mod-3-1" = "onbot-java.json"
  "ftc-java|mod-3-2" = "android-studio-development.json"
  "ftc-java|mod-4-1" = "teleop-programming.json"
  "ftc-java|mod-4-2" = "autonomous-programming.json"
}

function New-LessonContent {
  param(
    [string]$pathId,
    [string]$moduleTitle,
    [object]$lessonMeta
  )

  $isJava = $pathId -eq "ftc-java"

  $javaCode = @(
    "// $($lessonMeta.title)",
    "public class LessonSnippet {",
    "    public static void main(String[] args) {",
    "        int powerLevel = 75;",
    "        boolean isReady = true;",
    "        if (isReady) {",
    "            System.out.println(`"Robot power: `" + powerLevel + `"%`" );",
    "        }",
    "    }",
    "}"
  ) -join "`n"

  $pythonCode = @(
    "# $($lessonMeta.title)",
    "power_level = 75",
    "is_ready = True",
    "",
    "if is_ready:",
    "    print(f`"Robot power: {power_level}%`")"
  ) -join "`n"

  $code = if ($isJava) { $javaCode } else { $pythonCode }

  $type = $lessonMeta.type
  $duration = switch ($type) {
    "assessment" { 25 }
    "project" { 45 }
    default { 20 }
  }

  return [ordered]@{
    id = $lessonMeta.id
    title = $lessonMeta.title
    type = $type
    duration = $duration
    explain = [ordered]@{
      title = "Understanding $($lessonMeta.title)"
      content = "This lesson builds practical skill in $($lessonMeta.title) within the module '$moduleTitle'. Students connect the concept to robotics scenarios, practice with code, and verify understanding through quick checks."
      keyPoints = @(
        "Connect concept to real robot behavior",
        "Use readable, testable code patterns",
        "Check expected behavior with simple validation",
        "Prepare for the next lesson in the sequence"
      )
    }
    example = [ordered]@{
      title = "$($lessonMeta.title) Example"
      code = $code
      annotations = @(
        [ordered]@{ line = 2; note = "Initialize key control variables" },
        [ordered]@{ line = 4; note = "Apply logic to decide robot behavior" },
        [ordered]@{ line = 5; note = "Output state for debugging and verification" }
      )
      output = "Robot power: 75%"
    }
    exercise = [ordered]@{
      title = "Practice: $($lessonMeta.title)"
      instructions = "1. Recreate the example logic with your own variable names.`n2. Change one condition or value and predict output.`n3. Run the code and compare expected vs actual output.`n4. Add one improvement for readability."
      type = "code"
      initialCode = $code
      solution = $code
      validation = [ordered]@{
        type = "output_contains"
        contains = @("Robot power", "75")
      }
    }
    quiz = [ordered]@{
      questions = @(
        [ordered]@{
          id = "q1"
          question = "What is the main purpose of this lesson?"
          type = "multiple-choice"
          options = @(
            [ordered]@{ text = "Apply a programming concept in robot context"; correct = $true },
            [ordered]@{ text = "Memorize syntax only"; correct = $false },
            [ordered]@{ text = "Avoid testing code"; correct = $false },
            [ordered]@{ text = "Skip validation steps"; correct = $false }
          )
        },
        [ordered]@{
          id = "q2"
          question = "Which habit improves reliability in robot programs?"
          type = "multiple-choice"
          options = @(
            [ordered]@{ text = "Validate output after each change"; correct = $true },
            [ordered]@{ text = "Write everything in one long block"; correct = $false },
            [ordered]@{ text = "Remove debug output too early"; correct = $false },
            [ordered]@{ text = "Ignore edge cases"; correct = $false }
          )
        }
      )
    }
  }
}

$targets = $data | Where-Object { $_.id -in @("python-micropython", "ftc-java") }
$written = @()
$skipped = @()

foreach ($path in $targets) {
  $pathFolder = ('{0:d2}-{1}' -f [int]$path.number, $path.id)
  $moduleDir = Join-Path $root ("content/paths/{0}/modules" -f $pathFolder)

  if (-not (Test-Path $moduleDir)) {
    New-Item -ItemType Directory -Path $moduleDir | Out-Null
  }

  foreach ($level in $path.levels) {
    foreach ($module in $level.modules) {
      $mapKey = "{0}|{1}" -f $path.id, $module.id
      $fileName = $moduleFileMap[$mapKey]
      if (-not $fileName) {
        $fileName = (($module.title.ToLower() -replace "[^a-z0-9]+", "-").Trim("-") + ".json")
      }

      $filePath = Join-Path $moduleDir $fileName

      if ($path.id -eq "python-micropython" -and $module.id -eq "mod-1-2" -and (Test-Path $filePath)) {
        $skipped += $filePath
        continue
      }

      $moduleDoc = [ordered]@{
        id = ($fileName -replace "\.json$", "")
        title = $module.title
        path = $path.id
        level = $level.id
        module = $module.id
        order = $module.order
        lessons = @()
      }

      foreach ($lessonMeta in $module.lessons) {
        $moduleDoc.lessons += (New-LessonContent -pathId $path.id -moduleTitle $module.title -lessonMeta $lessonMeta)
      }

      $moduleDoc | ConvertTo-Json -Depth 100 | Set-Content -Path $filePath -Encoding UTF8
      $written += $filePath
    }
  }
}

Write-Output "Written files: $($written.Count)"
$written | ForEach-Object { Write-Output " - $_" }
Write-Output "Skipped files: $($skipped.Count)"
$skipped | ForEach-Object { Write-Output " - $_" }
