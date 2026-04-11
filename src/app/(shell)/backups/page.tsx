import { getBackupEvents } from '@/lib/server/workspaceStore';
import { Surface, Panel, StatCard, ActionLink } from '@/lib/ui/surface';

export default function BackupsPage() {
  const events = getBackupEvents();

  return (
    <Surface
      eyebrow='Admin'
      title='Backup, Restore, and Export'
      subtitle='Continuity-safe surfaces for protection, recovery, and governed data portability.'
      actions={
        <>
          <ActionLink href='/settings' label='Open Settings' />
          <ActionLink href='/reports' label='Open Reports' primary />
        </>
      }
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard title='Recent events' value={String(events.length)} />
        <StatCard title='Completed' value={String(events.filter((e) => e.status === 'completed').length)} />
        <StatCard title='Warnings' value={String(events.filter((e) => e.status === 'warning').length)} />
        <StatCard title='Restore posture' value='Guarded' />
      </section>

      <Panel title='Recent continuity events' subtitle='Current local continuity history.'>
        <div style={{ display: 'grid', gap: 12 }}>
          {events.map((event) => (
            <article key={event.id} style={{ borderTop: '1px solid rgba(71, 94, 132, 0.25)', paddingTop: 12 }}>
              <div style={{ fontWeight: 700 }}>{event.label}</div>
              <div style={{ color: '#9fb3c8' }}>{event.note}</div>
              <div style={{ color: '#7f94ae', fontSize: 13 }}>{event.timestamp} · {event.status}</div>
            </article>
          ))}
        </div>
      </Panel>
    </Surface>
  );
}