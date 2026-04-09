import { NextRequest, NextResponse } from 'next/server';
import { createDb } from '../../../../../db/client';
import { payoutRequests } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { action, amountReceivedCents } = await req.json();
    const { sqlite, db } = createDb();
    try {
        if (action === 'mark_received') {
            await db.update(payoutRequests)
                .set({
                    status: 'paid',
                    receivedAt: new Date().toISOString(),
                    amountReceivedCents: amountReceivedCents ?? null,
                })
                .where(eq(payoutRequests.id, params.id));
        } else if (action === 'cancel') {
            await db.update(payoutRequests)
                .set({ status: 'cancelled' })
                .where(eq(payoutRequests.id, params.id));
        } else {
            return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
    } finally {
        sqlite.close();
    }
}
