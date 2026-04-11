import Link from 'next/link';
import type { ReactNode } from 'react';

export function Surface({
  title,
  subtitle,
  eyebrow,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <section
        style={{
          display: 'grid',
          gap: 12,
          padding: 24,
          borderRadius: 24,
          border: '1px solid rgba(71, 94, 132, 0.4)',
          background:
            'linear-gradient(180deg, rgba(16,25,43,0.92) 0%, rgba(10,17,31,0.96) 100%)',
          boxShadow: '0 20px 45px rgba(0,0,0,0.2)',
        }}
      >
        {eyebrow ? (
          <div
            style={{
              display: 'inline-flex',
              width: 'fit-content',
              padding: '6px 10px',
              borderRadius: 999,
              border: '1px solid rgba(71, 94, 132, 0.45)',
              color: '#9fb3c8',
              fontSize: 12,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'grid', gap: 8, maxWidth: 820 }}>
            <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.06, letterSpacing: '-0.03em' }}>{title}</h1>
            {subtitle ? <p style={{ margin: 0, color: '#9fb3c8', fontSize: 17, lineHeight: 1.5 }}>{subtitle}</p> : null}
          </div>
          {actions ? <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div> : null}
        </div>
      </section>

      {children}
    </main>
  );
}

export function StatCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note?: string;
}) {
  return (
    <article
      style={{
        display: 'grid',
        gap: 8,
        padding: 18,
        borderRadius: 18,
        border: '1px solid rgba(71, 94, 132, 0.4)',
        background: 'rgba(16, 24, 40, 0.82)',
      }}
    >
      <div style={{ color: '#8ea4bf', fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>{value}</div>
      {note ? <div style={{ color: '#9fb3c8', fontSize: 13, lineHeight: 1.4 }}>{note}</div> : null}
    </article>
  );
}

export function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        display: 'grid',
        gap: 14,
        padding: 20,
        borderRadius: 20,
        border: '1px solid rgba(71, 94, 132, 0.4)',
        background: 'rgba(12, 20, 34, 0.84)',
      }}
    >
      <div style={{ display: 'grid', gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>{title}</h2>
        {subtitle ? <p style={{ margin: 0, color: '#9fb3c8', lineHeight: 1.45 }}>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function ActionLink({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 14px',
        borderRadius: 12,
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: 14,
        border: primary
          ? '1px solid rgba(81, 161, 255, 0.7)'
          : '1px solid rgba(71, 94, 132, 0.45)',
        background: primary
          ? 'linear-gradient(180deg, rgba(31,111,235,0.95) 0%, rgba(29,78,216,0.95) 100%)'
          : 'rgba(17, 24, 39, 0.75)',
        color: '#ffffff',
      }}
    >
      {label}
    </Link>
  );
}