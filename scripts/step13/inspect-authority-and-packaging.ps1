param(
    [string]$RepoRoot = (Get-Location).Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
    param(
        [string]$Path,
        [string]$Content
    )

    $parent = Split-Path -Parent $Path
    if ($parent -and -not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Read-RepoText {
    param([string]$RelativePath)

    $full = Join-Path $RepoRoot $RelativePath
    if (-not (Test-Path -LiteralPath $full)) {
        return $null
    }

    return [System.IO.File]::ReadAllText($full)
}

function Get-Imports {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return @()
    }

    return @(
        [regex]::Matches($Text, 'from\s+["'']([^"'']+)["'']') |
        ForEach-Object { $_.Groups[1].Value } |
        Select-Object -Unique
    )
}

function Test-AnyPattern {
    param(
        [string]$Text,
        [string[]]$Patterns
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return $false
    }

    foreach ($pattern in $Patterns) {
        if ($Text -match $pattern) {
            return $true
        }
    }

    return $false
}

$RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot)
$artifactPath = Join-Path $RepoRoot "artifacts\step13\authority-packaging-audit.txt"

$reportFiles = @(
    "src\app\api\reports\summary\route.ts",
    "src\lib\server\reportsFromWorkspace.ts",
    "src\lib\server\step12\reportingIntegration.ts",
    "src\lib\services\reporting\index.ts",
    "src\features\reports\ReportsScreen.tsx"
)

$simulationFiles = @(
    "src\app\api\simulation\sequence\route.ts",
    "src\lib\server\workspaceSimulation.ts",
    "src\lib\server\step12\simulationIntegration.ts",
    "src\lib\services\simulation\index.ts",
    "src\features\simulation\SequenceSimulationWorkbench.tsx"
)

$surfaceFiles = @(
    "src\app\journal\page.tsx",
    "src\app\alerts\page.tsx",
    "src\app\payouts\page.tsx",
    "src\app\calendar\page.tsx",
    "src\app\(shell)\settings\page.tsx",
    "src\app\(shell)\backups\page.tsx",
    "src\app\(shell)\reports\page.tsx",
    "src\app\(shell)\simulation\page.tsx"
)

$placeholderPatterns = @(
    "PlaceholderSurface",
    "placeholder",
    "coming soon",
    "incomplete",
    "sample",
    "demo",
    "seeded",
    "workspace\.json",
    "local json",
    "local-first",
    "TODO"
)

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("Veradmin authority + packaging audit")
$lines.Add("Generated: $(Get-Date -Format o)")
$lines.Add("RepoRoot: $RepoRoot")
$lines.Add("")

$lines.Add("=== REPORTS AUTHORITY ===")
foreach ($file in $reportFiles) {
    $text = Read-RepoText $file
    $exists = $null -ne $text
    $imports = if ($exists) { Get-Imports $text } else { @() }
    $workspaceSignals = if ($exists) {
        @(
            "reportsFromWorkspace",
            "workspace",
            "getWorkspaceData",
            "reportingIntegration"
        ) | Where-Object { $text -match [regex]::Escape($_) }
    } else {
        @()
    }

    $lines.Add("$file")
    $lines.Add("  exists: $exists")
    if (@($imports).Count -gt 0) {
        $lines.Add("  imports: " + ($imports -join ", "))
    }
    if (@($workspaceSignals).Count -gt 0) {
        $lines.Add("  grounding signals: " + ($workspaceSignals -join ", "))
    }
}

$lines.Add("")
$lines.Add("=== SIMULATION AUTHORITY ===")
foreach ($file in $simulationFiles) {
    $text = Read-RepoText $file
    $exists = $null -ne $text
    $imports = if ($exists) { Get-Imports $text } else { @() }
    $authoritySignals = if ($exists) {
        @(
            "workspaceSimulation",
            "simulationIntegration",
            "deterministic",
            "sequence",
            "accountId",
            "standard_loss",
            "standard_win"
        ) | Where-Object { $text -match [regex]::Escape($_) }
    } else {
        @()
    }

    $lines.Add("$file")
    $lines.Add("  exists: $exists")
    if (@($imports).Count -gt 0) {
        $lines.Add("  imports: " + ($imports -join ", "))
    }
    if (@($authoritySignals).Count -gt 0) {
        $lines.Add("  authority signals: " + ($authoritySignals -join ", "))
    }
}

$lines.Add("")
$lines.Add("=== SURFACE HONESTY CUES ===")
foreach ($file in $surfaceFiles) {
    $text = Read-RepoText $file
    $exists = $null -ne $text
    $hasPlaceholderCue = if ($exists) { Test-AnyPattern -Text $text -Patterns $placeholderPatterns } else { $false }

    $matched = @()
    if ($exists) {
        foreach ($pattern in $placeholderPatterns) {
            if ($text -match $pattern) {
                $matched += $pattern
            }
        }
    }

    $lines.Add("$file")
    $lines.Add("  exists: $exists")
    $lines.Add("  honesty/placeholder cues: $hasPlaceholderCue")
    if (@($matched).Count -gt 0) {
        $lines.Add("  matched: " + (($matched | Select-Object -Unique) -join ", "))
    }
}

$lines.Add("")
$lines.Add("=== PACKAGING CONTRACT ===")
$packageJsonText = Read-RepoText "package.json"
$tauriJsonText = Read-RepoText "src-tauri\tauri.conf.json"

$buildWeb = ""
$buildDesktop = ""
$frontendDist = ""
$beforeBuildCommand = ""
$packagingMismatch = $false

if ($packageJsonText) {
    $pkg = $packageJsonText | ConvertFrom-Json
    if ($pkg.scripts) {
        $buildWeb = [string]$pkg.scripts."build:web"
        $buildDesktop = [string]$pkg.scripts."build:desktop"
    }
}

if ($tauriJsonText) {
    $tauri = $tauriJsonText | ConvertFrom-Json

    if ($tauri.build) {
        if ($tauri.build.frontendDist) {
            $frontendDist = [string]$tauri.build.frontendDist
        }
        if ($tauri.build.beforeBuildCommand) {
            $beforeBuildCommand = [string]$tauri.build.beforeBuildCommand
        }
    }
}

if (
    $frontendDist -match '(^|[\\/])out$' -and
    $buildWeb -match '\bnext build\b' -and
    $buildWeb -notmatch 'next export|output:\s*["'']export["'']'
) {
    $packagingMismatch = $true
}

$lines.Add("package.json exists: " + [bool]$packageJsonText)
$lines.Add("src-tauri\\tauri.conf.json exists: " + [bool]$tauriJsonText)
$lines.Add("build:web = $buildWeb")
$lines.Add("build:desktop = $buildDesktop")
$lines.Add("tauri frontendDist = $frontendDist")
$lines.Add("tauri beforeBuildCommand = $beforeBuildCommand")
$lines.Add("packaging mismatch detected = $packagingMismatch")

$lines.Add("")
$lines.Add("=== HIGH-LEVEL READOUT ===")

$reportText = ($reportFiles | ForEach-Object { Read-RepoText $_ }) -join "`n"
$simulationText = ($simulationFiles | ForEach-Object { Read-RepoText $_ }) -join "`n"

$reportsLookWorkspaceGrounded = Test-AnyPattern -Text $reportText -Patterns @("reportsFromWorkspace","getWorkspaceData","workspace")
$simulationLooksDeterministic = Test-AnyPattern -Text $simulationText -Patterns @("workspaceSimulation","simulationIntegration","standard_loss","standard_win","sequence")

$surfaceCueCount = 0
foreach ($file in $surfaceFiles) {
    $text = Read-RepoText $file
    if ($null -ne $text -and (Test-AnyPattern -Text $text -Patterns $placeholderPatterns)) {
        $surfaceCueCount++
    }
}

$lines.Add("reports appear workspace-grounded: $reportsLookWorkspaceGrounded")
$lines.Add("simulation appears wired through a named local adapter: $simulationLooksDeterministic")
$lines.Add("surface files with honesty/placeholder cues: $surfaceCueCount")
$lines.Add("packaging mismatch detected: $packagingMismatch")

Write-Utf8NoBom -Path $artifactPath -Content (($lines -join [Environment]::NewLine) + [Environment]::NewLine)

Write-Host ""
Write-Host "Wrote: $artifactPath" -ForegroundColor Cyan
Write-Host ""

foreach ($line in $lines) {
    Write-Host $line
}

if ($packagingMismatch) {
    exit 2
}

exit 0