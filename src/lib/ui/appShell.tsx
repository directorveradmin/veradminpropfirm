'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const navGroups = [
  {
    title: 'Core',
    items: [
      { href: '/', label: 'Home' },
      { href: '/accounts', label: 'Accounts' },
      { href: '/journal', label: 'Journal' },
      { href: '/alerts', label: 'Alerts' },
      { href: '/payouts', label: 'Payouts' },
      { href: '/calendar', label: 'Calendar' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { href: '/settings', label: 'Settings' },
      { href: '/backups', label: 'Backups' },
    ],
  },
  {
    title: 'Review',
    items: [
      { href: '/reports', label: 'Reports' },
      { href: '/simulation', label: 'Simulation' },
    ],
  },
];

function active(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          borderBottom: '1px solid rgba(69, 88, 122, 0.45)',
          background: 'rgba(7, 12, 24, 0.82)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ maxWidth: 1360, margin: '0 auto', padding: '18px 24px 16px', display: 'grid', gap: 14 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>Veradmin</div>
              <div
                style={{
                  padding: '6px 10px',
                  borderRadius: 999,
                  border: '1px solid rgba(71, 94, 132, 0.45)',
                  color: '#9fb3c8',
                  fontSize: 12,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Local-first tactical operating system
              </div>
            </div>
            <div style={{ color: '#9fb3c8', fontSize: 15 }}>
              Tactical control, continuity, reflective reporting, and deterministic simulation.
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {navGroups.map((group) => (
              <div key={group.title} style={{ display: 'grid', gap: 8 }}>
                <div style={{ color: '#7f94ae', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {group.title}
                </div>
                <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {group.items.map((item) => {
                    const isActive = active(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        style={{
                          padding: '9px 14px',
                          borderRadius: 999,
                          border: isActive
                            ? '1px solid rgba(81, 161, 255, 0.65)'
                            : '1px solid rgba(71, 94, 132, 0.45)',
                          background: isActive ? 'rgba(31, 111, 235, 0.22)' : 'rgba(17, 24, 39, 0.75)',
                          color: isActive ? '#ffffff' : '#d8e3ef',
                          textDecoration: 'none',
                          fontSize: 14,
                          fontWeight: isActive ? 700 : 500,
                        }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '24px 24px 48px' }}>{children}</div>
    </div>
  );
}