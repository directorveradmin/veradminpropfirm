param(
    [string]$RepoRoot = (Get-Location).Path,
    [switch]$SkipDesktopBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
    param([string]$Path, [string]$Content)

    $parent = Split-Path -Parent $Path
    if ($parent -and -not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Invoke-PnpmLogged {
    param(
        [string]$RepoRootPath,
        [string]$Command,
        [string]$LogPath,
        [switch]$AllowFailure
    )

    $captured = New-Object System.Collections.Generic.List[string]
    $exitCode = -1

    Push-Location $RepoRootPath
    try {
        try {
            & pnpm $Command 2>&1 | ForEach-Object {
                $line = [string]$_
                $captured.Add($line)
                Write-Host $line
            }
            $exitCode = $LASTEXITCODE
        }
        catch {
            $captured.Add($_.Exception.ToString())
            Write-Host $_.Exception.ToString() -ForegroundColor Red
            $exitCode = 999
        }
    }
    finally {
        Pop-Location
    }

    Write-Utf8NoBom -Path $LogPath -Content ((@($captured) -join [Environment]::NewLine) + [Environment]::NewLine)

    if (-not $AllowFailure -and $exitCode -ne 0) {
        throw "pnpm $Command failed. See $LogPath"
    }

    return [pscustomobject]@{
        Command   = $Command
        ExitCode  = $exitCode
        Succeeded = ($exitCode -eq 0)
        LogPath   = $LogPath
    }
}

function Get-RepoText {
    param([string]$RelativePath)

    $full = Join-Path $RepoRoot $RelativePath
    if (-not (Test-Path -LiteralPath $full)) {
        return $null
    }

    return [System.IO.File]::ReadAllText($full)
}

$RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot)
$artifactsRoot = Join-Path $RepoRoot "artifacts\step13"
New-Item -ItemType Directory -Path $artifactsRoot -Force | Out-Null

$packageJsonPath = Join-Path $RepoRoot "package.json"
$tauriConfPath = Join-Path $RepoRoot "src-tauri\tauri.conf.json"

if (-not (Test-Path -LiteralPath $packageJsonPath)) {
    throw "package.json not found."
}

if (-not (Test-Path -LiteralPath $tauriConfPath)) {
    throw "src-tauri\tauri.conf.json not found."
}

$pkg = Get-Content -LiteralPath $packageJsonPath -Raw | ConvertFrom-Json
$tauri = Get-Content -LiteralPath $tauriConfPath -Raw | ConvertFrom-Json

$buildWeb = ""
$buildDesktop = ""
$frontendDist = ""
$beforeBuildCommand = ""

if ($pkg.scripts) {
    $buildWeb = [string]$pkg.scripts."build:web"
    $buildDesktop = [string]$pkg.scripts."build:desktop"
}

if ($tauri.build) {
    $frontendDist = [string]$tauri.build.frontendDist
    $beforeBuildCommand = [string]$tauri.build.beforeBuildCommand
}

$nextConfigTs = Test-Path -LiteralPath (Join-Path $RepoRoot "next.config.ts")
$nextConfigJs = Test-Path -LiteralPath (Join-Path $RepoRoot "next.config.js")
$nextConfigMjs = Test-Path -LiteralPath (Join-Path $RepoRoot "next.config.mjs")

$apiRouteFiles = @(
    Get-ChildItem -LiteralPath (Join-Path $RepoRoot "src\app\api") -Recurse -File -ErrorAction SilentlyContinue
)

$apiFetchMatches = @(
    Get-ChildItem -LiteralPath (Join-Path $RepoRoot "src") -Recurse -Include *.ts,*.tsx -File -ErrorAction SilentlyContinue |
    Select-String -Pattern '/api/' -SimpleMatch -ErrorAction SilentlyContinue
)

$buildWebResult = Invoke-PnpmLogged -RepoRootPath $RepoRoot -Command "build:web" -LogPath (Join-Path $artifactsRoot "build-web.log") -AllowFailure
$desktopResult = $null

if (-not $SkipDesktopBuild) {
    $desktopResult = Invoke-PnpmLogged -RepoRootPath $RepoRoot -Command "build:desktop" -LogPath (Join-Path $artifactsRoot "build-desktop.log") -AllowFailure
}

$frontendDistPath = if ([string]::IsNullOrWhiteSpace($frontendDist)) {
    $null
} else {
    [System.IO.Path]::GetFullPath((Join-Path (Join-Path $RepoRoot "src-tauri") $frontendDist))
}

$frontendDistExists = $false
if ($frontendDistPath) {
    $frontendDistExists = Test-Path -LiteralPath $frontendDistPath
}

$outPath = Join-Path $RepoRoot "out"
$dotNextPath = Join-Path $RepoRoot ".next"

$outExists = Test-Path -LiteralPath $outPath
$dotNextExists = Test-Path -LiteralPath $dotNextPath

$staticExportRisk = $false
if (
    $frontendDist -match '(^|[\\/])out$' -and
    @($apiRouteFiles).Count -gt 0 -and
    @($apiFetchMatches).Count -gt 0
) {
    $staticExportRisk = $true
}

$packagingMismatch = $false
if (
    $frontendDist -match '(^|[\\/])out$' -and
    $buildWeb -match '\bnext build\b' -and
    -not $outExists
) {
    $packagingMismatch = $true
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("Veradmin packaging readiness summary")
$lines.Add("Generated: $(Get-Date -Format o)")
$lines.Add("RepoRoot: $RepoRoot")
$lines.Add("")
$lines.Add("build:web = $buildWeb")
$lines.Add("build:desktop = $buildDesktop")
$lines.Add("tauri beforeBuildCommand = $beforeBuildCommand")
$lines.Add("tauri frontendDist = $frontendDist")
$lines.Add("resolved frontendDist path = $frontendDistPath")
$lines.Add("frontendDist exists after build:web = $frontendDistExists")
$lines.Add(".next exists after build:web = $dotNextExists")
$lines.Add("out exists after build:web = $outExists")
$lines.Add("next config present = " + ($nextConfigTs -or $nextConfigJs -or $nextConfigMjs))
$lines.Add("api route file count = " + @($apiRouteFiles).Count)
$lines.Add("'/api/' fetch match count = " + @($apiFetchMatches).Count)
$lines.Add("static export risk detected = $staticExportRisk")
$lines.Add("packaging mismatch detected = $packagingMismatch")
$lines.Add("build:web exit = $($buildWebResult.ExitCode)")
$lines.Add("build:web log = $($buildWebResult.LogPath)")
if ($desktopResult -ne $null) {
    $lines.Add("build:desktop exit = $($desktopResult.ExitCode)")
    $lines.Add("build:desktop log = $($desktopResult.LogPath)")
}
$lines.Add("")
$lines.Add("Recommended interpretation:")
if ($packagingMismatch) {
    $lines.Add("- Tauri expects a dist folder that build:web did not produce.")
}
if ($staticExportRisk) {
    $lines.Add("- The app still appears to depend on /api routes, so a blind static-export fix would be unsafe.")
}
if ($desktopResult -ne $null -and -not $desktopResult.Succeeded) {
    $lines.Add("- Desktop packaging is still not passing cleanly.")
}
if (-not $packagingMismatch -and -not $staticExportRisk -and ($desktopResult -eq $null -or $desktopResult.Succeeded)) {
    $lines.Add("- No immediate packaging-contract blocker was detected in this pass.")
}

$summaryPath = Join-Path $artifactsRoot "packaging-readiness-summary.txt"
Write-Utf8NoBom -Path $summaryPath -Content (($lines -join [Environment]::NewLine) + [Environment]::NewLine)

Write-Host ""
Write-Host "Wrote: $summaryPath" -ForegroundColor Cyan
Write-Host ""

foreach ($line in $lines) {
    Write-Host $line
}

if ($packagingMismatch -or $staticExportRisk -or ($desktopResult -ne $null -and -not $desktopResult.Succeeded)) {
    exit 2
}

exit 0