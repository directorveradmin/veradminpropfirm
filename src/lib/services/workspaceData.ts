export type AccountStatus = 'tradable' | 'restricted' | 'stopped';

export interface AccountRecord {
  id: string;
  name: string;
  mode: string;
  status: AccountStatus;
  lives: number;
  payoutReady: boolean;
  firm: string;
  stage: string;
  note: string;
}

export interface JournalEntry {
  id: string;
  accountId: string;
  title: string;
  outcome: 'win' | 'loss' | 'note';
  session: string;
  summary: string;
  createdAt: string;
}

export interface AlertRecord {
  id: string;
  severity: 'critical' | 'high' | 'medium';
  category: string;
  title: string;
  detail: string;
  accountId?: string;
}

export interface PayoutRecord {
  id: string;
  accountId: string;
  amount: number;
  status: 'ready' | 'requested' | 'received';
  note: string;
}

export interface CalendarItem {
  id: string;
  title: string;
  date: string;
  category: 'rotation' | 'review' | 'payout';
  note: string;
}

export interface BackupEvent {
  id: string;
  label: string;
  timestamp: string;
  status: 'completed' | 'warning';
  note: string;
}

export function getAccounts(): AccountRecord[] {
  return [
    {
      id: 'A1',
      name: 'Account Alpha',
      mode: 'attack',
      status: 'tradable',
      lives: 3,
      payoutReady: false,
      firm: 'Firm One',
      stage: 'Funded',
      note: 'Healthy posture with room to trade.',
    },
    {
      id: 'B1',
      name: 'Account Beta',
      mode: 'preservation',
      status: 'restricted',
      lives: 1,
      payoutReady: true,
      firm: 'Firm Two',
      stage: 'Funded',
      note: 'Protective posture. Prioritize payout discipline.',
    },
    {
      id: 'C1',
      name: 'Account Gamma',
      mode: 'cooldown',
      status: 'stopped',
      lives: 0,
      payoutReady: false,
      firm: 'Firm Three',
      stage: 'Evaluation',
      note: 'Stopped state. Review before any future action.',
    },
  ];
}

export function getAccountById(id: string) {
  return getAccounts().find((account) => account.id === id);
}

export function getJournalEntries(): JournalEntry[] {
  return [
    {
      id: 'J1',
      accountId: 'A1',
      title: 'London breakout review',
      outcome: 'win',
      session: 'London',
      summary: 'Clean continuation entry with controlled size and calm execution.',
      createdAt: '2026-04-10',
    },
    {
      id: 'J2',
      accountId: 'B1',
      title: 'Protection note',
      outcome: 'note',
      session: 'New York',
      summary: 'Account kept in preservation posture due to payout proximity.',
      createdAt: '2026-04-09',
    },
  ];
}

export function getAlerts(): AlertRecord[] {
  return [
    {
      id: 'AL1',
      severity: 'high',
      category: 'risk',
      title: 'Beta is in a protection-sensitive state',
      detail: 'Restricted posture with only one life remaining.',
      accountId: 'B1',
    },
    {
      id: 'AL2',
      severity: 'critical',
      category: 'state',
      title: 'Gamma is stopped',
      detail: 'No further trading should be attempted until reviewed.',
      accountId: 'C1',
    },
  ];
}

export function getPayouts(): PayoutRecord[] {
  return [
    {
      id: 'P1',
      accountId: 'B1',
      amount: 1200,
      status: 'ready',
      note: 'Eligible to request under current posture.',
    },
    {
      id: 'P2',
      accountId: 'A1',
      amount: 600,
      status: 'requested',
      note: 'Awaiting confirmation.',
    },
  ];
}

export function getCalendarItems(): CalendarItem[] {
  return [
    {
      id: 'CAL1',
      title: 'Weekly review',
      date: '2026-04-12',
      category: 'review',
      note: 'Review state shifts, payout rhythm, and alert burden.',
    },
    {
      id: 'CAL2',
      title: 'Payout request window',
      date: '2026-04-13',
      category: 'payout',
      note: 'Beta is the main candidate.',
    },
  ];
}

export function getBackupEvents(): BackupEvent[] {
  return [
    {
      id: 'BKP1',
      label: 'Manual backup',
      timestamp: '2026-04-10 08:15',
      status: 'completed',
      note: 'Local continuity snapshot completed successfully.',
    },
    {
      id: 'BKP2',
      label: 'Export review',
      timestamp: '2026-04-09 18:20',
      status: 'warning',
      note: 'Review export scope before external sharing.',
    },
  ];
}

export function getDashboardStats() {
  const accounts = getAccounts();
  return {
    tradable: accounts.filter((account) => account.status === 'tradable').length,
    restricted: accounts.filter((account) => account.status === 'restricted').length,
    stopped: accounts.filter((account) => account.status === 'stopped').length,
    payoutReady: accounts.filter((account) => account.payoutReady).length,
  };
}