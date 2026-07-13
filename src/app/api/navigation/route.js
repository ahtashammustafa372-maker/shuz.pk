import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import NavigationItem from '../../../models/NavigationItem';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const items = await NavigationItem.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(items);
  } catch (err) {
    console.error("API Navigation GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    if (!data.label || !data.url) {
      return NextResponse.json({ error: 'Label and URL are required' }, { status: 400 });
    }

    const count = await NavigationItem.countDocuments();
    const newItem = new NavigationItem({
      ...data,
      order: data.order || count + 1
    });
    
    await newItem.save();
    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error("API Navigation POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export { POST as PUT };
