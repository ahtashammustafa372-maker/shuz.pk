import { NextResponse } from 'next/server';
const db = require('../../../../lib/db');

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!body.status) {
      return NextResponse.json({ error: 'Missing status field' }, { status: 400 });
    }

    const updatedOrder = db.updateOrderStatus(id, body.status);
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error("API Order PUT Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
