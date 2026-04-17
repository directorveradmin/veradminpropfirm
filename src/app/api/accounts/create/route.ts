import { NextRequest, NextResponse } from 'next/server';
const Database = require('better-sqlite3');
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, label, balance, size, stage, drawdownType, dailyLimit, maxLimit, target, tp, sl } = body;

    const dbPath = path.join(process.cwd(), '.veradmin-dev', 'veradmin.dev.sqlite');
    const db = new Database(dbPath);

    const stmt = db.prepare(`
      INSERT INTO accounts (
        id, label, balance, high_water_mark, account_size, account_stage, 
        drawdown_type, tp_ticks, sl_ticks, daily_limit_pct, max_limit_pct, target_pct, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Convert 5 to 0.05 for decimal math
    stmt.run(id, label, balance, balance, size, stage, drawdownType, tp, sl, dailyLimit/100, maxLimit/100, target/100, 'ACTIVE');
    
    db.close();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
