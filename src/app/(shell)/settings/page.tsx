import { Surface, Panel, StatCard, ActionLink } from '@/lib/ui/surface';

export default function SettingsPage() {
  return (
    <Surface
      eyebrow='Admin'
      title='Settings'
      subtitle='Administrative defaults, governance controls, diagnostics entry points, and system posture.'
      actions={
        <>
          <ActionLink href='/backups' label='Open Backups' primary />
          <ActionLink href='/reports' label='Open Reports' />
        </>
      }
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard title='Theme' value='Dark' />
        <StatCard title='Local mode' value='Enabled' />
        <StatCard title='Exports' value='Governed' />
        <StatCard title='Diagnostics' value='Available' />
      </section>

      <Panel title='Settings groups' subtitle='This route is organized into serious administrative categories.'>
        <div style={{ display: 'grid', gap: 12 }}>
          <article style={{ borderTop: '1px solid rgba(71, 94, 132, 0.25)', paddingTop: 12 }}>
            <div style={{ fontWeight: 700 }}>General</div>
            <div style={{ color: '#9fb3c8' }}>UI defaults and local operating posture.</div>
          </article>
          <article style={{ borderTop: '1px solid rgba(71, 94, 132, 0.25)', paddingTop: 12 }}>
            <div style={{ fontWeight: 700 }}>Governance</div>
            <div style={{ color: '#9fb3c8' }}>Rule profile visibility and administrative boundaries.</div>
          </article>
          <article style={{ borderTop: '1px solid rgba(71, 94, 132, 0.25)', paddingTop: 12 }}>
            <div style={{ fontWeight: 700 }}>Diagnostics</div>
            <div style={{ color: '#9fb3c8' }}>Recovery context and technical verification points.</div>
          </article>
        </div>
      </Panel>
    </Surface>
  );
}