import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongoose';
import Setting from '@/src/models/Setting';

export async function GET() {
  try {
    await dbConnect();
    const setting = await Setting.findOne({ type: 'perfectMatchSizes' });
    return NextResponse.json({ success: true, sizes: setting ? setting.data : [] });
  } catch (error) {
    console.error('Error fetching perfect match sizes:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch sizes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { sizes } = await request.json();

    if (!Array.isArray(sizes)) {
      return NextResponse.json({ success: false, error: 'Sizes must be an array' }, { status: 400 });
    }

    const updatedSetting = await Setting.findOneAndUpdate(
      { type: 'perfectMatchSizes' },
      { type: 'perfectMatchSizes', data: sizes },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, sizes: updatedSetting.data });
  } catch (error) {
    console.error('Error updating perfect match sizes:', error);
    return NextResponse.json({ success: false, error: 'Failed to update sizes' }, { status: 500 });
  }
}
