import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import db from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let pages = db.getPages();
    if (type) {
      pages = pages.filter(p => p.type === type);
    }
    
    return NextResponse.json(pages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newPage = db.createPage(body);
    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
