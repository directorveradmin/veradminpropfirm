type FilterPanelProps = {
  filters?: Record<string, unknown>;
  onChange?: (next: Record<string, unknown>) => void;
};

export default function FilterPanel({
  filters = {},
  onChange,
}: FilterPanelProps) {
  return (
    <div
      style={{
        marginBottom: 12,
        padding: 12,
        border: "1px solid rgba(148,163,184,0.2)",
        borderRadius: 10,
        background: "rgba(15,23,42,0.35)",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Filter Panel</div>
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
        Step 9 compatibility stub
      </div>
      <pre style={{ margin: 0, fontSize: 12 }}>
        {JSON.stringify(filters, null, 2)}
      </pre>
      <button
        type="button"
        onClick={() => onChange?.(filters)}
        style={{
          marginTop: 8,
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid rgba(148,163,184,0.25)",
          background: "rgba(30,41,59,0.9)",
          color: "white",
          cursor: "pointer",
        }}
      >
        Reapply Filters
      </button>
    </div>
  );
}