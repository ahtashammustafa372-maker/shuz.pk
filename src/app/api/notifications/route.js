import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Notification from '../../../models/Notification';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const notifications = await Notification.find({}).sort({ created_at: -1 }).limit(50).lean();
    return NextResponse.json(notifications);
  } catch (err) {
    console.error("API Notifications GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT() {
  try {
    await dbConnect();
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Notifications PUT Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}