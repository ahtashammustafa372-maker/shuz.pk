import { NextResponse } from 'next/server';
const db = require('../../../lib/db');

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const returns = db.getReturns();
    // Sort returns by date descending
    returns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return NextResponse.json(returns);
  } catch (err) {
    console.error("API Returns GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.order_id || !body.customer_name || !body.reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReturn = db.createReturn(body);
    db.addNotification('New Return Request', `Return requested for Order #${newReturn.order_id} by ${newReturn.customer_name}.`, 'return', '/admin/returns');
    return NextResponse.json(newReturn, { status: 201 });
  } catch (err) {
    console.error("API Returns POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
