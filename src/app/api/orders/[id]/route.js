import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongoose';
import Order from '../../../../models/Order';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    if (!body.status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = await Order.findByIdAndUpdate(id, { status: body.status }, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("API Order PUT Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}