import { getCalendarItems } from '@/lib/server/workspaceStore';
import { Surface, Panel, StatCard, ActionLink } from '@/lib/ui/surface';

export default function CalendarPage() {
  const items = getCalendarItems();

  return (
    <Surface
      eyebrow='Core'
      title='Calendar'
      subtitle='Review cadence, timing windows, and operational rhythm.'
      actions={
        <>
          <ActionLink href='/payouts' label='Open Payouts' />
          <ActionLink href='/reports' label='Open Reports' primary />
        </>
      }
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard title='Upcoming items' value={String(items.length)} />
        <StatCard title='Reviews' value={String(items.filter((i) => i.category === 'review').length)} />
        <StatCard title='Payout windows' value={String(items.filter((i) => i.category === 'payout').length)} />
        <StatCard title='Rotations' value={String(items.filter((i) => i.category === 'rotation').length)} />
      </section>

      <Panel title='Upcoming timeline' subtitle='Current locally tracked calendar items.'>
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((item) => (
            <article key={item.id} style={{ borderTop: '1px solid rgba(71, 94, 132, 0.25)', paddingTop: 12 }}>
              <div style={{ fontWeight: 700 }}>{item.title}</div>
              <div style={{ color: '#9fb3c8' }}>{item.note}</div>
              <div style={{ color: '#7f94ae', fontSize: 13 }}>{item.date} · {item.category}</div>
            </article>
          ))}
        </div>
      </Panel>
    </Surface>
  );
}