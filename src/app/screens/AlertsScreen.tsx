'use client';
import React, { useState, useTransition } from 'react';
import DetailDrawer from '../components/DetailDrawer';
import FilterPanel from '../components/FilterPanel';
import type { AlertsScreenVM, AlertRow } from '../../lib/view-models';

const severityColor: Record<string, string> = {
    critical: '#dc2626', high: '#ea580c', medium: '#ca8a04', low: '#16a34a', resolved: '#6b7280',
};

const filterFields = [
    { key: 'severity', label: 'Severity', options: ['critical', 'high', 'medium', 'low'] },
    { key: 'type', label: 'Type' },
];

interface Props { data?: AlertsScreenVM; }

const AlertsScreen: React.FC<Props> = ({ data: initialData }) => {
    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [isPending, startTransition] = useTransition();

    const refresh = async () => {
        const res = await fetch('/api/read-models/alerts');
        if (res.ok) setData(await res.json());
    };

    const handleAction = async (id: string, action: 'acknowledge' | 'resolve') => {
        await fetch('/api/alerts/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action }),
        });
        startTransition(() => { refresh(); });
        setSelectedItem(null);
    };

    const applyFilters = (alerts: AlertRow[]) => alerts.filter(a => {
        if (filters.severity && a.severity !== filters.severity) return false;
        if (filters.type && !a.type.includes(filters.type)) return false;
        return true;
    });

    if (!data) return <div>Loading...</div>;
    const activeFiltered = applyFilters(data.activeAlerts);
    const dismissedFiltered = applyFilters(data.dismissedAlerts);

    return (
        <div className="AlertsScreen" style={{ padding: '1rem' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>{data.title}</h1>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                <div><strong>Active:</strong> {data.totalActive}</div>
                <div><strong>Critical:</strong> <span style={{ color: '#dc2626' }}>{data.criticalCount}</span></div>
                {isPending && <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Updating...</span>}
            </div>
            <FilterPanel filters={filters} onChange={setFilters} fields={filterFields} />
            <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Active Alerts</h2>
            {activeFiltered.length === 0 && <p style={{ color: '#6b7280' }}>No alerts match your filters.</p>}
            {activeFiltered.map(a => {
                const borderColor = severityColor[a.severity] ?? '#ccc';
                return (
                    <div key={a.id}
                        style={{ border: '2px solid ' + borderColor, borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ cursor: 'pointer', flex: 1 }}
                                role="button" tabIndex={0} aria-label={'Alert: ' + a.title}
                                onClick={() => setSelectedItem(a)}
                                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedItem(a); }}>
                                <strong>{a.title}</strong>
                                <span style={{ marginLeft: '0.75rem', color: borderColor, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>{a.severity}</span>
                                <div style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.25rem' }}>{a.message}</div>
                                {a.accountId && <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Account: {a.accountId}</div>}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginLeft: '1rem' }}>
                                <button onClick={() => handleAction(a.id, 'acknowledge')}
                                    aria-label={'Acknowledge: ' + a.title}
                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>
                                    Ack
                                </button>
                                <button onClick={() => handleAction(a.id, 'resolve')}
                                    aria-label={'Resolve: ' + a.title}
                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '0.25rem', border: '1px solid #16a34a', background: '#f0fdf4', color: '#16a34a', cursor: 'pointer' }}>
                                    Resolve
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            {dismissedFiltered.length > 0 && (
                <>
                    <h2 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>Dismissed / Resolved</h2>
                    {dismissedFiltered.map(a => (
                        <div key={a.id}
                            role="button" tabIndex={0} aria-label={'Resolved alert: ' + a.title}
                            onClick={() => setSelectedItem(a)}
                            onKeyDown={e => { if (e.key === 'Enter') setSelectedItem(a); }}
                            style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.5rem', cursor: 'pointer', opacity: 0.6 }}>
                            <strong>{a.title}</strong>
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>{a.status}</span>
                        </div>
                    ))}
                </>
            )}
            <DetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    );
};
export default AlertsScreen;
