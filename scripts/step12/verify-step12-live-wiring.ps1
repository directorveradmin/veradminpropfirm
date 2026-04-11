param(
  [string]$RepoRoot = (Get-Location).Path
)

$ErrorActionPreference = "Stop"

function Join-RepoPath {
  param([string]$RelativePath)
  return [System.IO.Path]::Combine($RepoRoot, $RelativePath)
}

function Assert-Exists {
  param([string]$RelativePath)
  $path = Join-RepoPath $RelativePath
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing required path: $RelativePath"
  }
  Write-Host "[ok] $RelativePath" -ForegroundColor Green
}

$required = @(
  "src/lib/services/reporting/builders.ts",
  "src/lib/services/simulation/builders.ts",
  "src/lib/server/step12/reportingIntegration.ts",
  "src/lib/server/step12/simulationIntegration.ts",
  "src/app/api/reports/summary/route.ts",
  "src/app/api/simulation/sequence/route.ts",
  "src/features/reports/ReportsScreen.tsx",
  "src/features/simulation/SequenceSimulationWorkbench.tsx",
  "tests/unit/reporting/reporting.spec.ts",
  "tests/unit/simulation/simulationWorkbench.spec.ts",
  "docs/62-step12-live-data-and-engine-wiring.md",
  "vitest.config.ts"
)

Write-Host "Verifying Step 12 live-data wiring under: $RepoRoot" -ForegroundColor Cyan
foreach ($entry in $required) {
  Assert-Exists $entry
}

Push-Location $RepoRoot
try {
  Write-Host "Running pnpm typecheck..." -ForegroundColor Cyan
  pnpm typecheck
  if ($LASTEXITCODE -ne 0) {
    throw "pnpm typecheck failed."
  }

  Write-Host "Running pnpm test..." -ForegroundColor Cyan
  pnpm test
  if ($LASTEXITCODE -ne 0) {
    throw "pnpm test failed."
  }
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "Step 12 live-data wiring verification completed successfully." -ForegroundColor Green