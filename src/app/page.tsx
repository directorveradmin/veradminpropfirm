import { buildCommandCenterReadModels } from '../lib/services/read-models'
import { buildCommandCenterDashboardViewModel } from '../lib/view-models/dashboard'

function toneStyle(tone: string): string {
  switch (tone) {
    case 'critical':
      return 'border-red-300 bg-red-50 text-red-900'
    case 'high':
      return 'border-amber-300 bg-amber-50 text-amber-900'
    case 'medium':
      return 'border-slate-300 bg-slate-50 text-slate-900'
    default:
      return 'border-slate-200 bg-white text-slate-900'
  }
}

export default function Page() {
  const readModels = buildCommandCenterReadModels()
  const vm = buildCommandCenterDashboardViewModel(readModels.dashboard)

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <header className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Veradmin</p>
              <h1 className="mt-1 text-3xl font-semibold">{vm.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">{vm.subtitle}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
              <div>{new Date(readModels.dashboard.generatedAt).toLocaleString()}</div>
              <div className="mt-1 text-xs text-slate-500">Command surface boot snapshot</div>
            </div>
          </div>
        </header>

        {vm.degradedState ? (
          <section className="rounded-2xl border border-amber-400/40 bg-amber-100/10 p-5">
            <h2 className="text-lg font-semibold text-amber-200">{vm.degradedState.title}</h2>
            <p className="mt-2 text-sm text-amber-100">{vm.degradedState.body}</p>
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Today&apos;s Mission</h2>
            <p className="mt-2 text-sm text-slate-400">
              The Command Center should answer what matters today in seconds.
            </p>
            <div className="mt-4 space-y-3">
              {vm.missionItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border px-4 py-3 ${toneStyle(item.severity)}`}
                >
                  <div className="text-xs uppercase tracking-wide opacity-70">{item.severity}</div>
                  <div className="mt-1 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Fleet Health Strip</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {vm.metrics.map((metric) => (
                <div key={metric.key} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Critical Alerts</h2>
              <p className="mt-2 text-sm text-slate-400">
                Highest-severity warnings surface above neutral summaries.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {vm.alerts.map((alert) => (
              <div key={alert.id} className={`rounded-xl border px-4 py-4 ${toneStyle(alert.severity)}`}>
                <div className="text-xs uppercase tracking-wide opacity-70">{alert.severity}</div>
                <div className="mt-1 font-medium">{alert.title}</div>
                <div className="mt-1 text-sm opacity-90">{alert.message}</div>
              </div>
            ))}
            {vm.quietState ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                <div className="font-medium">{vm.quietState.title}</div>
                <div className="mt-1 text-slate-400">{vm.quietState.body}</div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Fleet Account Grid</h2>
              <p className="mt-2 text-sm text-slate-400">
                Tradable, restricted, and stopped accounts remain easy to distinguish.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {vm.filters.map((filter) => (
                <span
                  key={filter}
                  className={[
                    'rounded-full border px-3 py-1 text-xs uppercase tracking-wide',
                    filter === vm.activeFilter
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200'
                      : 'border-slate-700 bg-slate-950 text-slate-400',
                  ].join(' ')}
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>

          {vm.emptyState ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              <div className="font-medium">{vm.emptyState.title}</div>
              <div className="mt-1 text-slate-400">{vm.emptyState.body}</div>
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {vm.accounts.map((account) => (
              <article key={account.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">{account.firm}</div>
                    <h3 className="mt-1 text-lg font-semibold">{account.label}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {account.stage} Â· {account.mode}
                    </p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide ${toneStyle(account.tradeState)}`}>
                    {account.tradeState}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div className="rounded-xl border border-slate-800 p-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Lives</dt>
                    <dd className="mt-1 text-lg font-semibold text-white">
                      {account.livesRemaining ?? 'â€”'}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-slate-800 p-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Next milestone</dt>
                    <dd className="mt-1 font-medium text-white">{account.nextMilestone}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  {account.warnings.map((warning) => (
                    <span key={warning} className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-wide text-amber-200">
                      {warning}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {account.quickActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
