import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: 'src\app\api\rule-profiles\[profileId]\route.ts',
    message: 'Placeholder route created by bootstrap script.',
  });
}