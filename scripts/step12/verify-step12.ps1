param(
  [string]$RepoRoot = (Get-Location).Path,
  [switch]$SkipTypecheck,
  [switch]$SkipTests
)

$ErrorActionPreference = 'Stop'

function Join-RepoPath {
  param([string]$RelativePath)
  return [System.IO.Path]::Combine($RepoRoot, $RelativePath)
}

function Assert-PathExists {
  param([string]$RelativePath)
  $target = Join-RepoPath $RelativePath
  if (-not (Test-Path -LiteralPath $target)) {
    throw "Missing required Step 12 path: $RelativePath"
  }
  Write-Host "[ok] $RelativePath" -ForegroundColor Green
}

$required = @(
  "docs/57-step12-reporting-surfaces-and-review-export-blueprint.md",
  "docs/58-step12-simulation-depth-and-what-if-flow-blueprint.md",
  "docs/59-step12-post-v1-expansion-discipline-and-ai-guardrails.md",
  "docs/60-step12-veradmin-complete-roadmap-state.md",
  "docs/handoff_step12_complete.md",
  "src/lib/view-models/reports.ts",
  "src/lib/view-models/simulationWorkbench.ts",
  "src/lib/services/reporting/index.ts",
  "src/lib/services/simulation/index.ts",
  "src/features/reports/ReportsScreen.tsx",
  "src/features/simulation/SequenceSimulationWorkbench.tsx",
  "src/app/(shell)/reports/page.tsx",
  "src/app/api/reports/summary/route.ts",
  "src/app/api/simulation/sequence/route.ts"
)

Write-Host "Verifying Step 12 scaffold under: $RepoRoot" -ForegroundColor Cyan
foreach ($path in $required) {
  Assert-PathExists $path
}

Push-Location $RepoRoot
try {
  if (-not $SkipTypecheck) {
    $pkg = Join-RepoPath "package.json"
    if (Test-Path -LiteralPath $pkg) {
      Write-Host "Running pnpm typecheck..." -ForegroundColor Cyan
      & pnpm typecheck
      if ($LASTEXITCODE -ne 0) { throw "pnpm typecheck failed." }
    }
  }

  if (-not $SkipTests) {
    $testsPath = Join-RepoPath "tests"
    if (Test-Path -LiteralPath $testsPath) {
      Write-Host "Running pnpm test..." -ForegroundColor Cyan
      & pnpm test
      if ($LASTEXITCODE -ne 0) { throw "pnpm test failed." }
    }
  }
}
finally {
  Pop-Location
}

Write-Host "Step 12 verification completed successfully." -ForegroundColor Green