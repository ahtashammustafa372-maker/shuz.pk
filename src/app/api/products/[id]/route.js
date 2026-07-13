import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongoose';
import Product from '../../../../models/Product';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    // Convert _id strings if needed, though Mongoose handles hex strings naturally
    const updated = await Product.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (err) {
    console.error("API Product PUT Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error("API Product DELETE Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}