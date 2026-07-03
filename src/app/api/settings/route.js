import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

function readDB() {
  const fileData = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(fileData);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.settings || { slider: [], theme: {}, general: {} });
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const db = readDB();
    
    // We expect the payload to be the full settings object or partial updates
    db.settings = { ...db.settings, ...data };
    
    writeDB(db);
    return NextResponse.json(db.settings);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
