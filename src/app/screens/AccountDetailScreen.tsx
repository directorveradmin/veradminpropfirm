'use client';
import React, { useState } from 'react';
import FilterPanel from '../components/FilterPanel';
import DetailDrawer from '../components/DetailDrawer';
import { screens } from '../navigationMap';
import type { AccountDetailScreenListVM, AccountRow } from '../../lib/view-models';

const statusColor: Record<string, string> = {
    active: '#16a34a', paused: '#f59e0b', stopped: '#6b7280', breached: '#dc2626', archived: '#9ca3af',
};

const filterFields = [
    { key: 'accountStatus', label: 'Status', options: ['active', 'paused', 'stopped', 'breached', 'archived'] },
    { key: 'lifecycleStage', label: 'Stage', options: ['evaluation_step1', 'evaluation_step2', 'funded_active', 'funded_payout_active', 'paused_inactive', 'breached_failed', 'retired_archived'] },
    { key: 'accountLabel', label: 'Label' },
];

interface Props { data?: AccountDetailScreenListVM; }

const AccountDetailScreen: React.FC<Props> = ({ data }) => {
    const [selectedItem, setSelectedItem] = useState<AccountRow | null>(null);
    const [filters, setFilters] = useState<Record<string, string>>({});

    if (!data) return <div>Loading...</div>;

    const filtered = data.accounts.filter(a => {
        if (filters.accountStatus && a.accountStatus !== filters.accountStatus) return false;
        if (filters.lifecycleStage && a.lifecycleStage !== filters.lifecycleStage) return false;
        if (filters.accountLabel && !a.accountLabel.toLowerCase().includes(filters.accountLabel.toLowerCase())) return false;
        return true;
    });

    const fleetBalance = (data.totalCurrentBalanceCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

    return (
        <div className="AccountDetailScreen" style={{ padding: '1rem' }}>
            <h1>{data.title}</h1>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div><strong>Total:</strong> {data.totalAccounts}</div>
                <div><strong>Active:</strong> <span style={{ color: '#16a34a' }}>{data.activeCount}</span></div>
                <div><strong>Breached:</strong> <span style={{ color: '#dc2626' }}>{data.breachedCount}</span></div>
                <div><strong>Fleet Balance:</strong> ${fleetBalance}</div>
            </div>
            <FilterPanel filters={filters} onChange={setFilters} fields={filterFields} />
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }} role="grid" aria-label="Accounts list">
                <thead>
                    <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Label</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Stage</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Status</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }} scope="col">Balance</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }} scope="col">Peak</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Last Payout</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }} scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(a => {
                        const color = statusColor[a.accountStatus] ?? '#6b7280';
                        return (
                            <tr key={a.id}
                                style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                                tabIndex={0} role="row" aria-label={'Account ' + a.accountLabel}
                                onClick={() => setSelectedItem(a)}
                                onKeyDown={e => { if (e.key === 'Enter') setSelectedItem(a); }}>
                                <td style={{ padding: '0.5rem', fontWeight: 600 }}>{a.accountLabel}</td>
                                <td style={{ padding: '0.5rem', fontSize: '0.75rem' }}>{a.lifecycleStage}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <span style={{ color, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>{a.accountStatus}</span>
                                </td>
                                <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                                    ${(a.currentBalanceCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                                    ${(a.peakBalanceCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ padding: '0.5rem', fontSize: '0.75rem' }}>{a.lastPayoutDate ?? '—'}</td>
                                <td style={{ padding: '0.5rem' }} onClick={e => e.stopPropagation()}>
                                    <a href={screens.Alerts + '?accountId=' + a.id}
                                        style={{ fontSize: '0.75rem', color: '#2563eb', marginRight: '0.75rem' }}
                                        aria-label={'Alerts for ' + a.accountLabel}>
                                        Alerts
                                    </a>
                                    <a href={screens.Payouts + '?accountId=' + a.id}
                                        style={{ fontSize: '0.75rem', color: '#2563eb' }}
                                        aria-label={'Payouts for ' + a.accountLabel}>
                                        Payouts
                                    </a>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <DetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    );
};
export default AccountDetailScreen;
