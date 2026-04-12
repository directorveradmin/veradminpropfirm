param(
    [string]$RepoRoot = (Get-Location).Path,
    [int]$Port = 3102
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

function Invoke-TextRequest {
    param([string]$Uri)

    $response = Invoke-WebRequest -UseBasicParsing -Uri $Uri -Method GET -TimeoutSec 30 -ErrorAction Stop
    return [pscustomobject]@{
        StatusCode = [int]$response.StatusCode
        Length     = if ($null -ne $response.Content) { $response.Content.Length } else { 0 }
    }
}

function Invoke-JsonRequestHandled {
    param(
        [ValidateSet("GET","PATCH")]
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

    try {
        $json = Invoke-RestMethod @params
        return [pscustomobject]@{
            StatusCode = 200
            Json       = $json
            Raw        = $null
        }
    }
    catch {
        $statusCode = -1
        $raw = $_.Exception.Message
        $json = $null

        if ($_.Exception.Response) {
            $response = $_.Exception.Response

            try {
                $statusCode = [int]$response.StatusCode
            }
            catch {
                $statusCode = -1
            }

            try {
                $stream = $response.GetResponseStream()
                if ($stream) {
                    $reader = New-Object System.IO.StreamReader($stream)
                    $raw = $reader.ReadToEnd()
                    $reader.Close()
                }
            }
            catch {
            }

            if ($raw) {
                try {
                    $json = $raw | ConvertFrom-Json
                }
                catch {
                }
            }
        }

        return [pscustomobject]@{
            StatusCode = $statusCode
            Json       = $json
            Raw        = $raw
        }
    }
}

function Get-WorkspaceHash {
    param([string]$WorkspacePath)
    return (Get-FileHash -Algorithm SHA256 -LiteralPath $WorkspacePath).Hash
}

$RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot)
$artifactsRoot = Join-Path $RepoRoot "artifacts\step13"
$workspacePath = Join-Path $RepoRoot "data\workspace.json"
$summaryPath = Join-Path $artifactsRoot "verify-write-actions-summary.txt"
$stdoutPath = Join-Path $artifactsRoot "verify-write-actions.stdout.log"
$stderrPath = Join-Path $artifactsRoot "verify-write-actions.stderr.log"
$baseUrl = "http://127.0.0.1:$Port"

if (-not (Test-Path -LiteralPath $workspacePath)) {
    throw "workspace.json not found: $workspacePath"
}

$workspaceOriginal = [System.IO.File]::ReadAllText($workspacePath)
$originalHash = Get-WorkspaceHash -WorkspacePath $workspacePath
$results = New-Object System.Collections.Generic.List[object]
$devProcess = $null

try {
    $command = "set PORT=$Port&& pnpm dev:web"
    $devProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $command -WorkingDirectory $RepoRoot -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath -PassThru -WindowStyle Hidden

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
            if ($devProcess.HasExited) {
                break
            }
        }
    }

    if (-not $ready) {
        throw "Dev server did not become ready at $baseUrl."
    }

    $workspace = Invoke-JsonRequestHandled -Method "GET" -Uri ($baseUrl + "/api/workspace")
    if ($workspace.StatusCode -ne 200 -or -not $workspace.Json) {
        throw "Could not load /api/workspace."
    }

    $account = $null
    $payout = $null

    if ($workspace.Json.accounts -and $workspace.Json.accounts.Count -gt 0) {
        $account = $workspace.Json.accounts[0]
    }

    if ($workspace.Json.payouts -and $workspace.Json.payouts.Count -gt 0) {
        $payout = $workspace.Json.payouts[0]
    }

    if (-not $account) {
        throw "No account available in workspace."
    }

    if (-not $payout) {
        throw "No payout available in workspace."
    }

    $accountId = [string]$account.id
    $payoutId = [string]$payout.id

    $hashBeforeInvalidAccount = Get-WorkspaceHash -WorkspacePath $workspacePath
    $invalidAccount = Invoke-JsonRequestHandled -Method "PATCH" -Uri ($baseUrl + "/api/accounts/$accountId") -Body @{
        lives = -1
        status = "banana"
    }
    $hashAfterInvalidAccount = Get-WorkspaceHash -WorkspacePath $workspacePath

    $results.Add([pscustomobject]@{
        Name = "invalid account patch rejected"
        Passed = ($invalidAccount.StatusCode -eq 400 -and $invalidAccount.Json.stateUnchanged -eq $true -and $hashBeforeInvalidAccount -eq $hashAfterInvalidAccount)
        Detail = "status=$($invalidAccount.StatusCode); unchanged=$($invalidAccount.Json.stateUnchanged); hashStable=$($hashBeforeInvalidAccount -eq $hashAfterInvalidAccount)"
    })

    $hashBeforeInvalidPayout = Get-WorkspaceHash -WorkspacePath $workspacePath
    $invalidPayout = Invoke-JsonRequestHandled -Method "PATCH" -Uri ($baseUrl + "/api/payouts/$payoutId") -Body @{
        amount = -5
        status = "banana"
    }
    $hashAfterInvalidPayout = Get-WorkspaceHash -WorkspacePath $workspacePath

    $results.Add([pscustomobject]@{
        Name = "invalid payout patch rejected"
        Passed = ($invalidPayout.StatusCode -eq 400 -and $invalidPayout.Json.stateUnchanged -eq $true -and $hashBeforeInvalidPayout -eq $hashAfterInvalidPayout)
        Detail = "status=$($invalidPayout.StatusCode); unchanged=$($invalidPayout.Json.stateUnchanged); hashStable=$($hashBeforeInvalidPayout -eq $hashAfterInvalidPayout)"
    })

    $hashBeforeBadJournal = Get-WorkspaceHash -WorkspacePath $workspacePath
    $badJournal = Invoke-JsonRequestHandled -Method "PATCH" -Uri ($baseUrl + "/api/accounts/$accountId") -Body @{
        mode = $account.mode
        status = $account.status
        lives = $account.lives
        payoutReady = $account.payoutReady
        note = $account.note
        journalNote = ("x" * 1001)
    }
    $hashAfterBadJournal = Get-WorkspaceHash -WorkspacePath $workspacePath

    $results.Add([pscustomobject]@{
        Name = "overlong journal note rejected"
        Passed = ($badJournal.StatusCode -eq 400 -and $badJournal.Json.stateUnchanged -eq $true -and $hashBeforeBadJournal -eq $hashAfterBadJournal)
        Detail = "status=$($badJournal.StatusCode); unchanged=$($badJournal.Json.stateUnchanged); hashStable=$($hashBeforeBadJournal -eq $hashAfterBadJournal)"
    })

    $goodJournal = Invoke-JsonRequestHandled -Method "PATCH" -Uri ($baseUrl + "/api/accounts/$accountId") -Body @{
        mode = $account.mode
        status = $account.status
        lives = $account.lives
        payoutReady = $account.payoutReady
        note = $account.note
        journalNote = "Step 13 verification note"
    }

    $changedHash = Get-WorkspaceHash -WorkspacePath $workspacePath
    $journalCount = 0
    if ($goodJournal.Json -and $goodJournal.Json.journal) {
        $journalCount = $goodJournal.Json.journal.Count
    }

    $results.Add([pscustomobject]@{
        Name = "valid journal note appends"
        Passed = ($goodJournal.StatusCode -eq 200 -and $changedHash -ne $originalHash -and $journalCount -gt 0)
        Detail = "status=$($goodJournal.StatusCode); hashChanged=$($changedHash -ne $originalHash); journalCount=$journalCount"
    })
}
finally {
    Write-Utf8NoBom -Path $workspacePath -Content $workspaceOriginal

    if ($null -ne $devProcess) {
        try {
            cmd /c "taskkill /PID $($devProcess.Id) /T /F" | Out-Null
        }
        catch {
        }
    }
}

$restoredHash = Get-WorkspaceHash -WorkspacePath $workspacePath
$passCount = @($results | Where-Object { $_.Passed }).Count
$failCount = @($results | Where-Object { -not $_.Passed }).Count

$summary = New-Object System.Collections.Generic.List[string]
$summary.Add("Veradmin write-action verification summary")
$summary.Add("Generated: $(Get-Date -Format o)")
$summary.Add("RepoRoot: $RepoRoot")
$summary.Add("Base URL: $baseUrl")
$summary.Add("Passes: $passCount")
$summary.Add("Failures: $failCount")
$summary.Add("Workspace restored: $($restoredHash -eq $originalHash)")
$summary.Add("Stdout log: $stdoutPath")
$summary.Add("Stderr log: $stderrPath")
$summary.Add("")

foreach ($row in $results) {
    $status = if ($row.Passed) { "PASS" } else { "FAIL" }
    $summary.Add("[$status] $($row.Name) :: $($row.Detail)")
}

Write-Utf8NoBom -Path $summaryPath -Content (($summary -join [Environment]::NewLine) + [Environment]::NewLine)

Write-Host ""
Write-Host "Wrote: $summaryPath" -ForegroundColor Cyan
Write-Host ""

foreach ($line in $summary) {
    Write-Host $line
}

if ($failCount -gt 0 -or $restoredHash -ne $originalHash) {
    exit 2
}

exit 0
