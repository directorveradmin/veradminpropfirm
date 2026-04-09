'use client';
import React, { useEffect, useRef } from 'react';
import { screens } from '../navigationMap';

interface DetailDrawerProps {
    item: any;
    onClose: () => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ item, onClose }) => {
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (item) closeRef.current?.focus();
    }, [item]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!item) return null;

    const links: { label: string; href: string }[] = [];
    if (item.accountId) {
        links.push({ label: 'View Account', href: screens.Accounts + '?accountId=' + item.accountId });
    }
    if (item.id?.startsWith('payout_') || item.status === 'planned' || item.status === 'processing') {
        links.push({ label: 'View Payouts', href: screens.Payouts });
    }
    if (item.type === 'payout_window_near' || item.type === 'consistency_watch') {
        links.push({ label: 'View Alerts', href: screens.Alerts });
    }
    if (item.rotationType) {
        links.push({ label: 'View Calendar', href: screens.CalendarRotation });
    }

    return (
        <div role="dialog" aria-modal="true" aria-label="Item details"
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.3)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ width: '420px', maxWidth: '100vw', background: 'white', height: '100vh', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)', overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Details</h2>
                    <button ref={closeRef} onClick={onClose} aria-label="Close drawer"
                        style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>
                        x
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {Object.entries(item).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                            <span style={{ color: '#94a3b8', minWidth: '140px', fontWeight: 500 }}>{k}</span>
                            <span style={{ color: '#1e293b', wordBreak: 'break-all' }}>{String(v ?? '—')}</span>
                        </div>
                    ))}
                </div>

                {links.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Navigate to</div>
                        {links.map(l => (
                            <a key={l.href} href={l.href}
                                style={{ padding: '0.5rem 0.75rem', background: '#f1f5f9', borderRadius: '0.375rem', fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                                {l.label} &rarr;
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailDrawer;
