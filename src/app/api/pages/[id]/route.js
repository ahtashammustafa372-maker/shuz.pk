import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongoose';
import Page from '../../../../models/Page';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const updated = await Page.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (err) {
    console.error("API Page PUT Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const deleted = await Page.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Page DELETE Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}