import { NextResponse } from "next/server";
import { buildReportsVmFromWorkspace } from "@/lib/server/reportsFromWorkspace";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(buildReportsVmFromWorkspace());
}