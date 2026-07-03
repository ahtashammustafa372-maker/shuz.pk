import { NextResponse } from 'next/server';
const db = require('../../../lib/db'); // force recompile

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const notifications = db.getNotifications();
    return NextResponse.json(notifications);
  } catch (err) {
    console.error("API Notifications GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const success = db.markAllNotificationsRead();
    return NextResponse.json({ success });
  } catch (err) {
    console.error("API Notifications PUT Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
