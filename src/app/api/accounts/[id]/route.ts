import { NextResponse } from "next/server";
import {
  appendJournalEntry,
  getAccountById,
  getAlerts,
  getJournalEntries,
  getPayouts,
  updateAccountById,
} from "@/lib/server/workspaceStore";

export const runtime = "nodejs";

function buildPayload(id: string) {
  const account = getAccountById(id);
  return {
    account,
    alerts: getAlerts().filter((item) => item.accountId === id),
    journal: getJournalEntries().filter((item) => item.accountId === id),
    payouts: getPayouts().filter((item) => item.accountId === id),
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const payload = buildPayload(id);
  if (!payload.account) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(payload);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const patch: Record<string, unknown> = {};

  if (typeof body.mode === "string") patch.mode = body.mode;
  if (typeof body.status === "string") patch.status = body.status;
  if (typeof body.lives === "number") patch.lives = body.lives;
  if (typeof body.payoutReady === "boolean") patch.payoutReady = body.payoutReady;
  if (typeof body.note === "string") patch.note = body.note;

  const updated = updateAccountById(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (typeof body.journalNote === "string" && body.journalNote.trim().length > 0) {
    appendJournalEntry({
      accountId: id,
      title: "Quick account note",
      outcome: "note",
      session: "Operator",
      summary: body.journalNote.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    });
  }

  return NextResponse.json(buildPayload(id));
}