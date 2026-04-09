import { NextResponse } from 'next/server';
import { loadAlertsScreen } from '../../../../../lib/services/read-models';

export async function GET() {
    const data = await loadAlertsScreen();
    return NextResponse.json(data);
}
