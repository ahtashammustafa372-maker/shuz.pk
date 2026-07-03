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

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.users || []);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = readDB();
    
    if (!db.users) db.users = [];
    
    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password || 'password123',
      role: data.role || 'user',
      created_at: new Date().toISOString()
    };
    
    db.users.push(newUser);
    writeDB(db);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
