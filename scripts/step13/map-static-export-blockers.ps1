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
$artifact = Join-Path $RepoRoot "artifacts\step13\static-export-blockers.txt"
$srcRoot = Join-Path $RepoRoot "src"
$apiRoot = Join-Path $RepoRoot "src\app\api"

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("Veradmin static export blocker map")
$lines.Add("Generated: $(Get-Date -Format o)")
$lines.Add("RepoRoot: $RepoRoot")
$lines.Add("")

$apiRefs = @(
    Get-ChildItem -LiteralPath $srcRoot -Recurse -Include *.ts,*.tsx -File -ErrorAction SilentlyContinue |
    Select-String -Pattern '/api/' -SimpleMatch -ErrorAction SilentlyContinue
)

$lines.Add("=== /api/ REFERENCES IN SRC ===")
if (@($apiRefs).Count -eq 0) {
    $lines.Add("None")
} else {
    foreach ($match in $apiRefs) {
        $lines.Add("$($match.Path):$($match.LineNumber)")
        $lines.Add("  $($match.Line.Trim())")
    }
}

$lines.Add("")
$lines.Add("=== APP API ROUTES ===")
$apiRouteFiles = @(
    Get-ChildItem -LiteralPath $apiRoot -Recurse -Filter route.ts -File -ErrorAction SilentlyContinue
)

if (@($apiRouteFiles).Count -eq 0) {
    $lines.Add("None")
} else {
    foreach ($file in $apiRouteFiles) {
        $text = Get-Content -LiteralPath $file.FullName -Raw
        $relative = $file.FullName.Substring($RepoRoot.Length + 1)

        $verbs = @(
            [regex]::Matches($text, 'export\s+async\s+function\s+(GET|POST|PATCH|PUT|DELETE)') |
            ForEach-Object { $_.Groups[1].Value } |
            Select-Object -Unique
        )

        $usesRequest = $text -match '\bRequest\b' -or $text -match 'context:\s*\{'
        $lines.Add($relative)
        $lines.Add("  verbs: " + ((@($verbs) -join ", ")))
        $lines.Add("  request/context dependent: $usesRequest")
    }
}

$lines.Add("")
$lines.Add("=== DYNAMIC APP ROUTES ===")
$dynamicRoutes = @(
    Get-ChildItem -LiteralPath (Join-Path $RepoRoot "src\app") -Recurse -Filter page.tsx -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -match '\\\[[^\\]+\]\\' }
)

if (@($dynamicRoutes).Count -eq 0) {
    $lines.Add("None")
} else {
    foreach ($file in $dynamicRoutes) {
        $relative = $file.FullName.Substring($RepoRoot.Length + 1)
        $text = Get-Content -LiteralPath $file.FullName -Raw
        $hasGenerateStaticParams = $text -match 'generateStaticParams'
        $lines.Add($relative)
        $lines.Add("  has generateStaticParams: $hasGenerateStaticParams")
    }
}

Write-Utf8NoBom -Path $artifact -Content (($lines -join [Environment]::NewLine) + [Environment]::NewLine)

Write-Host ""
Write-Host "Wrote: $artifact" -ForegroundColor Cyan
Write-Host ""

foreach ($line in $lines) {
    Write-Host $line
}