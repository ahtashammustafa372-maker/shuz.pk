import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongoose';
import NavigationItem from '../../../../models/NavigationItem';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await request.json();
    
    const updated = await NavigationItem.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (err) {
    console.error("API Navigation PUT Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const deleted = await NavigationItem.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Navigation DELETE Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}