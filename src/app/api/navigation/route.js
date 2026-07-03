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
  return NextResponse.json(db.navbar || []);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = readDB();
    
    if (!db.navbar) db.navbar = [];
    
    const newItem = {
      id: Date.now(),
      label: data.label,
      link: data.link,
      order: data.order || db.navbar.length + 1
    };
    
    db.navbar.push(newItem);
    writeDB(db);
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create navigation item' }, { status: 500 });
  }
}
