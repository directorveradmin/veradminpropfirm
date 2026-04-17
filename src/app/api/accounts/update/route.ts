import { NextRequest, NextResponse } from 'next/server';
const Database = require('better-sqlite3');
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, label, balance, highWaterMark, changeAmount, account_size, account_stage, drawdown_type, daily_limit_pct, max_limit_pct } = body;

    const dbPath = path.join(process.cwd(), '.veradmin-dev', 'veradmin.dev.sqlite');
    const db = new Database(dbPath);

    if (label) {
      const stmt = db.prepare(`
        UPDATE accounts SET 
        label = ?, account_size = ?, account_stage = ?, drawdown_type = ?, 
        daily_limit_pct = ?, max_limit_pct = ? 
        WHERE id = ?
      `);
      stmt.run(label, account_size, account_stage, drawdown_type, daily_limit_pct, max_limit_pct, id);
    } else {
      const stmt = db.prepare('UPDATE accounts SET balance = ?, high_water_mark = ? WHERE id = ?');
      stmt.run(balance, highWaterMark, id);

      const logStmt = db.prepare('INSERT INTO activity_logs (account_id, message, type) VALUES (?, ?, ?)');
      const msg = changeAmount >= 0 ? `Win: +$${changeAmount}` : `Loss: -$${Math.abs(changeAmount)}`;
      logStmt.run(id, msg, 'TRADE');
    }
    
    db.close();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
