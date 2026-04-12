param(
    [string]$RepoRoot = (Get-Location).Path,
    [int]$Port = 3100,
    [switch]$Recheck
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

function Invoke-PnpmLogged {
    param(
        [string]$Command,
        [string]$RepoRootPath,
        [string]$LogPath
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

    return [pscustomobject]@{
        Command   = $Command
        ExitCode  = $exitCode
        Succeeded = ($exitCode -eq 0)
        LogPath   = $LogPath
    }
}

function Invoke-JsonRequest {
    param(
        [ValidateSet("GET","POST","PATCH")]
        [string]$Method,
        [string]$Uri,
        [object]$Body = $null
    )

    $headers = @{
        "Accept" = "application/json"
    }

    $params = @{
        Method      = $Method
        Uri         = $Uri
        Headers     = $headers
        ErrorAction = "Stop"
        TimeoutSec  = 30
    }

    if ($null -ne $Body) {
        $params["ContentType"] = "application/json"
        $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
    }

    $response = Invoke-RestMethod @params
    return $response
}

function Invoke-TextRequest {
    param([string]$Uri)

    $response = Invoke-WebRequest -UseBasicParsing -Uri $Uri -Method GET -TimeoutSec 30 -ErrorAction Stop
    return [pscustomobject]@{
        StatusCode = [int]$response.StatusCode
        Length     = if ($null -ne $response.Content) { $response.Content.Length } else { 0 }
    }
}

$RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot)
$artifactsRoot = Join-Path $RepoRoot "artifacts\step13"
New-Item -ItemType Directory -Path $artifactsRoot -Force | Out-Null

if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot "package.json"))) {
    throw "package.json not found in $RepoRoot"
}

if ($Recheck) {
    $typecheck = Invoke-PnpmLogged -Command "typecheck" -RepoRootPath $RepoRoot -LogPath (Join-Path $artifactsRoot "typecheck.runtime-smoke.log")
    $test = Invoke-PnpmLogged -Command "test" -RepoRootPath $RepoRoot -LogPath (Join-Path $artifactsRoot "test.runtime-smoke.log")

    if (-not $typecheck.Succeeded -or -not $test.Succeeded) {
        throw "Recheck failed before runtime smoke. See logs in $artifactsRoot"
    }
}

$workspacePath = Join-Path $RepoRoot "data\workspace.json"
$workspaceOriginal = $null
if (Test-Path -LiteralPath $workspacePath) {
    $workspaceOriginal = [System.IO.File]::ReadAllText($workspacePath)
    Write-Utf8NoBom -Path (Join-Path $artifactsRoot "workspace.before-runtime-smoke.json") -Content $workspaceOriginal
}

$devOut = Join-Path $artifactsRoot "dev-web.stdout.log"
$devErr = Join-Path $artifactsRoot "dev-web.stderr.log"
$summaryPath = Join-Path $artifactsRoot "runtime-smoke-summary.txt"
$baseUrl = "http://127.0.0.1:$Port"
$devProcess = $null
$results = New-Object System.Collections.Generic.List[object]

try {
    $command = "set PORT=$Port&& pnpm dev:web"
    $devProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $command -WorkingDirectory $RepoRoot -RedirectStandardOutput $devOut -RedirectStandardError $devErr -PassThru -WindowStyle Hidden

    $ready = $false
    $deadline = (Get-Date).AddMinutes(2)

    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Seconds 2
        try {
            $probe = Invoke-WebRequest -UseBasicParsing -Uri $baseUrl -Method GET -TimeoutSec 10 -ErrorAction Stop
            if ($probe.StatusCode -ge 200 -and $probe.StatusCode -lt 500) {
                $ready = $true
                break
            }
        }
        catch {
            if ($devProcess.HasExited) {
                break
            }
        }
    }

    if (-not $ready) {
        throw "Next dev server did not become ready at $baseUrl within 2 minutes."
    }

    $pageRoutes = @(
        "/",
        "/journal",
        "/alerts",
        "/payouts",
        "/calendar",
        "/accounts",
        "/settings",
        "/backups",
        "/reports",
        "/simulation"
    )

    foreach ($route in $pageRoutes) {
        try {
            $resp = Invoke-TextRequest -Uri ($baseUrl + $route)
            $results.Add([pscustomobject]@{
                Category = "route"
                Target   = $route
                Status   = "pass"
                Detail   = "HTTP $($resp.StatusCode); content length $($resp.Length)"
            })
        }
        catch {
            $results.Add([pscustomobject]@{
                Category = "route"
                Target   = $route
                Status   = "fail"
                Detail   = $_.Exception.Message
            })
        }
    }

    $workspace = $null
    try {
        $workspace = Invoke-JsonRequest -Method "GET" -Uri ($baseUrl + "/api/workspace")
        $results.Add([pscustomobject]@{
            Category = "api"
            Target   = "/api/workspace"
            Status   = "pass"
            Detail   = "Workspace payload loaded."
        })
    }
    catch {
        $results.Add([pscustomobject]@{
            Category = "api"
            Target   = "/api/workspace"
            Status   = "fail"
            Detail   = $_.Exception.Message
        })
    }

    try {
        $reports = Invoke-JsonRequest -Method "GET" -Uri ($baseUrl + "/api/reports/summary")
        $results.Add([pscustomobject]@{
            Category = "api"
            Target   = "/api/reports/summary"
            Status   = "pass"
            Detail   = "Reports payload loaded."
        })
    }
    catch {
        $results.Add([pscustomobject]@{
            Category = "api"
            Target   = "/api/reports/summary"
            Status   = "fail"
            Detail   = $_.Exception.Message
        })
    }

    $firstAccountId = $null
    $firstPayoutId = $null
    $firstAccount = $null
    $firstPayout = $null

    if ($null -ne $workspace -and $workspace.accounts -and $workspace.accounts.Count -gt 0) {
        $firstAccount = $workspace.accounts[0]
        $firstAccountId = [string]$firstAccount.id
    }

    if ($null -ne $workspace -and $workspace.payouts -and $workspace.payouts.Count -gt 0) {
        $firstPayout = $workspace.payouts[0]
        $firstPayoutId = [string]$firstPayout.id
    }

    if ($firstAccountId) {
        try {
            $accountPayload = Invoke-JsonRequest -Method "GET" -Uri ($baseUrl + "/api/accounts/$firstAccountId")
            $results.Add([pscustomobject]@{
                Category = "api"
                Target   = "/api/accounts/$firstAccountId"
                Status   = "pass"
                Detail   = "Account detail payload loaded."
            })
        }
        catch {
            $results.Add([pscustomobject]@{
                Category = "api"
                Target   = "/api/accounts/$firstAccountId"
                Status   = "fail"
                Detail   = $_.Exception.Message
            })
        }

        try {
            $simulationPayload = @{
                accountId = $firstAccountId
                actions   = @("standard_loss")
            }

            $simulation = Invoke-JsonRequest -Method "POST" -Uri ($baseUrl + "/api/simulation/sequence") -Body $simulationPayload
            $results.Add([pscustomobject]@{
                Category = "api"
                Target   = "/api/simulation/sequence"
                Status   = "pass"
                Detail   = "Simulation preview completed for account $firstAccountId."
            })
        }
        catch {
            $results.Add([pscustomobject]@{
                Category = "api"
                Target   = "/api/simulation/sequence"
                Status   = "fail"
                Detail   = $_.Exception.Message
            })
        }

        try {
            $noOpAccountPatch = @{
                mode        = $firstAccount.mode
                status      = $firstAccount.status
                lives       = $firstAccount.lives
                payoutReady = $firstAccount.payoutReady
                note        = $firstAccount.note
            }

            $patchedAccount = Invoke-JsonRequest -Method "PATCH" -Uri ($baseUrl + "/api/accounts/$firstAccountId") -Body $noOpAccountPatch
            $results.Add([pscustomobject]@{
                Category = "write"
                Target   = "/api/accounts/$firstAccountId (PATCH)"
                Status   = "pass"
                Detail   = "No-op account PATCH returned successfully."
            })
        }
        catch {
            $results.Add([pscustomobject]@{
                Category = "write"
                Target   = "/api/accounts/$firstAccountId (PATCH)"
                Status   = "fail"
                Detail   = $_.Exception.Message
            })
        }
    }
    else {
        $results.Add([pscustomobject]@{
            Category = "api"
            Target   = "account-dependent checks"
            Status   = "fail"
            Detail   = "No accounts were available in /api/workspace."
        })
    }

    if ($firstPayoutId) {
        try {
            $noOpPayoutPatch = @{
                status = $firstPayout.status
                note   = $firstPayout.note
                amount = $firstPayout.amount
            }

            $patchedPayout = Invoke-JsonRequest -Method "PATCH" -Uri ($baseUrl + "/api/payouts/$firstPayoutId") -Body $noOpPayoutPatch
            $results.Add([pscustomobject]@{
                Category = "write"
                Target   = "/api/payouts/$firstPayoutId (PATCH)"
                Status   = "pass"
                Detail   = "No-op payout PATCH returned successfully."
            })
        }
        catch {
            $results.Add([pscustomobject]@{
                Category = "write"
                Target   = "/api/payouts/$firstPayoutId (PATCH)"
                Status   = "fail"
                Detail   = $_.Exception.Message
            })
        }
    }
    else {
        $results.Add([pscustomobject]@{
            Category = "api"
            Target   = "payout-dependent checks"
            Status   = "fail"
            Detail   = "No payouts were available in /api/workspace."
        })
    }
}
finally {
    if ($null -ne $workspaceOriginal -and (Test-Path -LiteralPath $workspacePath)) {
        Write-Utf8NoBom -Path $workspacePath -Content $workspaceOriginal
        Write-Utf8NoBom -Path (Join-Path $artifactsRoot "workspace.after-runtime-smoke.json") -Content $workspaceOriginal
    }

    if ($null -ne $devProcess) {
        try {
            cmd /c "taskkill /PID $($devProcess.Id) /T /F" | Out-Null
        }
        catch {
        }
    }
}

$passCount = @($results | Where-Object { $_.Status -eq "pass" }).Count
$failCount = @($results | Where-Object { $_.Status -eq "fail" }).Count

$summary = New-Object System.Collections.Generic.List[string]
$summary.Add("Veradmin runtime smoke summary")
$summary.Add("Generated: $(Get-Date -Format o)")
$summary.Add("RepoRoot: $RepoRoot")
$summary.Add("Base URL: $baseUrl")
$summary.Add("Passes: $passCount")
$summary.Add("Failures: $failCount")
$summary.Add("Stdout log: $devOut")
$summary.Add("Stderr log: $devErr")
$summary.Add("")

foreach ($row in $results) {
    $summary.Add("[$($row.Status.ToUpper())] $($row.Category) :: $($row.Target) :: $($row.Detail)")
}

Write-Utf8NoBom -Path $summaryPath -Content (($summary -join [Environment]::NewLine) + [Environment]::NewLine)

Write-Host ""
Write-Host "Wrote: $summaryPath" -ForegroundColor Cyan
Write-Host ""

foreach ($line in $summary) {
    Write-Host $line
}

if ($failCount -gt 0) {
    exit 2
}

exit 0