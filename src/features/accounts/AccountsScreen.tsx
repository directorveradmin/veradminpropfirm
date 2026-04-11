import Link from 'next/link';
import { getAccounts } from '@/lib/server/workspaceStore';
import { Surface, Panel, StatCard, ActionLink } from '@/lib/ui/surface';

function statusColor(status: string) {
  if (status === 'tradable') return '#22c55e';
  if (status === 'restricted') return '#f59e0b';
  return '#ef4444';
}

function actionHint(status: string) {
  if (status === 'tradable') return 'Continue trading';
  if (status === 'restricted') return 'Reduce risk / protect';
  return 'Stopped — review account';
}

export default function AccountsScreen() {
  const accounts = getAccounts();

  return (
    <Surface
      eyebrow='Core'
      title='Accounts'
      subtitle='Tactical account review with clear status, survivability, and next-action posture.'
      actions={
        <>
          <ActionLink href='/reports' label='Open Reports' primary />
          <ActionLink href='/simulation' label='Open Simulation' />
        </>
      }
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard title='Accounts loaded' value={String(accounts.length)} note='Loaded from local workspace.json.' />
        <StatCard title='Tradable' value={String(accounts.filter((a) => a.status === 'tradable').length)} />
        <StatCard title='Restricted' value={String(accounts.filter((a) => a.status === 'restricted').length)} />
        <StatCard title='Stopped' value={String(accounts.filter((a) => a.status === 'stopped').length)} />
      </section>

      <Panel title='Account roster' subtitle='Open an account card to review its current tactical posture in detail.'>
        <div style={{ display: 'grid', gap: 16 }}>
          {accounts.map((account) => (
            <Link
              key={account.id}
              href={'/accounts/' + account.id}
              style={{
                padding: 20,
                border: '1px solid rgba(71, 94, 132, 0.42)',
                borderRadius: 16,
                background: 'rgba(17,24,39,0.7)',
                textDecoration: 'none',
                color: 'white',
                display: 'grid',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{account.name}</div>
                <div style={{ color: statusColor(account.status), fontWeight: 800, letterSpacing: '0.04em' }}>
                  {account.status.toUpperCase()}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', color: '#dbe6f2' }}>
                <div>Mode: {account.mode}</div>
                <div>Lives: {account.lives}</div>
                <div>Payout Ready: {account.payoutReady ? 'Yes' : 'No'}</div>
                <div>Stage: {account.stage}</div>
              </div>

              <div style={{ fontSize: 13, color: '#9fb3c8' }}>{actionHint(account.status)}</div>
            </Link>
          ))}
        </div>
      </Panel>
    </Surface>
  );
}