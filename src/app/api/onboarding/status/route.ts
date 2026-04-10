import { NextResponse } from "next/server";
import { deriveFirstRunStatus } from "@/lib/services/onboarding/firstRun";

export function GET() {
  return NextResponse.json(deriveFirstRunStatus(0, false));
}
