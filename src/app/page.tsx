import Link from 'next/link';
import { getDashboardStats } from '@/lib/server/workspaceStore';
import { Surface, StatCard } from '@/lib/ui/surface';

const cards = [
  { href: '/accounts', title: 'Accounts', description: 'Open tactical account review and detail flow.' },
  { href: '/journal', title: 'Journal', description: 'Review logged outcomes, notes, and operator reflection.' },
  { href: '/alerts', title: 'Alerts', description: 'Inspect risk and operational attention items.' },
  { href: '/payouts', title: 'Payouts', description: 'Manage payout readiness, requests, and receipts.' },
  { href: '/calendar', title: 'Calendar', description: 'Review cadence, timing windows, and rotation pressure.' },
  { href: '/settings', title: 'Settings', description: 'Administrative defaults and governance controls.' },
  { href: '/backups', title: 'Backups', description: 'Continuity, restore, and export posture.' },
  { href: '/reports', title: 'Reports', description: 'Reflective reporting surface for fleet review.' },
  { href: '/simulation', title: 'Simulation', description: 'Deterministic what-if workbench.' }
];

export default function HomePage() {
  const stats = getDashboardStats();

  return (
    <Surface
      eyebrow='Home'
      title='Veradmin'
      subtitle='Local workspace data now comes from a real JSON-backed persistence layer.'
    >
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        <StatCard title='Tradable' value={String(stats.tradable)} note='Accounts currently able to trade.' />
        <StatCard title='Restricted' value={String(stats.restricted)} note='Accounts that need protective posture.' />
        <StatCard title='Stopped' value={String(stats.stopped)} note='Accounts requiring review before future use.' />
        <StatCard title='Payout ready' value={String(stats.payoutReady)} note='Accounts currently eligible or near eligible.' />
      </section>

      <section style={{ display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24 }}>Workspace routes</h2>
          <p style={{ margin: '8px 0 0', color: '#9fb3c8' }}>
            Every tile below opens a working route backed by local workspace data.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              style={{
                display: 'grid',
                gap: 10,
                padding: 20,
                borderRadius: 20,
                border: '1px solid rgba(71, 94, 132, 0.42)',
                background: 'rgba(12, 20, 34, 0.84)',
                color: '#e6edf3',
                textDecoration: 'none',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>{card.title}</div>
              <div style={{ color: '#9fb3c8', lineHeight: 1.5 }}>{card.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </Surface>
  );
}