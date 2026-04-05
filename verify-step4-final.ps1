$RepoRoot = 'C:\Users\emb95\Documents\veradminpropfirm\scaffold'

$ExpectedFiles = @(
    'src\lib\domain\rules\types.ts',
    'src\lib\domain\rules\engine.ts',
    'src\lib\domain\rules\index.ts',
    'src\lib\services\accountEvaluationService.ts',
    'tests\fixtures\ruleEngineScenarioFixtures.ts',
    'tests\unit\ruleEngineCore.test.ts',
    'scripts\rules\print-step4-evaluations.ts',
    'step4_test_scenario_guidance.md',
    'step4_evaluation_pipeline_outputs.md',
    'handoff_step4_to_step5.md'
)

Write-Host ''
Write-Host '=== STEP 4 FINAL VERIFICATION ===' -ForegroundColor Cyan
Write-Host ''

$missing = @()
$empty = @()

foreach ($relativePath in $ExpectedFiles) {
    $fullPath = Join-Path $RepoRoot $relativePath

    if (-not (Test-Path $fullPath)) {
        $missing += $relativePath
        Write-Host "[MISSING] $relativePath" -ForegroundColor Red
        continue
    }

    $file = Get-Item $fullPath
    if ($file.Length -le 0) {
        $empty += $relativePath
        Write-Host "[EMPTY] $relativePath" -ForegroundColor Red
        continue
    }

    $lineCount = (Get-Content $fullPath).Count
    Write-Host "[OK] $relativePath ($($file.Length) bytes, $lineCount lines)" -ForegroundColor Green
}

Write-Host ''
Write-Host '=== FUNCTIONAL CHECKS ===' -ForegroundColor Cyan
Write-Host ''

Push-Location $RepoRoot
try {
    pnpm typecheck
    if ($LASTEXITCODE -ne 0) { throw 'typecheck failed' }

    pnpm exec tsx tests/unit/ruleEngineCore.test.ts
    if ($LASTEXITCODE -ne 0) { throw 'ruleEngineCore test failed' }

    pnpm exec tsx scripts/rules/print-step4-evaluations.ts
    if ($LASTEXITCODE -ne 0) { throw 'print-step4-evaluations failed' }

    Write-Host ''
    if ($missing.Count -eq 0 -and $empty.Count -eq 0) {
        Write-Host 'Step 4 is present and functionally verified.' -ForegroundColor Green
    } else {
        Write-Host 'Functional checks passed, but one or more files are missing or empty.' -ForegroundColor Yellow
    }
}
catch {
    Write-Host ''
    Write-Host "Functional verification failed: $_" -ForegroundColor Red
}
finally {
    Pop-Location
}