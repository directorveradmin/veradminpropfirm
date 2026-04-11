'use client';

import type { ReactElement } from 'react';
import { getReportsScreenVM } from '@/lib/services/reporting';

export default function ReportsScreen(): ReactElement {
  const vm = getReportsScreenVM();

  return (
    <main style={{ padding: 24, display: 'grid', gap: 20 }}>
      <header style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>{vm.title}</h1>
          <span style={{ fontSize: 12, padding: '4px 8px', border: '1px solid #d0d7de', borderRadius: 999 }}>
            {vm.timeRangeLabel}
          </span>
          <span style={{ fontSize: 12, padding: '4px 8px', border: '1px solid #d0d7de', borderRadius: 999 }}>
            {vm.scopeLabel}
          </span>
        </div>
        <p style={{ margin: 0, color: '#57606a' }}>{vm.mission}</p>
        {vm.statusMessage ? (
          <div style={{ border: '1px solid #d0d7de', borderRadius: 12, padding: 12, background: '#f6f8fa' }}>
            {vm.statusMessage}
          </div>
        ) : null}
      </header>

      <section>
        <h2 style={{ marginTop: 0 }}>Fleet snapshot</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {vm.snapshotCards.map((card) => (
            <article key={card.label} style={{ border: '1px solid #d0d7de', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, color: '#57606a' }}>{card.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{card.value}</div>
              {card.helpText ? <div style={{ fontSize: 12, color: '#57606a' }}>{card.helpText}</div> : null}
            </article>
          ))}
        </div>
      </section>

      {[vm.tacticalReview, vm.businessReview, vm.accountReview].map((section) => (
        <section key={section.title} style={{ border: '1px solid #d0d7de', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>{section.title}</h2>
          <p style={{ marginTop: 0, color: '#57606a' }}>{section.subtitle}</p>
          <div style={{ display: 'grid', gap: 10 }}>
            {section.rows.map((row) => (
              <article key={row.label} style={{ borderTop: '1px solid #d8dee4', paddingTop: 10 }}>
                <div style={{ fontWeight: 600 }}>{row.label}</div>
                <div>{row.value}</div>
                {row.note ? <div style={{ color: '#57606a', fontSize: 13 }}>{row.note}</div> : null}
              </article>
            ))}
          </div>
        </section>
      ))}

      <section style={{ border: '1px solid #d0d7de', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Export options</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {vm.exportOptions.map((option) => (
            <article key={option.label}>
              <div style={{ fontWeight: 600 }}>{option.label}</div>
              <div style={{ color: '#57606a' }}>{option.description}</div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ border: '1px solid #d0d7de', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Recent generated reviews</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {vm.recentExports.map((row) => (
            <article key={row.label}>
              <div style={{ fontWeight: 600 }}>{row.label}</div>
              <div>{row.value}</div>
              {row.note ? <div style={{ color: '#57606a' }}>{row.note}</div> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}