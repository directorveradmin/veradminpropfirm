type DetailDrawerProps = {
  item?: unknown;
  onClose?: () => void;
};

export default function DetailDrawer({
  item,
  onClose,
}: DetailDrawerProps) {
  if (!item) {
    return null;
  }

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
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontWeight: 600 }}>Detail Drawer</div>
        <button
          type="button"
          onClick={() => onClose?.()}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(30,41,59,0.9)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
      <pre style={{ marginTop: 8, fontSize: 12 }}>
        {JSON.stringify(item, null, 2)}
      </pre>
    </div>
  );
}