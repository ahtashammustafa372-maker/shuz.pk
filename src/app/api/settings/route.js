import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Setting from '../../../models/Setting';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const settingsDocs = await Setting.find({}).lean();
    
    // Transform array of { type: 'xyz', data: {} } back to { xyz: {} } object
    const settings = {};
    settingsDocs.forEach(doc => {
      settings[doc.type] = doc.data;
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("API Settings GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Update each key in settings
    for (const [key, value] of Object.entries(data)) {
      await Setting.findOneAndUpdate(
        { type: key },
        { data: value },
        { upsert: true, new: true }
      );
    }
    
    const updatedDocs = await Setting.find({}).lean();
    const updatedSettings = {};
    updatedDocs.forEach(doc => { updatedSettings[doc.type] = doc.data; });
    
    return NextResponse.json(updatedSettings);
  } catch (err) {
    console.error("API Settings POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}