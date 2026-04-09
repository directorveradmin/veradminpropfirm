import type { Metadata } from 'next';
import './globals.css';
import { NavLink } from './components/NavLink';

export const metadata: Metadata = {
    title: 'Veradmin',
    description: 'Prop firm admin scaffold',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', display: 'flex', minHeight: '100vh' }}>
                <nav style={{
                    width: '200px', minHeight: '100vh', background: '#1e293b',
                    color: '#f1f5f9', padding: '1.5rem 1rem', flexShrink: 0,
                    display: 'flex', flexDirection: 'column', gap: '0.25rem',
                }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: '#38bdf8' }}>
                        Veradmin
                    </div>
                    <NavLink href="/screens/AccountDetailScreen" label="Accounts" icon="🏦" />
                    <NavLink href="/screens/JournalScreen" label="Journal" icon="📓" />
                    <NavLink href="/screens/PayoutsScreen" label="Payouts" icon="💸" />
                    <NavLink href="/screens/AlertsScreen" label="Alerts" icon="🔔" />
                    <NavLink href="/screens/CalendarRotationScreen" label="Calendar" icon="📅" />
                </nav>
                <main style={{ flex: 1, overflowY: 'auto' }}>
                    {children}
                </main>
            </body>
        </html>
    );
}
