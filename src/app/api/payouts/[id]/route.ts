import { NextResponse } from "next/server";
import {
  updatePayoutRecordById,
  type MutationFailure,
} from "@/lib/server/workspaceStore";

export const runtime = "nodejs";

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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const result = updatePayoutRecordById(id, {
    status: body.status as never,
    note: body.note as never,
    amount: body.amount as never,
  });

  if (!result.ok) {
    return toErrorResponse(result);
  }

  return NextResponse.json(result.value);
}
