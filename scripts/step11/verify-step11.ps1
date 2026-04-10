[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$required = @(
    "src\features\onboarding\FirstRunExperience.tsx",
    "src\app\api\onboarding\status\route.ts",
    "src\app\api\onboarding\load-example\route.ts",
    "src\app\api\health\release-readiness\route.ts",
    "src\lib\services\onboarding\firstRun.ts",
    "src\lib\services\release\readiness.ts",
    "db\fixtures\fleets\onboardingFleet.ts",
    "scripts\db\seed-onboarding.ts",
    "scripts\step11\route-smoke.ps1",
    "scripts\step11\release-readiness.ps1",
    "vitest.config.ts"
)

$missing = New-Object System.Collections.Generic.List[string]
foreach ($relative in $required) {
    if (-not (Test-Path -LiteralPath (Join-Path $repoRoot $relative))) {
        $missing.Add($relative) | Out-Null
    }
}
if ($missing.Count -gt 0) { throw ("Missing Step 11 files: " + ($missing -join ", ")) }

Write-Host "Step 11 required artifacts and scripts are present." -ForegroundColor Green
