import { Step6ViewModelIntegrator } from '../../lib/services/workflowHelpers/step6ViewModelIntegrator';

function checkResult(result: any, workflowName: string) {
    const requiredKeys = ['accountId', 'workflow', 'consequenceSummary', 'invalidationKeys'];
    const missingKeys = requiredKeys.filter(k => !(k in result) || result[k] === undefined || result[k] === null);
    if (missingKeys.length === 0) {
        console.log(`${workflowName}: ✅ All required fields present`);
    } else {
        console.warn(`${workflowName}: ⚠ Missing fields: ${missingKeys.join(', ')}`);
    }
}

async function auditStep6() {
    const integrator = new Step6ViewModelIntegrator();

    // 1. Create account
    const createResult = integrator.createAccount({
        accountId: 'acct-audit',
        firmId: 'firm-001',
        accountLabel: 'Audit Account',
        lifecycleStage: 'draft',
        startingBalanceCents: 100000,
        currentBalanceCents: 100000,
        peakBalanceCents: 100000,
        initialRuleProfileId: 'profile-001',
        initialRuleProfileVersionId: 'version-001',
        assignmentReason: 'Audit creation',
    });
    checkResult(createResult, 'Create Account');

    // 2. Profile assignment
    const assignResult = integrator.assignProfile({
        accountId: 'acct-audit',
        ruleProfileId: 'profile-002',
        ruleProfileVersionId: 'version-002',
        assignedAt: new Date().toISOString(),
        assignmentReason: 'Audit assign',
        assignedBy: 'user',
    });
    checkResult(assignResult, 'Assign Profile');

    // 3. Trade log
    const tradeResult = integrator.logTrade({
        accountId: 'acct-audit',
        tradingTimestamp: new Date().toISOString(),
        tradeDate: new Date().toISOString(),
        session: 'new_york',
        direction: 'long',
        resultType: 'win',
        pnlAmountCents: 5000,
        source: 'manual',
    });
    checkResult(tradeResult, 'Trade Log');

    // 4. Add note
    const noteResult = integrator.addNote({
        accountId: 'acct-audit',
        noteType: 'general',
        body: 'Audit note',
        createdAt: new Date().toISOString(),
    });
    checkResult(noteResult, 'Add Note');

    // 5. Request payout
    const payoutResult = integrator.requestPayout({
        accountId: 'acct-audit',
        requestedAt: new Date().toISOString(),
        amountRequestedCents: 10000,
    });
    checkResult(payoutResult, 'Request Payout');

    // 6. History integrity
    const historyResult = integrator.ensureHistoryIntegrity('acct-audit');
    checkResult(historyResult, 'History Integrity');
}

auditStep6();