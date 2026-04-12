param(
    [string]$RepoRoot = (Get-Location).Path,
    [int]$Port = 3200
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

function Invoke-TextRequest {
    param([string]$Uri)

    $response = Invoke-WebRequest -UseBasicParsing -Uri $Uri -Method GET -TimeoutSec 30 -ErrorAction Stop
    return [pscustomobject]@{
        StatusCode = [int]$response.StatusCode
        Length     = if ($null -ne $response.Content) { $response.Content.Length } else { 0 }
    }
}

function Invoke-JsonRequest {
    param([string]$Uri)
    return Invoke-RestMethod -Uri $Uri -Method GET -TimeoutSec 30 -ErrorAction Stop
}

$RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot)
$artifactsRoot = Join-Path $RepoRoot "artifacts\step13"
$summaryPath = Join-Path $artifactsRoot "verify-standalone-server-summary.txt"
$stdoutPath = Join-Path $artifactsRoot "verify-standalone-server.stdout.log"
$stderrPath = Join-Path $artifactsRoot "verify-standalone-server.stderr.log"
$serverCandidates = @(
    Get-ChildItem -LiteralPath (Join-Path $RepoRoot ".next\standalone") -Recurse -Filter server.js -File -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty FullName -Unique
)

$serverScriptPath = @(
    $serverCandidates |
    Where-Object { $_ -match 'server\.js$' } |
    Sort-Object Length
) | Select-Object -First 1

$baseUrl = "http://127.0.0.1:$Port"

if (-not $serverScriptPath) {
    throw "Standalone server not found anywhere under .next\standalone . Run pnpm build:web first."
}

$results = New-Object System.Collections.Generic.List[object]
$serverProcess = $null

try {
    $command = "set PORT=$Port&& node .next/standalone/server.js"
    $serverProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $command -WorkingDirectory $RepoRoot -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath -PassThru -WindowStyle Hidden

    $ready = $false
    $deadline = (Get-Date).AddMinutes(1)

    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Seconds 2
        try {
            $probe = Invoke-TextRequest -Uri $baseUrl
            if ($probe.StatusCode -ge 200 -and $probe.StatusCode -lt 500) {
                $ready = $true
                break
            }
        }
        catch {
            if ($serverProcess.HasExited) {
                break
            }
        }
    }

    if (-not $ready) {
        throw "Standalone server did not become ready at $baseUrl."
    }

    foreach ($route in @("/", "/reports", "/simulation", "/api/workspace")) {
        try {
            if ($route -eq "/api/workspace") {
                $null = Invoke-JsonRequest -Uri ($baseUrl + $route)
                $results.Add([pscustomobject]@{
                    Target = $route
                    Status = "PASS"
                    Detail = "JSON response loaded."
                })
            }
            else {
                $resp = Invoke-TextRequest -Uri ($baseUrl + $route)
                $results.Add([pscustomobject]@{
                    Target = $route
                    Status = "PASS"
                    Detail = "HTTP $($resp.StatusCode); content length $($resp.Length)"
                })
            }
        }
        catch {
            $results.Add([pscustomobject]@{
                Target = $route
                Status = "FAIL"
                Detail = $_.Exception.Message
            })
        }
    }
}
finally {
    if ($null -ne $serverProcess) {
        try {
            cmd /c "taskkill /PID $($serverProcess.Id) /T /F" | Out-Null
        }
        catch {
        }
    }
}

$passCount = @($results | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = @($results | Where-Object { $_.Status -eq "FAIL" }).Count

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("Veradmin standalone server verification summary")
$lines.Add("Generated: $(Get-Date -Format o)")
$lines.Add("RepoRoot: $RepoRoot")
$lines.Add("Standalone server path: $serverScriptPath")
$lines.Add("Base URL: $baseUrl")
$lines.Add("Passes: $passCount")
$lines.Add("Failures: $failCount")
$lines.Add("Stdout log: $stdoutPath")
$lines.Add("Stderr log: $stderrPath")
$lines.Add("")

foreach ($row in $results) {
    $lines.Add("[$($row.Status)] $($row.Target) :: $($row.Detail)")
}

Write-Utf8NoBom -Path $summaryPath -Content (($lines -join [Environment]::NewLine) + [Environment]::NewLine)

Write-Host ""
Write-Host "Wrote: $summaryPath" -ForegroundColor Cyan
Write-Host ""

foreach ($line in $lines) {
    Write-Host $line
}

if ($failCount -gt 0) {
    exit 2
}

exit 0
