import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    // Assuming the id here might be a slug or ID based on how it's called
    // We'll support ID. The frontend dynamic route uses slug.
    const pages = db.getPages();
    const page = pages.find(p => p.id === parseInt(id));
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    return NextResponse.json(page, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedPage = db.updatePage(id, body);
    
    if (!updatedPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedPage, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const success = db.deletePage(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
