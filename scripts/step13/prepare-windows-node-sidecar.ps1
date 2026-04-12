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

function Get-RustTargetTriple {
    try {
        $triple = (& rustc --print host-tuple 2>$null)
        if ($LASTEXITCODE -eq 0 -and $triple) {
            return ($triple | Select-Object -First 1).Trim()
        }
    }
    catch {
    }

    $verbose = (& rustc -Vv 2>$null)
    foreach ($line in @($verbose)) {
        if ($line -match '^host:\s+(\S+)$') {
            return $matches[1]
        }
    }

    throw "Could not determine Rust target triple from rustc."
}

function Copy-TreeContents {
    param(
        [string]$Source,
        [string]$Destination
    )

    if (-not (Test-Path -LiteralPath $Source)) {
        return
    }

    New-Item -ItemType Directory -Path $Destination -Force | Out-Null

    Get-ChildItem -LiteralPath $Source -Force | ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $Destination $_.Name) -Recurse -Force
    }
}

$RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot)
$artifact = Join-Path $RepoRoot "artifacts\step13\prepare-windows-node-sidecar.txt"

$repoLeaf = Split-Path $RepoRoot -Leaf
$standaloneCandidates = @(
    Get-ChildItem -LiteralPath (Join-Path $RepoRoot ".next\standalone") -Recurse -Filter server.js -File -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty FullName -Unique
)
$standaloneServer = @(
    $standaloneCandidates |
    Where-Object { $_ -match ([regex]::Escape($repoLeaf) + '\\server\.js$') } |
    Sort-Object Length
) | Select-Object -First 1

if (-not $standaloneServer) {
    $standaloneServer = @($standaloneCandidates | Sort-Object Length)[0]
}

$standaloneAppRoot = if ($standaloneServer) { Split-Path -Parent $standaloneServer } else { $null }
$staticDir = Join-Path $RepoRoot ".next\static"
$publicDir = Join-Path $RepoRoot "public"
$seedWorkspace = Join-Path $RepoRoot "data\workspace.json"

if (-not (Test-Path -LiteralPath $standaloneServer)) {
    throw "Missing standalone server.js at $standaloneServer . Run pnpm build:web first."
}

if (-not (Test-Path -LiteralPath $staticDir)) {
    throw "Missing .next\static at $staticDir . Run pnpm build:web first."
}

if (-not (Test-Path -LiteralPath $seedWorkspace)) {
    throw "Missing seed workspace.json at $seedWorkspace"
}

$nodePath = (Get-Command node -ErrorAction Stop).Source
$targetTriple = Get-RustTargetTriple
$nodeBinaryName = if ($targetTriple -like "*windows*") { "veradmin-node-$targetTriple.exe" } else { "veradmin-node-$targetTriple" }
$nodeBinaryTarget = Join-Path $RepoRoot ("src-tauri\binaries\" + $nodeBinaryName)

New-Item -ItemType Directory -Path (Split-Path -Parent $nodeBinaryTarget) -Force | Out-Null
Copy-Item -LiteralPath $nodePath -Destination $nodeBinaryTarget -Force

$resourceRoot = Join-Path $RepoRoot "src-tauri\resources\server"
if (Test-Path -LiteralPath $resourceRoot) {
    Remove-Item -LiteralPath $resourceRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $resourceRoot -Force | Out-Null

Copy-TreeContents -Source (Join-Path $RepoRoot ".next\standalone") -Destination $resourceRoot

Copy-TreeContents -Source $staticDir -Destination (Join-Path $resourceRoot ".next\static")
if (Test-Path -LiteralPath $publicDir) {
    Copy-TreeContents -Source $publicDir -Destination (Join-Path $resourceRoot "public")
}

New-Item -ItemType Directory -Path (Join-Path $resourceRoot "data") -Force | Out-Null
Copy-Item -LiteralPath $seedWorkspace -Destination (Join-Path $resourceRoot "data\workspace.json") -Force

Push-Location $resourceRoot
try {
    & pnpm install --prod --package-import-method=copy --ignore-scripts --shamefully-hoist --force
    if ($LASTEXITCODE -ne 0) {
        throw "pnpm install failed in $resourceRoot"
    }
}
finally {
    Pop-Location
}

$lines = @(
    "Prepared Windows sidecar assets.",
    "RepoRoot: $RepoRoot",
    "Rust target triple: $targetTriple",
    "Node source: $nodePath",
    "Node sidecar target: $nodeBinaryTarget",
    "Standalone server source: $standaloneServer",
    "Resource server root: $resourceRoot",
    "Seed workspace copied: " + (Join-Path $resourceRoot "data\workspace.json")
)

Write-Utf8NoBom -Path $artifact -Content (($lines -join [Environment]::NewLine) + [Environment]::NewLine)
Write-Host "Summary: $artifact" -ForegroundColor Cyan
