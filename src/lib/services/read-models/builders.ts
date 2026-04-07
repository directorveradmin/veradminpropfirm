import type { CommandCenterReadModels } from './types'

/**
 * Conservative Step 5 recovery scaffold.
 *
 * This file intentionally does not derive operational truth from raw values.
 * It only returns a small placeholder read-model bundle so Step 7 can render
 * the Command Center surface without re-implementing rule logic in React.
 *
 * Replace this with the canonical Step 5 builder implementation when the
 * original Step 5 files are restored.
 */
export function buildCommandCenterReadModels(): CommandCenterReadModels {
  return {
    dashboard: {
      generatedAt: new Date().toISOString(),
      isDegraded: true,
      degradedReason:
        'Recovered scaffold: canonical Step 5 read-model builders are missing from this working tree.',
      metrics: [
        { key: 'total', label: 'Total accounts', value: 3 },
        { key: 'tradable', label: 'Tradable', value: 1 },
        { key: 'restricted', label: 'Restricted', value: 1 },
        { key: 'stopped', label: 'Stopped', value: 1 },
        { key: 'payout-ready', label: 'Payout-ready', value: 1 },
        { key: 'fleet-health', label: 'Fleet health', value: 'Recovering' },
      ],
      missionItems: [
        {
          id: 'mission-1',
          label: 'Protect Apex Eval-01 before the next loss event.',
          severity: 'critical',
          accountId: 'acct-1',
        },
        {
          id: 'mission-2',
          label: 'Review payout request readiness on Nova Funded-02.',
          severity: 'high',
          accountId: 'acct-2',
        },
        {
          id: 'mission-3',
          label: 'Confirm why Helix Eval-03 is stopped before resuming work.',
          severity: 'medium',
          accountId: 'acct-3',
        },
      ],
      alerts: [
        {
          id: 'alert-1',
          severity: 'critical',
          title: 'Low lives threshold',
          message: 'Apex Eval-01 is near a critical lives boundary.',
          accountId: 'acct-1',
        },
        {
          id: 'alert-2',
          severity: 'high',
          title: 'Payout action due',
          message: 'Nova Funded-02 needs payout review today.',
          accountId: 'acct-2',
        },
      ],
      accounts: [
        {
          id: 'acct-1',
          label: 'Apex Eval-01',
          firm: 'Apex',
          stage: 'Evaluation',
          mode: 'Guarded',
          tradeState: 'tradable',
          livesRemaining: 1,
          nextMilestone: 'Preserve lives through today',
          warnings: ['Near-risk'],
          quickActions: ['Open account', 'Log win', 'Log loss'],
        },
        {
          id: 'acct-2',
          label: 'Nova Funded-02',
          firm: 'Nova',
          stage: 'Funded',
          mode: 'Protected',
          tradeState: 'restricted',
          livesRemaining: 2,
          nextMilestone: 'Request payout',
          warnings: ['Payout-ready'],
          quickActions: ['Open account', 'Request payout', 'Add note'],
        },
        {
          id: 'acct-3',
          label: 'Helix Eval-03',
          firm: 'Helix',
          stage: 'Evaluation',
          mode: 'Stopped',
          tradeState: 'stopped',
          livesRemaining: 0,
          nextMilestone: 'Inspect account detail',
          warnings: ['Stopped'],
          quickActions: ['Open account', 'Add note'],
        },
      ],
      availableFilters: [
        'all accounts',
        'tradable only',
        'payout-ready only',
        'near-risk only',
        'by firm',
        'by stage',
        'by mode',
      ],
      activeFilter: 'all accounts',
    },
  }
}
