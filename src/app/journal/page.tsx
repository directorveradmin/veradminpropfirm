import { getJournalEntries } from '@/lib/server/workspaceStore';
import { Surface, Panel, StatCard, ActionLink } from '@/lib/ui/surface';

export default function JournalPage() {
  const entries = getJournalEntries();

  return (
    <Surface
      eyebrow='Core'
      title='Journal'
      subtitle='Review logged outcomes, notes, and operational reflection.'
      actions={
        <>
          <ActionLink href='/accounts' label='Open Accounts' />
          <ActionLink href='/reports' label='Open Reports' primary />
        </>
      }
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard title='Entries' value={String(entries.length)} />
        <StatCard title='Wins' value={String(entries.filter((e) => e.outcome === 'win').length)} />
        <StatCard title='Losses' value={String(entries.filter((e) => e.outcome === 'loss').length)} />
        <StatCard title='Notes' value={String(entries.filter((e) => e.outcome === 'note').length)} />
      </section>

      <Panel title='Recent entries' subtitle='Current local journal records.'>
        <div style={{ display: 'grid', gap: 12 }}>
          {entries.map((entry) => (
            <article key={entry.id} style={{ borderTop: '1px solid rgba(71, 94, 132, 0.25)', paddingTop: 12 }}>
              <div style={{ fontWeight: 700 }}>{entry.title}</div>
              <div style={{ color: '#9fb3c8' }}>{entry.summary}</div>
              <div style={{ color: '#7f94ae', fontSize: 13 }}>{entry.session} · {entry.createdAt}</div>
            </article>
          ))}
        </div>
      </Panel>
    </Surface>
  );
}