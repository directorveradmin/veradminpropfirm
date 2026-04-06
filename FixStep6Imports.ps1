# ==============================================================
# Step 6 Final Fix: All services, types, and integrator
# ==============================================================
$projectRoot = "C:\Users\emb95\Documents\veradminpropfirm\scaffold"

# --------------------------
# 1. Overwrite accountWorkflowTypes.ts
# --------------------------
$typesFile = "$projectRoot\src\lib\services\accountWorkflowTypes.ts"
@"
export interface AccountWorkflowResult {
  accountId: string;
  workflow: string;
  persistedFactIds?: string[];
  evaluation?: any;
  derivedEvents?: any[];
  invalidationKeys?: string[];
  consequenceSummary?: any;
  degradedState?: any;
}

export interface CreateAccountCommand {
  accountId: string;
  firmId: string;
  accountLabel: string;
  lifecycleStage: string;
  startingBalanceCents: number;
  currentBalanceCents?: number;
  peakBalanceCents?: number;
  initialRuleProfileId: string;
  initialRuleProfileVersionId: string;
  assignmentReason: string;
}

export interface PauseAccountCommand {
  accountId: string;
  eventTimestamp: string;
  reason: string;
}

export interface ResumeAccountCommand {
  accountId: string;
  eventTimestamp: string;
  reason: string;
}

export interface AssignRuleProfileCommand {
  accountId: string;
  ruleProfileId: string;
  ruleProfileVersionId: string;
  assignedAt: string;
  assignmentReason: string;
  assignedBy: 'user' | 'system' | 'migration';
  notes?: string | null;
}

export interface LogTradeResultCommand {
  accountId: string;
  tradingTimestamp: string;
  tradeDate: string;
  session: string;
  direction: 'long' | 'short';
  resultType: 'win' | 'loss' | 'custom';
  pnlAmountCents: number;
  points?: number | null;
  riskUnitFraction?: number | null;
  wasRuleFollowing?: boolean;
  wasNearNews?: boolean;
  setupTagId?: string | null;
  screenshotPath?: string | null;
  note?: string | null;
  source: 'manual' | 'import' | 'system';
}

export interface AddAccountNoteCommand {
  accountId: string;
  noteType: 'general' | 'risk' | 'payout' | 'admin' | 'system';
  body: string;
  createdAt?: string;
}

export interface RequestPayoutCommand {
  accountId: string;
  requestedAt: string;
  amountRequestedCents: number;
  expectedArrivalAt?: string | null;
  notes?: string | null;
}

export interface MarkPayoutReceivedCommand {
  accountId: string;
  payoutRequestId: string;
  receivedAt: string;
  amountReceivedCents?: number | null;
  notes?: string | null;
}
"@ | Set-Content -Path $typesFile
Write-Host "accountWorkflowTypes.ts overwritten with valid TypeScript."

# --------------------------
# 2. Fix imports in all service files
# --------------------------
$serviceFiles = @(
    "accountLifecycleService.ts",
    "profileAssignmentService.ts",
    "accountEventWorkflowService.ts",
    "payoutWorkflowService.ts",
    "accountHistoryIntegrityService.ts"
)

foreach ($file in $serviceFiles) {
    $path = Join-Path $projectRoot "src\lib\services\$file"
    $content = Get-Content $path
    # Replace any import of accountWorkflowTypes with correct path, remove .ts extension
    $content = $content -replace "(from\s*['""])(.*accountWorkflowTypes)(\.ts)?(['""])", '$1$2$4'
    Set-Content -Path $path -Value $content
    Write-Host "$file imports fixed."
}

# --------------------------
# 3. Fix imports in step6ViewModelIntegrator.ts
# --------------------------
$integratorFile = "$projectRoot\src\lib\services\workflowHelpers\step6ViewModelIntegrator.ts"
$content = Get-Content $integratorFile

# Correct accountWorkflowTypes import (remove .ts)
$content = $content -replace "(from\s*['""]\.\./accountWorkflowTypes)(\.ts)?(['""])", '$1$3'

# Correct service imports (remove .ts)
$servicesToFix = @(
    "accountLifecycleService",
    "profileAssignmentService",
    "accountEventWorkflowService",
    "payoutWorkflowService",
    "accountHistoryIntegrityService"
)
foreach ($s in $servicesToFix) {
    $pattern = "(from\s*['""]\.\./$s)(\.ts)?(['""])"
    $content = $content -replace $pattern, '$1$3'
}

Set-Content -Path $integratorFile -Value $content
Write-Host "step6ViewModelIntegrator.ts imports fixed."

Write-Host "✅ All Step 6 services, accountWorkflowTypes, and integrator are now corrected and ready for ts-node."