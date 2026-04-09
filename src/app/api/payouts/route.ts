import { NextRequest, NextResponse } from 'next/server';
import { createDb } from '../../../../db/client';
import { payoutRequests } from '../../../../db/schema';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { accountId, amountRequestedCents, notes } = body;
    if (!accountId || !amountRequestedCents) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const { sqlite, db } = createDb();
    try {
        const id = 'payout_' + Date.now();
        await db.insert(payoutRequests).values({
            id,
            accountId,
            requestedAt: new Date().toISOString(),
            amountRequestedCents,
            status: 'requested',
            notes: notes ?? null,
            expectedArrivalAt: null,
            receivedAt: null,
            amountReceivedCents: null,
        });
        return NextResponse.json({ ok: true, id });
    } finally {
        sqlite.close();
    }
}
