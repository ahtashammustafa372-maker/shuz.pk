import { NextResponse } from 'next/server';
const db = require('../../../../lib/db');

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!body.status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updatedReturn = db.updateReturnStatus(id, body.status);
    
    if (!updatedReturn) {
      return NextResponse.json({ error: 'Return not found' }, { status: 404 });
    }

    return NextResponse.json(updatedReturn);
  } catch (err) {
    console.error("API Returns PUT Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
