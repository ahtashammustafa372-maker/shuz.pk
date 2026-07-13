import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Page from '../../../models/Page';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const pages = await Page.find({}).sort({ created_at: -1 }).lean();
    return NextResponse.json(pages);
  } catch (err) {
    console.error("API Pages GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPage = new Page(body);
    await newPage.save();
    
    return NextResponse.json(newPage, { status: 201 });
  } catch (err) {
    console.error("API Pages POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export { POST as PUT };
