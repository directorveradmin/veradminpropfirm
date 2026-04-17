import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: 'src\app\api\payouts\request\route.ts',
    message: 'Placeholder route created by bootstrap script.',
  });
}