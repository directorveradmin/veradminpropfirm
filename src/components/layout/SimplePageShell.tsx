import Link from "next/link";
import type { ReactElement, ReactNode } from "react";

type RouteKey =
  | "home"
  | "journal"
  | "alerts"
  | "payouts"
  | "calendar"
  | "accounts"
  | "settings"
  | "backups";

interface PageShellProps {
  title: string;
  description: string;
  routeKey: RouteKey;
  children?: ReactNode;
}

const routes: Array<{ key: RouteKey; href: string; label: string }> = [
  { key: "home", href: "/", label: "Command Center" },
  { key: "journal", href: "/journal", label: "Journal" },
  { key: "alerts", href: "/alerts", label: "Alerts" },
  { key: "payouts", href: "/payouts", label: "Payouts" },
  { key: "calendar", href: "/calendar", label: "Calendar" },
  { key: "accounts", href: "/accounts", label: "Accounts" },
  { key: "settings", href: "/settings", label: "Settings" },
  { key: "backups", href: "/backups", label: "Backups" }
];

export default function SimplePageShell({
  title,
  description,
  routeKey,
  children
}: PageShellProps): ReactElement {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "#e5e7eb",
        fontFamily: "Arial, Helvetica, sans-serif"
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" }}>
        <aside
          style={{
            borderRight: "1px solid #1f2937",
            padding: 20,
            background: "#111827"
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", color: "#9ca3af", letterSpacing: 1 }}>
              Veradmin
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>Tactical Desktop</div>
          </div>

          <nav style={{ display: "grid", gap: 8 }}>
            {routes.map((route) => {
              const active = route.key === routeKey;
              return (
                <Link
                  key={route.key}
                  href={route.href}
                  style={{
                    display: "block",
                    padding: "10px 12px",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: active ? "#111827" : "#e5e7eb",
                    background: active ? "#93c5fd" : "#1f2937",
                    fontWeight: active ? 700 : 500
                  }}
                >
                  {route.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section style={{ padding: 28 }}>
          <header style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 30 }}>{title}</h1>
            <p style={{ marginTop: 10, color: "#9ca3af", maxWidth: 820 }}>{description}</p>
          </header>

          <div style={{ display: "grid", gap: 16 }}>{children}</div>
        </section>
      </div>
    </main>
  );
}
