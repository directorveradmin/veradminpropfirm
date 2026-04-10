import type { ReactElement, ReactNode } from "react";

export function InfoCard({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}): ReactElement {
  return (
    <section
      style={{
        border: "1px solid #1f2937",
        borderRadius: 14,
        padding: 18,
        background: "#111827"
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>{title}</h2>
      <div style={{ color: "#d1d5db", lineHeight: 1.55 }}>{children}</div>
    </section>
  );
}

export function KpiRow({
  items
}: {
  items: Array<{ label: string; value: string }>;
}): ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            border: "1px solid #1f2937",
            borderRadius: 14,
            padding: 16,
            background: "#111827"
          }}
        >
          <div style={{ fontSize: 12, textTransform: "uppercase", color: "#9ca3af", letterSpacing: 0.8 }}>
            {item.label}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
