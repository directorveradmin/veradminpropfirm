param(
  [string]$RepoRoot = (Get-Location).Path,
  [string]$BaseUrl = "http://localhost:3000",
  [switch]$TryHttp
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
    throw "Missing required file: $RelativePath"
  }
  Write-Host "[ok] $RelativePath" -ForegroundColor Green
}

$required = @(
  "data\workspace.json",
  "src\lib\server\workspaceStore.ts",
  "src\lib\server\workspaceSimulation.ts",
  "src\lib\server\reportsFromWorkspace.ts",
  "src\app\api\workspace\route.ts",
  "src\app\api\accounts\[id]\route.ts",
  "src\app\api\payouts\[id]\route.ts",
  "src\app\api\reports\summary\route.ts",
  "src\app\api\simulation\sequence\route.ts",
  "src\features\accounts\AccountDetailScreen.tsx",
  "src\features\payouts\PayoutsScreen.tsx",
  "docs\67-simulation-reports-actions-wired.md"
)

Write-Host "Verifying next-phase upgrade under: $RepoRoot" -ForegroundColor Cyan
foreach ($item in $required) {
  Assert-Exists $item
}

Push-Location $RepoRoot
try {
  Write-Host "Running pnpm typecheck..." -ForegroundColor Cyan
  pnpm typecheck
  if ($LASTEXITCODE -ne 0) { throw "pnpm typecheck failed." }

  Write-Host "Running pnpm test..." -ForegroundColor Cyan
  pnpm test
  if ($LASTEXITCODE -ne 0) { throw "pnpm test failed." }
}
finally {
  Pop-Location
}

if ($TryHttp) {
  $routes = @("/", "/accounts", "/accounts/A1", "/payouts", "/reports", "/simulation?accountId=A1&action=standard_loss")
  foreach ($route in $routes) {
    try {
      $response = Invoke-WebRequest -Uri ($BaseUrl.TrimEnd("/") + $route) -UseBasicParsing -Method GET -TimeoutSec 10
      Write-Host "[http $($response.StatusCode)] $route" -ForegroundColor Green
    } catch {
      Write-Host "[http fail] $route :: $($_.Exception.Message)" -ForegroundColor Yellow
    }
  }
}

Write-Host ""
Write-Host "Next-phase upgrade verification completed successfully." -ForegroundColor Green