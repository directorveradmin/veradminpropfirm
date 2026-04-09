import { NextRequest, NextResponse } from 'next/server';
import { createDb } from '../../../../../db/client';
import { alerts } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { action } = await req.json();
    const { sqlite, db } = createDb();
    try {
        if (action === 'acknowledge') {
            await db.update(alerts)
                .set({ status: 'dismissed' })
                .where(eq(alerts.id, params.id));
        } else if (action === 'resolve') {
            await db.update(alerts)
                .set({ status: 'resolved', resolvedAt: new Date().toISOString() })
                .where(eq(alerts.id, params.id));
        } else {
            return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
    } finally {
        sqlite.close();
    }
}
