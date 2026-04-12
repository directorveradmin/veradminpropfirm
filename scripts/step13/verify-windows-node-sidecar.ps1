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

$RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot)
$artifact = Join-Path $RepoRoot "artifacts\step13\verify-windows-node-sidecar.txt"

$nodeSidecars = @(
    Get-ChildItem -LiteralPath (Join-Path $RepoRoot "src-tauri\binaries") -Filter "veradmin-node*" -File -ErrorAction SilentlyContinue
)

$resourceRoot = Join-Path $RepoRoot "src-tauri\resources\server"
$checks = @(
    @{ Name = "desktop-bootstrap/index.html"; Path = Join-Path $RepoRoot "desktop-bootstrap\index.html" },
    @{ Name = "server-launcher.cjs"; Path = Join-Path $RepoRoot "src-tauri\resources\server-launcher.cjs" },
    @{ Name = "resource server.js"; Path = Join-Path $resourceRoot "server.js" },
    @{ Name = "resource .next/static"; Path = Join-Path $resourceRoot ".next\static" },
    @{ Name = "resource data/workspace.json"; Path = Join-Path $resourceRoot "data\workspace.json" }
)

$tauri = Get-Content -LiteralPath (Join-Path $RepoRoot "src-tauri\tauri.conf.json") -Raw | ConvertFrom-Json
$bundleExists = $null -ne $tauri.PSObject.Properties["bundle"]
$externalBin = @()
$resources = @()

if ($bundleExists) {
    if ($tauri.bundle.externalBin) { $externalBin = @($tauri.bundle.externalBin) }
    if ($tauri.bundle.resources) { $resources = @($tauri.bundle.resources) }
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("Veradmin Windows sidecar verification")
$lines.Add("Generated: $(Get-Date -Format o)")
$lines.Add("RepoRoot: $RepoRoot")
$lines.Add("Node sidecar count: " + @($nodeSidecars).Count)
foreach ($file in @($nodeSidecars)) {
    $lines.Add("  node sidecar: " + $file.FullName)
}

foreach ($check in $checks) {
    $lines.Add($check.Name + ": " + (Test-Path -LiteralPath $check.Path))
}

$lines.Add("bundle section exists: $bundleExists")
$lines.Add("externalBin: " + (@($externalBin) -join ", "))
$lines.Add("resources: " + (@($resources) -join ", "))

Write-Utf8NoBom -Path $artifact -Content (($lines -join [Environment]::NewLine) + [Environment]::NewLine)
Write-Host "Wrote: $artifact" -ForegroundColor Cyan
foreach ($line in $lines) { Write-Host $line }
