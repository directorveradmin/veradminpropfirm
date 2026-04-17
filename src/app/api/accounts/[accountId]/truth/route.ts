import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: 'src\app\api\accounts\[accountId]\truth\route.ts',
    message: 'Placeholder route created by bootstrap script.',
  });
}