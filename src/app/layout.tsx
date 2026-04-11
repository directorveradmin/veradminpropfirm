import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top, rgba(28,45,80,0.35) 0%, rgba(8,13,24,1) 45%, rgba(7,10,19,1) 100%)',
          color: '#e6edf3',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}