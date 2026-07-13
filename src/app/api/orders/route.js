import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Order from '../../../models/Order';
import Notification from '../../../models/Notification';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ created_at: -1 }).lean();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("API Orders GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.customerName || !body.customerPhone || !body.shippingAddress || !body.shippingCity || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    const count = await Order.countDocuments();
    const orderId = `#${1001 + count}`;

    const newOrder = new Order({
      orderId,
      customerName: body.customerName,
      phone: body.customerPhone,
      address: body.shippingAddress,
      city: body.shippingCity,
      total: parseFloat(body.total),
      items: body.items,
      payment_method: body.paymentMethod || 'COD'
    });

    await newOrder.save();
    
    await Notification.create({
      title: 'New Order Received',
      message: `Order ${orderId} placed by ${body.customerName}.`,
      type: 'order',
      link: '/admin'
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error("API Orders POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export { POST as PUT };
