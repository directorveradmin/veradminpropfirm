'use client';
import React, { useState } from 'react';
import DetailDrawer from '../components/DetailDrawer';
import type { CalendarRotationScreenVM } from '../../lib/view-models';

const impactColor: Record<string, string> = {
    red: '#dc2626', orange: '#ea580c', yellow: '#ca8a04',
};

interface Props { data?: CalendarRotationScreenVM; }

const CalendarRotationScreen: React.FC<Props> = ({ data }) => {
    const [selectedItem, setSelectedItem] = useState<any>(null);
    if (!data) return <div>Loading...</div>;
    return (
        <div className="CalendarRotationScreen" style={{ padding: '1rem' }}>
            <h1>{data.title}</h1>
            <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Upcoming News Events</h2>
            {data.upcomingNews.length === 0 && <p style={{ color: '#6b7280' }}>No upcoming news events.</p>}
            {data.upcomingNews.map(n => {
                const color = impactColor[n.impactLevel] ?? '#6b7280';
                return (
                    <div key={n.id}
                        role="button" tabIndex={0} aria-label={'News event: ' + n.title}
                        onClick={() => setSelectedItem(n)}
                        onKeyDown={e => { if (e.key === 'Enter') setSelectedItem(n); }}
                        style={{ border: '2px solid ' + color, borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{n.title}</strong>
                            <span style={{ color, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>{n.impactLevel}</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {n.eventTimestamp.slice(0, 16).replace('T', ' ')} &middot; {n.assetScope}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            Lock: -{n.lockMinutesBefore}m / +{n.lockMinutesAfter}m
                        </div>
                    </div>
                );
            })}
            <h2 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>Planned Rotations</h2>
            {data.upcomingRotations.length === 0 && <p style={{ color: '#6b7280' }}>No planned rotations.</p>}
            {data.upcomingRotations.map(r => (
                <div key={r.id}
                    role="button" tabIndex={0} aria-label={'Rotation: ' + r.rotationType}
                    onClick={() => setSelectedItem(r)}
                    onKeyDown={e => { if (e.key === 'Enter') setSelectedItem(r); }}
                    style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                    <strong>{r.rotationType}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {r.windowStart.slice(0, 10)} to {r.windowEnd.slice(0, 10)}
                    </div>
                    {r.reason && <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{r.reason}</div>}
                </div>
            ))}
            <DetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    );
};
export default CalendarRotationScreen;
