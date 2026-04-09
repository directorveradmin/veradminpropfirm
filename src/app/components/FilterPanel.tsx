'use client';
import React from 'react';

interface FilterField {
    key: string;
    label: string;
    options?: string[];
}

interface FilterPanelProps {
    filters: Record<string, string>;
    onChange: (filters: Record<string, string>) => void;
    fields?: FilterField[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, fields = [] }) => {
    if (fields.length === 0) return null;
    return (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
            role="search" aria-label="Filter options">
            {fields.map(f => (
                <label key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: '#475569' }}>
                    {f.label}
                    {f.options ? (
                        <select
                            value={filters[f.key] ?? ''}
                            onChange={e => onChange({ ...filters, [f.key]: e.target.value })}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            aria-label={f.label}
                        >
                            <option value="">All</option>
                            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={filters[f.key] ?? ''}
                            onChange={e => onChange({ ...filters, [f.key]: e.target.value })}
                            placeholder={'Filter ' + f.label + '...'}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            aria-label={f.label}
                        />
                    )}
                </label>
            ))}
            {Object.values(filters).some(v => v) && (
                <button
                    onClick={() => onChange({})}
                    style={{ alignSelf: 'flex-end', padding: '0.3rem 0.75rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', fontSize: '0.8rem' }}
                    aria-label="Clear all filters"
                >
                    Clear
                </button>
            )}
        </div>
    );
};

export default FilterPanel;
