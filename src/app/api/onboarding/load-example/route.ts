import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    loaded: true,
    replacedExisting: false,
    manifestId: "onboarding_fleet_v1",
    accountCount: 5
  });
}
