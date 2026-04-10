param(
    [string]$RepoRoot = (Resolve-Path ".").Path
)

$ErrorActionPreference = "Stop"

function Check([string]$Path) {
    if (Test-Path -LiteralPath $Path) {
        Write-Host "[verify-step10] OK  $Path"
    } else {
        Write-Host "[verify-step10] MISSING  $Path"
    }
}

Set-Location $RepoRoot

Check "src\app\(shell)\settings\page.tsx"
Check "src\app\(shell)\backups\page.tsx"
Check "src\features\settings\SettingsScreen.tsx"
Check "src\features\backups\BackupRestoreExportScreen.tsx"
Check "src\lib\view-models\settings.ts"
Check "src\lib\view-models\backupCenter.ts"
Check "docs\step10_settings_screen_blueprint.md"
Check "docs\step10_backup_restore_export_blueprint.md"
Check "docs\step10_continuity_safety_flows.md"
Check "docs\step10_recovery_guidance.md"
Check "docs\handoff_step10_to_step11.md"
Check "src\app\layout.tsx"

$layoutPath = "src\app\layout.tsx"
if (Test-Path -LiteralPath $layoutPath) {
    $layout = Get-Content -LiteralPath $layoutPath -Raw
    if ($layout -match "/settings") {
        Write-Host "[verify-step10] layout contains /settings"
    } else {
        Write-Host "[verify-step10] layout does NOT contain /settings"
    }

    if ($layout -match "/backups") {
        Write-Host "[verify-step10] layout contains /backups"
    } else {
        Write-Host "[verify-step10] layout does NOT contain /backups"
    }
}