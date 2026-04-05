param(
  [Parameter(Mandatory=$true)]
  [string]$RepoRoot
)

$ErrorActionPreference = 'Stop'
$RepoRoot = (Resolve-Path $RepoRoot).Path
Push-Location $RepoRoot
try {
  Write-Host 'Running typecheck...' -ForegroundColor Cyan
  pnpm typecheck

  Write-Host ''
  Write-Host 'Running Step 4 core tests...' -ForegroundColor Cyan
  pnpm exec tsx --test tests/unit/ruleEngineCore.test.ts

  Write-Host ''
  Write-Host 'Printing Step 4 evaluation outputs...' -ForegroundColor Cyan
  pnpm exec tsx scripts/rules/print-step4-evaluations.ts
}
finally {
  Pop-Location
}
