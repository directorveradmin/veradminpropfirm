'use client';
import React, { useState } from 'react';
import FilterPanel from '../components/FilterPanel';
import DetailDrawer from '../components/DetailDrawer';
import type { JournalScreenVM } from '../../lib/view-models';

const filterFields = [
    { key: 'resultType', label: 'Result', options: ['win', 'loss', 'custom'] },
    { key: 'session', label: 'Session', options: ['asia', 'london', 'new_york', 'custom'] },
    { key: 'direction', label: 'Direction', options: ['long', 'short', 'both', 'n_a'] },
];

interface Props { data?: JournalScreenVM; }

const JournalScreen: React.FC<Props> = ({ data }) => {
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [filters, setFilters] = useState<Record<string, string>>({});
    if (!data) return <div>Loading...</div>;

    const filtered = data.trades.filter(t => {
        if (filters.resultType && t.resultType !== filters.resultType) return false;
        if (filters.session && t.session !== filters.session) return false;
        if (filters.direction && t.direction !== filters.direction) return false;
        return true;
    });

    const filteredPnl = filtered.reduce((s, t) => s + t.pnlAmountCents, 0);
    const pnlColor = filteredPnl >= 0 ? 'green' : 'red';

    return (
        <div className="JournalScreen" style={{ padding: '1rem' }}>
            <h1>{data.title}</h1>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                <div><strong>Showing:</strong> {filtered.length} of {data.totalTrades} trades</div>
                <div><strong>P&amp;L:</strong> <span style={{ color: pnlColor }}>${(filteredPnl / 100).toFixed(2)}</span></div>
            </div>
            <FilterPanel filters={filters} onChange={setFilters} fields={filterFields} />
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }} role="grid" aria-label="Trade journal">
                <thead>
                    <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Date</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Account</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Session</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Direction</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Result</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }} scope="col">P&amp;L</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Note</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(t => {
                        const acct = data.accounts.find(a => a.id === t.accountId);
                        const color = t.pnlAmountCents >= 0 ? 'green' : 'red';
                        return (
                            <tr key={t.id}
                                style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                                tabIndex={0} role="row" aria-label={'Trade on ' + t.tradeDate}
                                onClick={() => setSelectedItem(t)}
                                onKeyDown={e => { if (e.key === 'Enter') setSelectedItem(t); }}>
                                <td style={{ padding: '0.5rem' }}>{t.tradeDate}</td>
                                <td style={{ padding: '0.5rem' }}>{acct?.accountLabel ?? t.accountId}</td>
                                <td style={{ padding: '0.5rem' }}>{t.session}</td>
                                <td style={{ padding: '0.5rem' }}>{t.direction}</td>
                                <td style={{ padding: '0.5rem' }}>{t.resultType}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'right', color }}>
                                    ${(t.pnlAmountCents / 100).toFixed(2)}
                                </td>
                                <td style={{ padding: '0.5rem' }}>{t.note ?? '—'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <DetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    );
};
export default JournalScreen;
