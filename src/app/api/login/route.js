import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

function readDB() {
  const fileData = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(fileData);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { email, password } = data;
    const db = readDB();
    
    if (!db.users) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const user = db.users.find(u => u.email === email && u.password === password && u.role === 'admin');
    
    if (user) {
      return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
  }
}
