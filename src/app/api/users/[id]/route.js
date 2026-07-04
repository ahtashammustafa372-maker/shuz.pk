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
    const { id } = await params;
    const data = await request.json();
    const db = readDB();
    
    if (!db.users) db.users = [];
    
    const index = db.users.findIndex(item => item.id == id);
    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    db.users[index] = { ...db.users[index], ...data };
    writeDB(db);
    
    return NextResponse.json(db.users[index]);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = readDB();
    
    if (!db.users) db.users = [];
    
    db.users = db.users.filter(item => item.id != id);
    writeDB(db);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
