import { NextResponse } from 'next/server';
const db = require('../../../lib/db');

export async function GET() {
  try {
    const orders = db.getOrders();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("API Orders GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate inputs
    if (!body.customerName || !body.customerPhone || !body.shippingAddress || !body.shippingCity || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Missing required order fields: name, phone, address, city, and items' }, { status: 400 });
    }

    const orderData = {
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || "",
      shippingAddress: body.shippingAddress,
      shippingCity: body.shippingCity,
      shippingProvince: body.shippingProvince || "Punjab",
      paymentMethod: body.paymentMethod || "Cash on Delivery",
      subtotal: parseFloat(body.subtotal),
      shippingFee: parseFloat(body.shippingFee),
      total: parseFloat(body.total),
      items: body.items // Array of items ordered
    };

    const newOrder = db.createOrder(orderData);
    db.addNotification('New Order Received', `Order #${newOrder.id} placed by ${newOrder.customerName}.`, 'order', '/admin');
    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error("API Orders POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
