"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Surface, Panel, StatCard, ActionLink } from "@/lib/ui/surface";

export default function AccountDetailScreen({ accountId }: { accountId: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/accounts/${accountId}`)
      .then(res => res.json())
      .then(setData);
  }, [accountId]);

  if (!data?.account) {
    return (
      <Surface eyebrow="Core" title="Loading account..." subtitle="Reading local workspace data.">
        <div>Loading...</div>
      </Surface>
    );
  }

  const account = data.account;

  return (
    <Surface
      eyebrow="Core"
      title={account.name}
      subtitle={account.note}
      actions={
        <>
          <ActionLink href="/accounts" label="Back to Accounts" />
          <ActionLink href={`/simulation?accountId=${account.id}`} label="Open Simulation" primary />
        </>
      }
    >
      <section style={{ display: "grid", gap: 16 }}>
        <StatCard title="Mode" value={account.mode} />
        <StatCard title="Status" value={account.status} />
        <StatCard title="Lives" value={String(account.lives)} />
      </section>

      <Panel title="Actions">
        <button onClick={() => fetch(`/api/accounts/${account.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ lives: account.lives + 1 })
        }).then(() => location.reload())}>
          Lives +1
        </button>
      </Panel>

      <Panel title="Simulation">
        <Link href={`/simulation?accountId=${account.id}&action=standard_win`}>
          Simulate win
        </Link>
        <br />
        <Link href={`/simulation?accountId=${account.id}&action=standard_loss`}>
          Simulate loss
        </Link>
      </Panel>
    </Surface>
  );
}