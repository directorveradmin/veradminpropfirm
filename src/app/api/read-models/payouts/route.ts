import { NextResponse } from 'next/server';
import { loadPayoutsScreen } from '../../../../../lib/services/read-models';

export async function GET() {
    const data = await loadPayoutsScreen();
    return NextResponse.json(data);
}
