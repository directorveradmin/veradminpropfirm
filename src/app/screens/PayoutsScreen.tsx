'use client';
import React, { useState, useTransition } from 'react';
import DetailDrawer from '../components/DetailDrawer';
import FilterPanel from '../components/FilterPanel';
import type { PayoutsScreenVM, PayoutRow } from '../../lib/view-models';

const statusColor: Record<string, string> = {
    planned: '#6366f1', requested: '#3b82f6', processing: '#f59e0b',
    paid: '#16a34a', rejected: '#dc2626', cancelled: '#6b7280',
};

const filterFields = [
    { key: 'status', label: 'Status', options: ['planned', 'requested', 'processing', 'paid', 'rejected', 'cancelled'] },
    { key: 'accountId', label: 'Account ID' },
];

interface Props { data?: PayoutsScreenVM; }

const PayoutsScreen: React.FC<Props> = ({ data: initialData }) => {
    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [isPending, startTransition] = useTransition();
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestForm, setRequestForm] = useState({ accountId: '', amountDollars: '', notes: '' });
    const [formError, setFormError] = useState('');

    const refresh = async () => {
        const res = await fetch('/api/read-models/payouts');
        if (res.ok) setData(await res.json());
    };

    const handleAction = async (id: string, action: string) => {
        await fetch('/api/payouts/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action }),
        });
        startTransition(() => { refresh(); });
        setSelectedItem(null);
    };

    const handleRequestPayout = async () => {
        setFormError('');
        const amount = Math.round(parseFloat(requestForm.amountDollars) * 100);
        if (!requestForm.accountId || isNaN(amount) || amount <= 0) {
            setFormError('Account ID and a valid amount are required.');
            return;
        }
        const res = await fetch('/api/payouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountId: requestForm.accountId, amountRequestedCents: amount, notes: requestForm.notes }),
        });
        if (res.ok) {
            setShowRequestForm(false);
            setRequestForm({ accountId: '', amountDollars: '', notes: '' });
            startTransition(() => { refresh(); });
        } else {
            setFormError('Failed to submit payout request.');
        }
    };

    const applyFilters = (payouts: PayoutRow[]) => payouts.filter(p => {
        if (filters.status && p.status !== filters.status) return false;
        if (filters.accountId && !p.accountId.includes(filters.accountId)) return false;
        return true;
    });

    if (!data) return <div>Loading...</div>;
    const openFiltered = applyFilters(data.openPayouts);
    const completedFiltered = applyFilters(data.completedPayouts);

    return (
        <div className="PayoutsScreen" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h1 style={{ margin: 0 }}>{data.title}</h1>
                <button onClick={() => setShowRequestForm(v => !v)}
                    aria-expanded={showRequestForm}
                    style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600 }}>
                    + Request Payout
                </button>
            </div>

            {showRequestForm && (
                <div role="form" aria-label="Request payout form"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem' }}>New Payout Request</h3>
                    {formError && <div role="alert" style={{ color: '#dc2626', fontSize: '0.85rem' }}>{formError}</div>}
                    <label style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        Account ID *
                        <input value={requestForm.accountId}
                            onChange={e => setRequestForm(f => ({ ...f, accountId: e.target.value }))}
                            style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            aria-required="true" />
                    </label>
                    <label style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        Amount (USD) *
                        <input type="number" min="0" step="0.01" value={requestForm.amountDollars}
                            onChange={e => setRequestForm(f => ({ ...f, amountDollars: e.target.value }))}
                            style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            aria-required="true" />
                    </label>
                    <label style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        Notes
                        <textarea value={requestForm.notes}
                            onChange={e => setRequestForm(f => ({ ...f, notes: e.target.value }))}
                            rows={2}
                            style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', resize: 'vertical' }} />
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={handleRequestPayout}
                            style={{ padding: '0.4rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                            Submit
                        </button>
                        <button onClick={() => { setShowRequestForm(false); setFormError(''); }}
                            style={{ padding: '0.4rem 1rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '0.25rem', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                <div><strong>Total Requested:</strong> ${(data.totalRequestedCents / 100).toFixed(2)}</div>
                <div><strong>Total Received:</strong> ${(data.totalReceivedCents / 100).toFixed(2)}</div>
                {isPending && <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Updating...</span>}
            </div>

            <FilterPanel filters={filters} onChange={setFilters} fields={filterFields} />

            <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Open Payouts</h2>
            {openFiltered.length === 0 && <p style={{ color: '#6b7280' }}>No open payouts match your filters.</p>}
            {openFiltered.map(p => {
                const color = statusColor[p.status] ?? '#6b7280';
                return (
                    <div key={p.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ cursor: 'pointer', flex: 1 }}
                                role="button" tabIndex={0} aria-label={'Payout for ' + p.accountId}
                                onClick={() => setSelectedItem(p)}
                                onKeyDown={e => { if (e.key === 'Enter') setSelectedItem(p); }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>${(p.amountRequestedCents / 100).toFixed(2)}</strong>
                                    <span style={{ color, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>{p.status}</span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    Account: {p.accountId} &middot; Requested: {p.requestedAt.slice(0, 10)}
                                </div>
                                {p.expectedArrivalAt && (
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Expected: {p.expectedArrivalAt.slice(0, 10)}</div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', flexShrink: 0 }}>
                                <button onClick={() => handleAction(p.id, 'mark_received')}
                                    aria-label={'Mark received: ' + p.id}
                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '0.25rem', border: '1px solid #16a34a', background: '#f0fdf4', color: '#16a34a', cursor: 'pointer' }}>
                                    Mark Received
                                </button>
                                <button onClick={() => handleAction(p.id, 'cancel')}
                                    aria-label={'Cancel payout: ' + p.id}
                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', color: '#dc2626' }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            {completedFiltered.length > 0 && (
                <>
                    <h2 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>Completed</h2>
                    {completedFiltered.map(p => (
                        <div key={p.id}
                            role="button" tabIndex={0} aria-label={'Completed payout: ' + p.id}
                            onClick={() => setSelectedItem(p)}
                            onKeyDown={e => { if (e.key === 'Enter') setSelectedItem(p); }}
                            style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.5rem', cursor: 'pointer', opacity: 0.6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>${(p.amountRequestedCents / 100).toFixed(2)}</strong>
                                <span style={{ fontSize: '0.75rem', color: statusColor[p.status] ?? '#6b7280', textTransform: 'uppercase' }}>{p.status}</span>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Account: {p.accountId}</div>
                        </div>
                    ))}
                </>
            )}
            <DetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    );
};
export default PayoutsScreen;
