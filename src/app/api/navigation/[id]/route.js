import { NextResponse } from 'next/server';
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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const db = readDB();
    
    if (!db.navbar) db.navbar = [];
    
    const index = db.navbar.findIndex(item => item.id == id);
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    db.navbar[index] = { ...db.navbar[index], ...data };
    writeDB(db);
    
    return NextResponse.json(db.navbar[index]);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = readDB();
    
    if (!db.navbar) db.navbar = [];
    
    db.navbar = db.navbar.filter(item => item.id != id);
    writeDB(db);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
