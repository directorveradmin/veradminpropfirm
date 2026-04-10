[CmdletBinding()]
param([string]$BaseUrl = "http://localhost:3000", [switch]$SkipRouteSmoke)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Push-Location $repoRoot
try {
    & pnpm typecheck
    & pnpm test
    if (-not $SkipRouteSmoke) {
        & powershell -ExecutionPolicy Bypass -File .\scripts\step11\route-smoke.ps1 -BaseUrl $BaseUrl
    }
} finally {
    Pop-Location
}
Write-Host "Step 11 closeout checks completed." -ForegroundColor Green
