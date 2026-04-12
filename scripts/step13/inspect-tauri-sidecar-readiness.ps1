param(
    [string]$RepoRoot = (Get-Location).Path
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

function Read-Text {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    return [System.IO.File]::ReadAllText($Path)
}

$RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot)
$artifact = Join-Path $RepoRoot "artifacts\step13\tauri-sidecar-readiness.txt"

$packageJsonPath = Join-Path $RepoRoot "package.json"
$tauriConfPath = Join-Path $RepoRoot "src-tauri\tauri.conf.json"
$cargoPath = Join-Path $RepoRoot "src-tauri\Cargo.toml"
$libRsPath = Join-Path $RepoRoot "src-tauri\src\lib.rs"
$mainRsPath = Join-Path $RepoRoot "src-tauri\src\main.rs"
$capDir = Join-Path $RepoRoot "src-tauri\capabilities"

$pkgText = Read-Text $packageJsonPath
$tauriText = Read-Text $tauriConfPath
$cargoText = Read-Text $cargoPath
$libText = Read-Text $libRsPath
$mainText = Read-Text $mainRsPath

$pkg = $null
$tauri = $null

if ($pkgText) { $pkg = $pkgText | ConvertFrom-Json }
if ($tauriText) { $tauri = $tauriText | ConvertFrom-Json }

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("Veradmin Tauri sidecar readiness")
$lines.Add("Generated: $(Get-Date -Format o)")
$lines.Add("RepoRoot: $RepoRoot")
$lines.Add("")

$lines.Add("=== PACKAGE.JSON ===")
$lines.Add("package.json exists: " + [bool]$pkgText)
if ($pkg -and $pkg.scripts) {
    $lines.Add("build:web = " + [string]$pkg.scripts."build:web")
    $lines.Add("build:desktop = " + [string]$pkg.scripts."build:desktop")
    $lines.Add("start:web:standalone = " + [string]$pkg.scripts."start:web:standalone")
}
$pkgHasShellJs = $pkgText -match '@tauri-apps/plugin-shell'
$lines.Add("@tauri-apps/plugin-shell present in package.json text: $pkgHasShellJs")

$lines.Add("")
$lines.Add("=== TAURI CONF ===")
$lines.Add("src-tauri\\tauri.conf.json exists: " + [bool]$tauriText)

$frontendDist = ""
$beforeBuildCommand = ""
$devUrl = ""
$externalBin = @()
$resources = @()
$windowUrls = @()

if ($tauri) {
    if ($tauri.build) {
        $frontendDist = [string]$tauri.build.frontendDist
        $beforeBuildCommand = [string]$tauri.build.beforeBuildCommand
        $devUrl = [string]$tauri.build.devUrl
    }

    if ($tauri.bundle) {
        if ($tauri.bundle.externalBin) { $externalBin = @($tauri.bundle.externalBin) }
        if ($tauri.bundle.resources) { $resources = @($tauri.bundle.resources) }
    }

    if ($tauri.app -and $tauri.app.windows) {
        foreach ($w in @($tauri.app.windows)) {
            if ($w.url) { $windowUrls += [string]$w.url }
        }
    }
}

$lines.Add("frontendDist = $frontendDist")
$lines.Add("beforeBuildCommand = $beforeBuildCommand")
$lines.Add("devUrl = $devUrl")
$lines.Add("window urls = " + ((@($windowUrls) | ForEach-Object { $_ }) -join ", "))
$lines.Add("externalBin count = " + @($externalBin).Count)
foreach ($item in @($externalBin)) {
    $lines.Add("  externalBin: $item")
}
$lines.Add("resources count = " + @($resources).Count)
foreach ($item in @($resources)) {
    $lines.Add("  resource: $item")
}

$lines.Add("")
$lines.Add("=== RUST SIDE ===")
$lines.Add("Cargo.toml exists: " + [bool]$cargoText)
$lines.Add("lib.rs exists: " + [bool]$libText)
$lines.Add("main.rs exists: " + [bool]$mainText)

$hasShellCrate = $cargoText -match 'tauri-plugin-shell'
$hasShellInitLib = $libText -match 'tauri_plugin_shell::init'
$hasShellInitMain = $mainText -match 'tauri_plugin_shell::init'

$lines.Add("tauri-plugin-shell present in Cargo.toml: $hasShellCrate")
$lines.Add("shell plugin initialized in lib.rs: $hasShellInitLib")
$lines.Add("shell plugin initialized in main.rs: $hasShellInitMain")

$lines.Add("")
$lines.Add("=== CAPABILITIES ===")
$capFiles = @()
if (Test-Path -LiteralPath $capDir) {
    $capFiles = @(Get-ChildItem -LiteralPath $capDir -Recurse -File -ErrorAction SilentlyContinue)
}
$lines.Add("capabilities dir exists: " + [bool](Test-Path -LiteralPath $capDir))
$lines.Add("capability file count = " + @($capFiles).Count)

$foundShellPermission = $false
foreach ($file in @($capFiles)) {
    $text = Read-Text $file.FullName
    $relative = $file.FullName.Substring($RepoRoot.Length + 1)
    $hasShellAllowExecute = $text -match 'shell:allow-execute'
    $hasShellAllowSpawn = $text -match 'shell:allow-spawn'
    $hasShellReference = $text -match 'plugin-shell|shell:'

    if ($hasShellAllowExecute -or $hasShellAllowSpawn -or $hasShellReference) {
        $foundShellPermission = $true
        $lines.Add("  $relative")
        $lines.Add("    allow-execute: $hasShellAllowExecute")
        $lines.Add("    allow-spawn: $hasShellAllowSpawn")
    }
}

$lines.Add("")
$lines.Add("=== HIGH-LEVEL READOUT ===")
$lines.Add("shell JS package ready: $pkgHasShellJs")
$lines.Add("shell Rust crate ready: $hasShellCrate")
$lines.Add("shell plugin init present: " + ($hasShellInitLib -or $hasShellInitMain))
$lines.Add("externalBin configured: " + (@($externalBin).Count -gt 0))
$lines.Add("resources configured: " + (@($resources).Count -gt 0))
$lines.Add("shell capability present: $foundShellPermission")

Write-Utf8NoBom -Path $artifact -Content (($lines -join [Environment]::NewLine) + [Environment]::NewLine)

Write-Host ""
Write-Host "Wrote: $artifact" -ForegroundColor Cyan
Write-Host ""

foreach ($line in $lines) {
    Write-Host $line
}