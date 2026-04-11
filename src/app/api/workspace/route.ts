import { NextResponse } from "next/server";
import { getWorkspaceData } from "@/lib/server/workspaceStore";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getWorkspaceData());
}