import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import User from '../../../models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).lean();
    return NextResponse.json(users);
  } catch (err) {
    console.error("API Users GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const newUser = new User(body);
    await newUser.save();
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("API Users POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export { POST as PUT };
