import type { ReactNode } from "react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/settings", label: "Settings" },
  { href: "/backups", label: "Backups" }
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: "#0b1020",
          color: "#e5e7eb",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            background:
              "linear-gradient(180deg, rgba(11,16,32,1) 0%, rgba(15,23,42,1) 100%)",
          }}
        >
          <aside
            style={{
              borderRight: "1px solid rgba(148,163,184,0.18)",
              padding: "20px 16px",
              background: "rgba(2,6,23,0.72)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  marginBottom: 6,
                }}
              >
                Veradmin
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#f8fafc",
                }}
              >
                Tactical OS
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#cbd5e1",
                }}
              >
                Administrative and tactical fleet operations.
              </div>
            </div>

            <nav
              aria-label="Primary"
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    color: "#e2e8f0",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(148,163,184,0.14)",
                    background: "rgba(15,23,42,0.65)",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: "1px solid rgba(148,163,184,0.16)",
                fontSize: 12,
                lineHeight: 1.5,
                color: "#94a3b8",
              }}
            >
              Settings and Backups stay separated from tactical surfaces and remain
              available from the root shell.
            </div>
          </aside>

          <main
            style={{
              minWidth: 0,
              padding: 24,
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}