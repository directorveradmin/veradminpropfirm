import { getAlerts } from '@/lib/server/workspaceStore';
import { Surface, Panel, StatCard, ActionLink } from '@/lib/ui/surface';

export default function AlertsPage() {
  const alerts = getAlerts();

  return (
    <Surface
      eyebrow='Core'
      title='Alerts'
      subtitle='Inspect active attention items without drowning the operator in noise.'
      actions={
        <>
          <ActionLink href='/accounts' label='Open Accounts' />
          <ActionLink href='/reports' label='Open Reports' primary />
        </>
      }
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard title='Active alerts' value={String(alerts.length)} />
        <StatCard title='Critical' value={String(alerts.filter((a) => a.severity === 'critical').length)} />
        <StatCard title='High' value={String(alerts.filter((a) => a.severity === 'high').length)} />
        <StatCard title='Medium' value={String(alerts.filter((a) => a.severity === 'medium').length)} />
      </section>

      <Panel title='Alert list' subtitle='Current local alerts linked to account posture or state.'>
        <div style={{ display: 'grid', gap: 12 }}>
          {alerts.map((alert) => (
            <article key={alert.id} style={{ borderTop: '1px solid rgba(71, 94, 132, 0.25)', paddingTop: 12 }}>
              <div style={{ fontWeight: 700 }}>{alert.title}</div>
              <div style={{ color: '#9fb3c8' }}>{alert.detail}</div>
              <div style={{ color: '#7f94ae', fontSize: 13 }}>{alert.severity.toUpperCase()} · {alert.category}</div>
            </article>
          ))}
        </div>
      </Panel>
    </Surface>
  );
}