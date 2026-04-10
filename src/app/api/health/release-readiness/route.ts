import { NextResponse } from "next/server";
import { buildReleaseReadinessReport } from "@/lib/services/release/readiness";

export function GET() {
  return NextResponse.json(buildReleaseReadinessReport());
}
