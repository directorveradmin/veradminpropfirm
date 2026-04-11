"use client";

import { useCallback, useEffect, useState } from "react";
import type { PayoutRecord } from "@/lib/server/workspaceStore";
import { Surface, Panel, StatCard, ActionLink } from "@/lib/ui/surface";

type WorkspacePayload = {
  payouts: PayoutRecord[];
};

export default function PayoutsScreen() {
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/workspace", { cache: "no-store" });
    const json = (await response.json()) as WorkspacePayload;
    setPayouts(json.payouts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = useCallback(async (id: string, status: PayoutRecord["status"]) => {
    await fetch(`/api/payouts/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }, [load]);

  const total = payouts.reduce((sum, payout) => sum + payout.amount, 0);

  return (
    <Surface
      eyebrow="Core"
      title="Payouts"
      subtitle="Review payout readiness, requests, and receipts as a business layer."
      actions={
        <>
          <ActionLink href="/accounts" label="Open Accounts" />
          <ActionLink href="/reports" label="Open Reports" primary />
        </>
      }
    >
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatCard title="Records" value={String(payouts.length)} />
        <StatCard title="Ready" value={String(payouts.filter((p) => p.status === "ready").length)} />
        <StatCard title="Requested" value={String(payouts.filter((p) => p.status === "requested").length)} />
        <StatCard title="Tracked amount" value={total.toString()} note={loading ? "Refreshing local workspaceâ€¦" : "Loaded from workspace.json"} />
      </section>

      <Panel title="Payout records" subtitle="These controls now write changes back into workspace.json.">
        <div style={{ display: "grid", gap: 12 }}>
          {payouts.map((payout) => (
            <article key={payout.id} style={{ borderTop: "1px solid rgba(71, 94, 132, 0.25)", paddingTop: 12, display: "grid", gap: 8 }}>
              <div style={{ fontWeight: 700 }}>${payout.amount}</div>
              <div style={{ color: "#9fb3c8" }}>{payout.status} â€” {payout.note}</div>
              <div style={{ color: "#7f94ae", fontSize: 13 }}>Account: {payout.accountId}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => void updateStatus(payout.id, "ready")}>Mark ready</button>
                <button onClick={() => void updateStatus(payout.id, "requested")}>Mark requested</button>
                <button onClick={() => void updateStatus(payout.id, "received")}>Mark received</button>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </Surface>
  );
}