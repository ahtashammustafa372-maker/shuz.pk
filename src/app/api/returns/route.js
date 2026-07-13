import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Return from '../../../models/Return';
import Notification from '../../../models/Notification';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const returns = await Return.find({}).sort({ created_at: -1 }).lean();
    return NextResponse.json(returns);
  } catch (err) {
    console.error("API Returns GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.order_id || !body.customer_email || !body.reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReturn = new Return(body);
    await newReturn.save();
    
    await Notification.create({
      title: 'New Return Request',
      message: `Return requested for Order ${newReturn.order_id} by ${newReturn.customer_name}.`,
      type: 'return',
      link: '/admin/returns'
    });

    return NextResponse.json(newReturn, { status: 201 });
  } catch (err) {
    console.error("API Returns POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export { POST as PUT };
