import { Step6ViewModelIntegrator } from '../../lib/services/workflowHelpers/step6ViewModelIntegrator';

// Example usage of Step 6 workflows in Step 7 screen context
async function testStep6Workflows() {
    const integrator = new Step6ViewModelIntegrator();

    // 1. Create an account
    const createResult = integrator.createAccount({
        accountId: 'acct-001',
        firmId: 'firm-001',
        accountLabel: 'Test Account 1',
        lifecycleStage: 'draft',
        startingBalanceCents: 100000,
        currentBalanceCents: 100000,
        peakBalanceCents: 100000,
        initialRuleProfileId: 'profile-001',
        initialRuleProfileVersionId: 'version-001',
        assignmentReason: 'Initial creation',
    });
    console.log('Create account result:', createResult);

    // 2. Assign a new profile
    const assignResult = integrator.assignProfile({
        accountId: 'acct-001',
        ruleProfileId: 'profile-002',
        ruleProfileVersionId: 'version-002',
        assignedAt: new Date().toISOString(),
        assignmentReason: 'Profile upgrade',
        assignedBy: 'user',
    });
    console.log('Profile assignment result:', assignResult);

    // 3. Log a trade
    const tradeResult = integrator.logTrade({
        accountId: 'acct-001',
        tradingTimestamp: new Date().toISOString(),
        tradeDate: new Date().toISOString(),
        session: 'new_york',
        direction: 'long',
        resultType: 'win',
        pnlAmountCents: 5000,
        source: 'manual',
    });
    console.log('Trade log result:', tradeResult);

    // 4. Add a note
    const noteResult = integrator.addNote({
        accountId: 'acct-001',
        noteType: 'general',
        body: 'Initial trade successful',
        createdAt: new Date().toISOString(),
    });
    console.log('Add note result:', noteResult);

    // 5. Request a payout
    const payoutResult = integrator.requestPayout({
        accountId: 'acct-001',
        requestedAt: new Date().toISOString(),
        amountRequestedCents: 10000,
    });
    console.log('Payout request result:', payoutResult);

    // 6. Ensure history integrity
    const historyResult = integrator.ensureHistoryIntegrity('acct-001');
    console.log('History integrity result:', historyResult);
}

// Run the example
testStep6Workflows();
