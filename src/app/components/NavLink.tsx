'use client';
import React from 'react';

export function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
    return (
        <a href={href} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
            color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem',
        }}
            onMouseOver={e => (e.currentTarget.style.background = '#334155')}
            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
        >
            <span>{icon}</span>{label}
        </a>
    );
}
