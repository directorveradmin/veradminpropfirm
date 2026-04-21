
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
  switch ((severity ?? '').toLowerCase()) {
    case 'high':
      return {
        background: 'rgba(249, 115, 22, 0.14)',
        color: '#c2410c',
        border: '1px solid rgba(249, 115, 22, 0.22)',
      };
    case 'medium':
      return {
        background: 'rgba(245, 158, 11, 0.14)',
        color: '#a16207',
        border: '1px solid rgba(245, 158, 11, 0.22)',
      };
    case 'low':
      return {
        background: 'rgba(34, 197, 94, 0.14)',
        color: '#166534',
        border: '1px solid rgba(34, 197, 94, 0.22)',
      };
    default:
      return {
        background: 'rgba(100, 116, 139, 0.1)',
        color: '#475569',
        border: '1px solid rgba(100, 116, 139, 0.18)',
      };
  }
}

function getMissionDotStyle(priority: MissionItem['priority']): React.CSSProperties {
  switch (priority) {
    case 'critical':
      return { background: '#e35252' };
    case 'high':
      return { background: '#f59e0b' };
    case 'medium':
      return { background: '#eab308' };
    default:
      return { background: '#94a3b8' };
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

    if (mode.includes('preservation')) {
      return { label: 'Preservation', tone: 'amber' };
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
        background: '#e9f8ef',
        color: '#166534',
      };
    case 'amber':
      return {
        background: '#fff4d8',
        color: '#9a6700',
      };
    case 'violet':
      return {
        background: '#efebff',
        color: '#5b21b6',
      };
    default:
      return {
        background: '#eff3f8',
        color: '#475569',
      };
  }
}

function sectionCardStyle(): React.CSSProperties {
  return {
    background:
      'linear-gradient(135deg, rgba(17, 27, 61, 0.98) 0%, rgba(24, 38, 82, 0.98) 55%, rgba(18, 27, 59, 0.98) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 26,
    boxShadow: '0 22px 44px rgba(15, 23, 42, 0.18)',
  };
}

function whiteCardStyle(): React.CSSProperties {
  return {
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid rgba(15, 23, 42, 0.06)',
    borderRadius: 22,
    boxShadow: '0 16px 32px rgba(15, 23, 42, 0.08)',
  };
}

function sidebarStyle(): React.CSSProperties {
  return {
    width: 300,
    minHeight: 'calc(100vh - 24px)',
    borderRadius: 0,
    background:
      'radial-gradient(circle at 20% 10%, rgba(58, 98, 255, 0.18), transparent 25%), linear-gradient(180deg, #0b132f 0%, #0f193d 42%, #0b132e 100%)',
    color: '#ffffff',
    padding: '26px 16px 22px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.05)',
  };
}

function navItemStyle(active?: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    height: 56,
    padding: '0 18px',
    textDecoration: 'none',
    color: active ? '#ffffff' : 'rgba(226,232,240,0.88)',
    background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
    border: active ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
    borderRadius: 16,
    fontWeight: active ? 700 : 500,
    boxShadow: active ? '0 14px 28px rgba(0,0,0,0.16)' : 'none',
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
      title: `${fundedCandidate.label} is approaching payout safe posture`,
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

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'grid',
        placeItems: 'center',
        fontSize: 18,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function TopRoundButton({
  label,
  title,
  onClick,
}: {
  label: string;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      style={{
        width: 46,
        height: 46,
        borderRadius: 999,
        border: '1px solid rgba(148,163,184,0.16)',
        background: 'rgba(245,247,252,0.95)',
        color: '#24324a',
        boxShadow: '0 8px 18px rgba(15,23,42,0.06)',
        cursor: 'pointer',
        fontSize: 18,
        fontWeight: 700,
      }}
    >
      {label}
    </button>
  );
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

function FleetMetricCard({
  title,
  value,
  valueColor,
}: {
  title: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div
      style={{
        ...whiteCardStyle(),
        padding: 22,
        minHeight: 118,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: '#69778f',
          letterSpacing: 0.5,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 27,
          fontWeight: 900,
          color: valueColor,
          letterSpacing: -0.3,
        }}
      >
        {value}
      </div>
    </div>
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
        const [statsResponse, alertsResponse, accountsResponse] = await Promise.all([
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
        background:
          'radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 18%), linear-gradient(180deg, #f6f7fb 0%, #eef2f7 100%)',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px minmax(0, 1fr)',
          minHeight: '100vh',
        }}
      >
        <aside style={sidebarStyle()}>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '6px 12px 22px',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background:
                    'linear-gradient(135deg, rgba(255,215,120,0.95), rgba(255,255,255,0.95))',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#111827',
                  fontSize: 16,
                  fontWeight: 900,
                }}
              >
                V
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: 0.6,
                  color: '#ffffff',
                }}
              >
                VERADMIN <span style={{ color: '#5f8cff' }}>PRO</span>
              </div>
            </div>

            <nav
              style={{
                display: 'grid',
                gap: 10,
                marginTop: 8,
              }}
            >
              <Link href="/" style={navItemStyle(true)}>
                <IconBadge>▥</IconBadge>
                <span>Dashboard</span>
              </Link>

              <Link href="/accounts" style={navItemStyle()}>
                <IconBadge>🛡</IconBadge>
                <span>Accounts Engine</span>
              </Link>

              <Link href="/payouts" style={navItemStyle()}>
                <IconBadge>◔</IconBadge>
                <span>Payout Manager</span>
              </Link>

              <Link href="/alerts" style={navItemStyle()}>
                <IconBadge>☷</IconBadge>
                <span style={{ flex: 1 }}>Alerts &amp; History</span>
                <div
                  style={{
                    minWidth: 34,
                    height: 34,
                    borderRadius: 999,
                    padding: '0 10px',
                    background: '#ea6b63',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    boxShadow: '0 12px 24px rgba(234,107,99,0.24)',
                  }}
                >
                  3
                </div>
              </Link>

              <Link href="/settings" style={navItemStyle()}>
                <IconBadge>⚙</IconBadge>
                <span>Settings</span>
              </Link>
            </nav>
          </div>

          <div
            style={{
              paddingTop: 18,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'grid',
              gap: 10,
            }}
          >
            <Link href="/backup" style={navItemStyle()}>
              <IconBadge>🗃</IconBadge>
              <span>Backup / Export</span>
            </Link>

            <Link href="/about" style={navItemStyle()}>
              <IconBadge>⋯</IconBadge>
              <span>About</span>
            </Link>
          </div>
        </aside>

        <div
          style={{
            padding: '26px 28px 30px',
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 20,
                alignItems: 'center',
                marginBottom: 20,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 22,
                    lineHeight: 1.1,
                    letterSpacing: 0.4,
                    color: '#15233f',
                    fontWeight: 900,
                  }}
                >
                  FLEET COMMAND
                </h1>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  style={{
                    height: 46,
                    borderRadius: 999,
                    border: '1px solid rgba(148,163,184,0.18)',
                    background: 'rgba(247,249,252,0.94)',
                    padding: '0 20px',
                    fontWeight: 700,
                    color: '#37445d',
                    cursor: 'pointer',
                    boxShadow: '0 10px 22px rgba(15,23,42,0.05)',
                  }}
                >
                  ＋ Journal Entry
                </button>

                <Link
                  href="/accounts"
                  style={{
                    height: 46,
                    borderRadius: 999,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '0 24px',
                    background:
                      'linear-gradient(135deg, #4cc36a 0%, #2fa853 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    boxShadow: '0 12px 28px rgba(47,168,83,0.28)',
                  }}
                >
                  ⛁ Fund Accounts
                </Link>

                <TopRoundButton label="⚙" title="Settings" />
                <TopRoundButton
                  label="↻"
                  title="Refresh dashboard"
                  onClick={() => window.location.reload()}
                />
                <TopRoundButton label="🔔" title="Notifications" />
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
                    gridTemplateColumns: 'minmax(0, 1.75fr) minmax(340px, 1.1fr)',
                    gap: 14,
                    padding: 16,
                    marginBottom: 22,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      borderRadius: 22,
                      padding: 24,
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
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
                              width: 30,
                              height: 30,
                              borderRadius: 999,
                              display: 'grid',
                              placeItems: 'center',
                              color: '#fff',
                              fontWeight: 900,
                              fontSize: 14,
                              flexShrink: 0,
                              ...getMissionDotStyle(item.priority),
                            }}
                          >
                            {item.index}
                          </div>

                          <div
                            style={{
                              fontSize: 17,
                              fontWeight: 600,
                              lineHeight: 1.35,
                              letterSpacing: 0.1,
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
                        marginTop: 28,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: 10,
                          alignItems: 'center',
                          color: '#9aa8c5',
                          fontSize: 14,
                        }}
                      >
                        <span>◌</span>
                        <span>→</span>
                        <span style={{ color: '#dbe5ff' }}>●</span>
                        <span>○</span>
                        <span>○</span>
                        <span>○</span>
                      </div>

                      <Link
                        href="/calendar"
                        style={{
                          borderRadius: 999,
                          padding: '14px 28px',
                          textDecoration: 'none',
                          color: '#eff6ff',
                          fontWeight: 800,
                          background:
                            'linear-gradient(135deg, rgba(96, 125, 255, 0.96), rgba(82, 107, 216, 0.96))',
                          boxShadow: '0 12px 22px rgba(82,107,216,0.26)',
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
                    <FleetMetricCard
                      title="FLEET POWER"
                      value={formatLives(state.stats?.totalLives)}
                      valueColor="#24459e"
                    />
                    <FleetMetricCard
                      title="ACCOUNTS"
                      value={formatNumber(state.stats?.accountCount)}
                      valueColor="#111827"
                    />
                    <FleetMetricCard
                      title="ACCOUNTS"
                      value={formatNumber(state.stats?.accountCount)}
                      valueColor="#111827"
                    />
                    <FleetMetricCard
                      title="TRADABLE"
                      value={formatNumber(state.stats?.tradableCount)}
                      valueColor="#6b35a5"
                    />
                  </div>
                </section>

                <section
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)',
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
                          color: '#15233f',
                          fontWeight: 900,
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
                          color: '#15233f',
                          background: '#dbe4f0',
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
                                  ? 'linear-gradient(180deg, rgba(255,247,237,0.98), rgba(255,251,235,0.98))'
                                  : 'linear-gradient(180deg, rgba(254,242,242,0.98), rgba(255,245,247,0.98))',
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
                                  background: index === 0 ? '#f0b63f' : '#ee7a55',
                                  flexShrink: 0,
                                }}
                              >
                                {index + 1}
                              </div>

                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div
                                  style={{
                                    fontSize: 17,
                                    fontWeight: 900,
                                    color: '#111827',
                                    lineHeight: 1.35,
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
                                  <span>{alert.label ?? alert.accountId ?? 'Fleet context'}</span>
                                  <span
                                    style={{
                                      borderRadius: 999,
                                      padding: '4px 8px',
                                      fontSize: 12,
                                      fontWeight: 700,
                                      textTransform: 'capitalize',
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
                      ...whiteCardStyle(),
                      padding: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        ...sectionCardStyle(),
                        borderRadius: 22,
                        padding: 18,
                        boxShadow: 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: 10,
                          flexWrap: 'wrap',
                          marginBottom: 14,
                        }}
                      >
                        {['ALL', 'WARNING', 'ATTENTION', 'PAGAL', 'COMPLETE'].map((tab, index) => (
                          <div
                            key={tab}
                            style={{
                              borderRadius: 999,
                              padding: '8px 14px',
                              fontSize: 12,
                              fontWeight: 900,
                              color:
                                index === 2
                                  ? '#fff6e6'
                                  : index === 3
                                    ? '#efffed'
                                    : '#cad5ea',
                              background:
                                index === 2
                                  ? 'rgba(245,158,11,0.8)'
                                  : index === 3
                                    ? 'rgba(84,193,113,0.86)'
                                    : 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            {tab}
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 18,
                          padding: 14,
                          color: '#f8fafc',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 12,
                            alignItems: 'center',
                            marginBottom: 12,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 900, fontSize: 25 }}>18.00</div>
                            <div style={{ color: '#cbd5e1', fontSize: 13 }}>Today</div>
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              borderRadius: 999,
                              padding: '6px 10px',
                              background: 'rgba(251,113,133,0.2)',
                              color: '#ffd0d9',
                            }}
                          >
                            SAFE?
                          </div>
                        </div>

                        <div
                          style={{
                            height: 8,
                            borderRadius: 999,
                            background: 'rgba(255,255,255,0.08)',
                            overflow: 'hidden',
                            display: 'flex',
                            marginBottom: 16,
                          }}
                        >
                          <div style={{ width: '30%', background: '#8bd0ff' }} />
                          <div style={{ width: '24%', background: '#8ee3a4' }} />
                          <div style={{ width: '20%', background: '#f5c84b' }} />
                          <div style={{ width: '26%', background: '#f59cae' }} />
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: 10,
                            flexWrap: 'wrap',
                          }}
                        >
                          <Link
                            href="/calendar"
                            style={{
                              borderRadius: 16,
                              padding: '14px 18px',
                              textDecoration: 'none',
                              background: 'rgba(255,255,255,0.07)',
                              color: '#f8fafc',
                              fontWeight: 700,
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            ✣ + 1 Day
                          </Link>

                          <Link
                            href="/calendar"
                            style={{
                              borderRadius: 16,
                              padding: '14px 18px',
                              textDecoration: 'none',
                              background: 'rgba(255,255,255,0.12)',
                              color: '#f8fafc',
                              fontWeight: 900,
                              border: '1px solid rgba(255,255,255,0.10)',
                            }}
                          >
                            Start Rotation
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2
                    style={{
                      margin: '0 0 14px',
                      fontSize: 22,
                      color: '#15233f',
                      fontWeight: 900,
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
                    {topAccounts.map((account, index) => {
                      const pill = getStatusPill(account, alerts);
                      const accent =
                        index === 0 ? '#4f8cff' : index === 1 ? '#4cbf7a' : '#7a5ce8';

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
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                              }}
                            >
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 999,
                                  background: `${accent}20`,
                                  color: accent,
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontWeight: 900,
                                }}
                              >
                                {index === 0 ? '◈' : index === 1 ? '↑' : '◫'}
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: '#7a8aa3',
                                    fontWeight: 800,
                                    marginBottom: 6,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.6,
                                  }}
                                >
                                  {account.stage ?? 'Account'}
                                </div>
                                <div
                                  style={{
                                    fontSize: 18,
                                    fontWeight: 900,
                                    lineHeight: 1.2,
                                    color: '#111827',
                                  }}
                                >
                                  {account.label}
                                </div>
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
                              fontSize: 17,
                              color: '#1f2937',
                              marginBottom: 8,
                              fontWeight: 900,
                            }}
                          >
                            {formatLives(
                              state.stats
                                ? state.stats.totalLives / Math.max(state.stats.accountCount, 1)
                                : null,
                            )}
                          </div>

                          <div
                            style={{
                              fontSize: 15,
                              color: '#334155',
                              lineHeight: 1.5,
                              marginBottom: 14,
                              fontWeight: 600,
                            }}
                          >
                            Balance {formatCurrency(account.balance)}
                          </div>

                          <div
                            style={{
                              fontSize: 14,
                              color: '#64748b',
                              lineHeight: 1.5,
                              marginBottom: 14,
                            }}
                          >
                            High-water {formatCurrency(account.highWaterMark)}
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
        </div>
      </div>
    </main>
  );
}
