import { NextResponse } from "next/server";
import {
  getAccountById,
  getAlerts,
  getJournalEntries,
  getPayouts,
  updateAccountAndMaybeAppendJournalById,
  type MutationFailure,
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

function toErrorResponse(result: MutationFailure) {
  const status =
    result.kind === "not_found" ? 404 : result.kind === "validation" ? 400 : 500;

  return NextResponse.json(
    {
      error: result.message,
      fieldErrors: result.fieldErrors ?? null,
      stateUnchanged: result.stateUnchanged,
    },
    { status }
  );
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

  const result = updateAccountAndMaybeAppendJournalById(
    id,
    {
      mode: body.mode as never,
      status: body.status as never,
      lives: body.lives as never,
      payoutReady: body.payoutReady as never,
      note: body.note as never,
    },
    body.journalNote
  );

  if (!result.ok) {
    return toErrorResponse(result);
  }

  return NextResponse.json(buildPayload(id));
}
