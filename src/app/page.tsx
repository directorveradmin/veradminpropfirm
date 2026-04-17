'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type FleetStatsResponse = {
  accountCount: number;
  totalLives: number;
  totalBuffer: number;
  tradableCount: number;
};

type FleetAlert = {
  id: string;
  accountId?: string;
  label?: string;
  severity?: 'low' | 'medium' | 'high' | string;
  title: string;
  message: string;
  source?: string;
  code?: string;
  mode?: string;
};

type FleetAlertsResponse = {
  alerts: FleetAlert[];
};

type AccountListItem = {
  id: string;
  label: string;
  size?: number;
  balance?: number;
  highWaterMark?: number;
  stage?: string;
  drawdownType?: string;
  status?: string;
  targetBalance?: number;
};

type AccountsGetResponse = AccountListItem[];

type DashboardState = {
  stats: FleetStatsResponse | null;
  alerts: FleetAlertsResponse | null;
  accounts: AccountsGetResponse;
  loading: boolean;
  error: string | null;
};

type MissionItem = {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  index: number;
  title: string;
  href: string;
};

async function readJsonOrThrow<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status} ${response.statusText}). Response body:\n${rawText.slice(0, 800)}`,
    );
  }

  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(
      `Expected JSON but received "${contentType || 'unknown content type'}". Response body:\n${rawText.slice(0, 800)}`,
    );
  }

  return JSON.parse(rawText) as T;
}

function formatNumber(value: number | null | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US').format(value);
}

function formatLives(value: number | null | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }

  return `${value.toFixed(2)} LIVES`;
}

function formatCurrency(value: number | null | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function getSeverityBadgeStyle(severity?: string): React.CSSProperties {
  switch (severity) {
    case 'high':
      return {
        background: 'rgba(234, 88, 12, 0.14)',
        color: '#fed7aa',
        border: '1px solid rgba(249, 115, 22, 0.28)',
      };
    case 'medium':
      return {
        background: 'rgba(234, 179, 8, 0.14)',
        color: '#fde68a',
        border: '1px solid rgba(250, 204, 21, 0.28)',
      };
    case 'low':
      return {
        background: 'rgba(34, 197, 94, 0.14)',
        color: '#bbf7d0',
        border: '1px solid rgba(34, 197, 94, 0.28)',
      };
    default:
      return {
        background: 'rgba(148, 163, 184, 0.12)',
        color: '#cbd5e1',
        border: '1px solid rgba(148, 163, 184, 0.2)',
      };
  }
}

function getMissionDotStyle(priority: MissionItem['priority']): React.CSSProperties {
  switch (priority) {
    case 'critical':
      return { background: '#ef4444' };
    case 'high':
      return { background: '#f59e0b' };
    case 'medium':
      return { background: '#eab308' };
    default:
      return { background: '#64748b' };
  }
}

function getStatusPill(
  account: AccountListItem,
  alerts: FleetAlert[],
): { label: string; tone: 'green' | 'amber' | 'slate' | 'violet' } {
  const relatedAlert = alerts.find((alert) => alert.accountId === account.id);

  if (account.status && account.status.toLowerCase() !== 'active') {
    return { label: account.status, tone: 'slate' };
  }

  if (relatedAlert?.mode) {
    const mode = relatedAlert.mode.toLowerCase();

    if (mode.includes('restricted')) {
      return { label: 'Restricted', tone: 'amber' };
    }

    if (mode.includes('stable')) {
      return { label: 'Stable', tone: 'green' };
    }
  }

  if ((account.stage ?? '').toLowerCase().includes('fund')) {
    return { label: 'Funded', tone: 'violet' };
  }

  return { label: account.stage ?? 'Active', tone: 'slate' };
}

function pillStyle(
  tone: 'green' | 'amber' | 'slate' | 'violet',
): React.CSSProperties {
  switch (tone) {
    case 'green':
      return {
        background: '#e7f8ee',
        color: '#166534',
      };
    case 'amber':
      return {
        background: '#fdf2d7',
        color: '#9a6700',
      };
    case 'violet':
      return {
        background: '#ede9fe',
        color: '#5b21b6',
      };
    default:
      return {
        background: '#eef2f7',
        color: '#475569',
      };
  }
}

function sectionCardStyle(): React.CSSProperties {
  return {
    background:
      'linear-gradient(180deg, rgba(20, 30, 67, 0.96) 0%, rgba(15, 23, 42, 0.97) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 26,
    boxShadow: '0 16px 34px rgba(15, 23, 42, 0.16)',
  };
}

function whiteCardStyle(): React.CSSProperties {
  return {
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(15, 23, 42, 0.06)',
    borderRadius: 22,
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
  };
}

function deriveMissionItems(
  stats: FleetStatsResponse | null,
  alerts: FleetAlertsResponse | null,
  accounts: AccountListItem[],
): MissionItem[] {
  const items: MissionItem[] = [];

  if ((stats?.tradableCount ?? 0) === 0 && (stats?.accountCount ?? 0) > 0) {
    items.push({
      id: 'm1',
      index: 1,
      priority: 'critical',
      title: 'No accounts are tradable right now',
      href: '/accounts',
    });
  }

  const restrictedLabels = (alerts?.alerts ?? [])
    .slice(0, 2)
    .map((alert) => alert.label)
    .filter(Boolean) as string[];

  if (restrictedLabels.length > 0) {
    items.push({
      id: 'm2',
      index: 2,
      priority: 'high',
      title: `Review ${restrictedLabels.join(' and ')} after reset`,
      href: '/accounts',
    });
  }

  const fundedCandidate = accounts.find((account) =>
    (account.stage ?? '').toLowerCase().includes('fund'),
  );

  if (fundedCandidate) {
    items.push({
      id: 'm3',
      index: 3,
      priority: 'medium',
      title: `${fundedCandidate.label} is approaching payout-safe posture`,
      href: '/payouts',
    });
  }

  items.push({
    id: 'm4',
    index: 4,
    priority: 'medium',
    title: 'Review calendar timing and tomorrow’s operational pressure',
    href: '/calendar',
  });

  return items.slice(0, 4);
}

function SidebarActionButton({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 18px',
        textDecoration: 'none',
        color: '#0f172a',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(255,255,255,0.12)',
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: '#f8fafc',
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: '#cbd5e1',
            fontSize: 14,
            marginTop: 6,
            lineHeight: 1.35,
          }}
        >
          {description}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [state, setState] = useState<DashboardState>({
    stats: null,
    alerts: null,
    accounts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard(): Promise<void> {
      try {
        const [statsResponse, alertsResponse, accountsResponse] =
          await Promise.all([
            fetch('/api/fleet/stats', { cache: 'no-store' }),
            fetch('/api/fleet/alerts', { cache: 'no-store' }),
            fetch('/api/accounts/get', { cache: 'no-store' }),
          ]);

        const [statsData, alertsData, accountsData] = await Promise.all([
          readJsonOrThrow<FleetStatsResponse>(statsResponse),
          readJsonOrThrow<FleetAlertsResponse>(alertsResponse),
          readJsonOrThrow<AccountsGetResponse>(accountsResponse),
        ]);

        if (cancelled) {
          return;
        }

        setState({
          stats: statsData,
          alerts: alertsData,
          accounts: Array.isArray(accountsData) ? accountsData : [],
          loading: false,
          error: null,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({
          stats: null,
          alerts: null,
          accounts: [],
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Unknown dashboard load failure.',
        });
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const alerts = state.alerts?.alerts ?? [];
  const topAccounts = state.accounts.slice(0, 3);
  const missionItems = useMemo(
    () => deriveMissionItems(state.stats, state.alerts, state.accounts),
    [state.stats, state.alerts, state.accounts],
  );

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 28,
        background:
          'radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 22%), linear-gradient(180deg, #f7f8fc 0%, #eef2f8 100%)',
      }}
    >
      <div
        style={{
          maxWidth: 1340,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 18,
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: 1.4,
                textTransform: 'uppercase',
              }}
            >
              Veradmin
            </div>
            <h1
              style={{
                margin: '6px 0 0',
                fontSize: 26,
                lineHeight: 1.1,
                letterSpacing: 0.2,
                color: '#0f172a',
              }}
            >
              FLEET COMMAND
            </h1>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              style={{
                height: 48,
                borderRadius: 999,
                border: '1px solid rgba(148,163,184,0.25)',
                background: '#f8fafc',
                padding: '0 20px',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              ＋ Journal Entry
            </button>

            <Link
              href="/accounts"
              style={{
                height: 48,
                borderRadius: 999,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 26px',
                background:
                  'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                color: '#ffffff',
                fontWeight: 800,
                boxShadow: '0 10px 22px rgba(34,197,94,0.28)',
              }}
            >
              ⛃ Fund Accounts
            </Link>

            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                border: '1px solid rgba(148,163,184,0.2)',
                background: '#f8fafc',
                color: '#334155',
                fontSize: 18,
                cursor: 'pointer',
              }}
              aria-label="Refresh dashboard"
              title="Refresh dashboard"
            >
              ↻
            </button>
          </div>
        </div>

        {state.loading ? (
          <div
            style={{
              ...whiteCardStyle(),
              padding: 22,
              color: '#334155',
            }}
          >
            Loading Fleet Command...
          </div>
        ) : null}

        {state.error ? (
          <div
            style={{
              ...whiteCardStyle(),
              padding: 22,
              color: '#7f1d1d',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            <strong>Dashboard load failed</strong>
            <div style={{ marginTop: 8 }}>{state.error}</div>
          </div>
        ) : null}

        {!state.loading && !state.error ? (
          <>
            <section
              style={{
                ...sectionCardStyle(),
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1.15fr)',
                gap: 14,
                padding: 18,
                marginBottom: 22,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  borderRadius: 22,
                  padding: 22,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: '#f8fafc',
                    marginBottom: 18,
                  }}
                >
                  Today&apos;s Mission
                </div>

                <div style={{ display: 'grid', gap: 16 }}>
                  {missionItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        textDecoration: 'none',
                        color: '#f8fafc',
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 999,
                          display: 'grid',
                          placeItems: 'center',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: 14,
                          flexShrink: 0,
                          ...getMissionDotStyle(item.priority),
                        }}
                      >
                        {item.index}
                      </div>

                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </div>
                    </Link>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 14,
                    alignItems: 'center',
                    marginTop: 26,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      color: '#94a3b8',
                    }}
                  >
                    <span>◌</span>
                    <span>→</span>
                    <span style={{ color: '#cbd5e1' }}>●</span>
                    <span>○</span>
                    <span>○</span>
                    <span>○</span>
                  </div>

                  <Link
                    href="/calendar"
                    style={{
                      borderRadius: 999,
                      padding: '14px 26px',
                      textDecoration: 'none',
                      color: '#eff6ff',
                      fontWeight: 800,
                      background:
                        'linear-gradient(135deg, rgba(96, 125, 255, 0.95), rgba(91, 115, 214, 0.95))',
                    }}
                  >
                    Start Rotation Prep
                  </Link>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    ...whiteCardStyle(),
                    padding: 22,
                    minHeight: 110,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#64748b',
                      letterSpacing: 0.4,
                    }}
                  >
                    FLEET POWER
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 26,
                      fontWeight: 900,
                      color: '#1e3a8a',
                    }}
                  >
                    {formatLives(state.stats?.totalLives)}
                  </div>
                </div>

                <div
                  style={{
                    ...whiteCardStyle(),
                    padding: 22,
                    minHeight: 110,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#64748b',
                      letterSpacing: 0.4,
                    }}
                  >
                    ACCOUNTS
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 26,
                      fontWeight: 900,
                      color: '#0f172a',
                    }}
                  >
                    {formatNumber(state.stats?.accountCount)}
                  </div>
                </div>

                <div
                  style={{
                    ...whiteCardStyle(),
                    padding: 22,
                    minHeight: 110,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#64748b',
                      letterSpacing: 0.4,
                    }}
                  >
                    BUFFER
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 26,
                      fontWeight: 900,
                      color: '#0f172a',
                    }}
                  >
                    {formatCurrency(state.stats?.totalBuffer)}
                  </div>
                </div>

                <div
                  style={{
                    ...whiteCardStyle(),
                    padding: 22,
                    minHeight: 110,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#64748b',
                      letterSpacing: 0.4,
                    }}
                  >
                    TRADABLE
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 26,
                      fontWeight: 900,
                      color: '#6b21a8',
                    }}
                  >
                    {formatNumber(state.stats?.tradableCount)}
                  </div>
                </div>
              </div>
            </section>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
                gap: 18,
                marginBottom: 22,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 22,
                      color: '#0f172a',
                    }}
                  >
                    Active Alerts
                  </h2>
                  <span
                    style={{
                      minWidth: 28,
                      height: 28,
                      borderRadius: 999,
                      display: 'inline-grid',
                      placeItems: 'center',
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#0f172a',
                      background: '#e2e8f0',
                    }}
                  >
                    {alerts.length}
                  </span>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  {alerts.length === 0 ? (
                    <div
                      style={{
                        ...whiteCardStyle(),
                        padding: 20,
                        color: '#475569',
                      }}
                    >
                      No active alerts.
                    </div>
                  ) : (
                    alerts.slice(0, 2).map((alert, index) => (
                      <div
                        key={alert.id}
                        style={{
                          ...whiteCardStyle(),
                          padding: '18px 20px',
                          background:
                            index === 0
                              ? 'linear-gradient(180deg, rgba(255,247,237,0.96), rgba(255,251,235,0.98))'
                              : 'linear-gradient(180deg, rgba(254,242,242,0.96), rgba(255,245,245,0.98))',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 14,
                          }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 999,
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: 14,
                              fontWeight: 800,
                              color: '#fff',
                              background: index === 0 ? '#fbbf24' : '#f97316',
                              flexShrink: 0,
                            }}
                          >
                            {index + 1}
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 18,
                                fontWeight: 800,
                                color: '#0f172a',
                                lineHeight: 1.3,
                              }}
                            >
                              {alert.title}
                              <span
                                style={{
                                  fontWeight: 500,
                                  color: '#475569',
                                }}
                              >
                                {' '}
                                {alert.message}
                              </span>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                flexWrap: 'wrap',
                                marginTop: 12,
                                color: '#64748b',
                                fontSize: 14,
                              }}
                            >
                              <span>◔</span>
                              <span>
                                {alert.label ?? alert.accountId ?? 'Fleet context'}
                              </span>
                              <span
                                style={{
                                  borderRadius: 999,
                                  padding: '4px 8px',
                                  fontSize: 12,
                                  fontWeight: 700,
                                  ...getSeverityBadgeStyle(alert.severity),
                                }}
                              >
                                {alert.severity ?? 'info'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div
                style={{
                  ...sectionCardStyle(),
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                    marginBottom: 16,
                  }}
                >
                  {['ALL', 'WARNING', 'ATTENTION', 'STABLE'].map((tab, index) => (
                    <div
                      key={tab}
                      style={{
                        borderRadius: 999,
                        padding: '8px 14px',
                        fontSize: 13,
                        fontWeight: 800,
                        color:
                          index === 2
                            ? '#fff7ed'
                            : index === 3
                              ? '#dcfce7'
                              : '#cbd5e1',
                        background:
                          index === 2
                            ? 'rgba(245,158,11,0.35)'
                            : index === 3
                              ? 'rgba(34,197,94,0.28)'
                              : 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {tab}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    display: 'flex',
                    marginBottom: 18,
                  }}
                >
                  <div style={{ width: '34%', background: '#7dd3fc' }} />
                  <div style={{ width: '26%', background: '#86efac' }} />
                  <div style={{ width: '22%', background: '#facc15' }} />
                  <div style={{ width: '18%', background: '#fb7185' }} />
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                    marginBottom: 18,
                  }}
                >
                  <Link
                    href="/calendar"
                    style={{
                      borderRadius: 16,
                      padding: '14px 18px',
                      textDecoration: 'none',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#f8fafc',
                      fontWeight: 700,
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    + 1 Day
                  </Link>

                  <Link
                    href="/calendar"
                    style={{
                      borderRadius: 16,
                      padding: '14px 18px',
                      textDecoration: 'none',
                      background: 'rgba(255,255,255,0.10)',
                      color: '#f8fafc',
                      fontWeight: 800,
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}
                  >
                    Start Rotation
                  </Link>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gap: 10,
                  }}
                >
                  <SidebarActionButton
                    href="/accounts"
                    icon="🧾"
                    title="Accounts Engine"
                    description="Browse, operate, and inspect the fleet."
                  />
                  <SidebarActionButton
                    href="/payouts"
                    icon="💸"
                    title="Payout Manager"
                    description="Review readiness, blockers, and payout timing."
                  />
                  <SidebarActionButton
                    href="/calendar"
                    icon="🗓️"
                    title="Calendar / Rotation"
                    description="Stage rhythm, cadence, and timing pressure."
                  />
                  <SidebarActionButton
                    href="/settings"
                    icon="⚙️"
                    title="Settings / Rule Profiles"
                    description="Manage rules, defaults, and enforcement."
                  />
                </div>
              </div>
            </section>

            <section>
              <h2
                style={{
                  margin: '0 0 14px',
                  fontSize: 22,
                  color: '#0f172a',
                }}
              >
                Fleet Overview
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 16,
                }}
              >
                {topAccounts.map((account) => {
                  const pill = getStatusPill(account, alerts);

                  return (
                    <Link
                      key={account.id}
                      href="/accounts"
                      style={{
                        ...whiteCardStyle(),
                        padding: 20,
                        textDecoration: 'none',
                        color: '#0f172a',
                        display: 'block',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 12,
                          marginBottom: 18,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              color: '#64748b',
                              fontWeight: 700,
                              marginBottom: 6,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                            }}
                          >
                            {account.stage ?? 'ACCOUNT'}
                          </div>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 800,
                              lineHeight: 1.2,
                            }}
                          >
                            {account.label}
                          </div>
                        </div>

                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 14,
                            background: '#f1f5f9',
                            display: 'grid',
                            placeItems: 'center',
                            color: '#64748b',
                            fontSize: 18,
                            flexShrink: 0,
                          }}
                        >
                          ⚙
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 900,
                          color: '#0f172a',
                          marginBottom: 16,
                        }}
                      >
                        {formatLives(state.stats ? state.stats.totalLives / Math.max(state.stats.accountCount, 1) : null)}
                      </div>

                      <div
                        style={{
                          fontSize: 15,
                          color: '#334155',
                          lineHeight: 1.45,
                          marginBottom: 14,
                        }}
                      >
                        Balance {formatCurrency(account.balance)} · High-water{' '}
                        {formatCurrency(account.highWaterMark)}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            borderRadius: 999,
                            padding: '6px 10px',
                            fontSize: 12,
                            fontWeight: 800,
                            ...pillStyle(pill.tone),
                          }}
                        >
                          {pill.label}
                        </span>

                        <span
                          style={{
                            borderRadius: 999,
                            padding: '6px 10px',
                            fontSize: 12,
                            fontWeight: 800,
                            background: '#eef2ff',
                            color: '#4338ca',
                          }}
                        >
                          {account.drawdownType ?? 'Drawdown'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}