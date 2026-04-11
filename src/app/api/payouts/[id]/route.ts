import { NextResponse } from "next/server";
import { updatePayoutById } from "@/lib/server/workspaceStore";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const patch: Record<string, unknown> = {};
  if (typeof body.status === "string") patch.status = body.status;
  if (typeof body.note === "string") patch.note = body.note;
  if (typeof body.amount === "number") patch.amount = body.amount;

  const updated = updatePayoutById(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}