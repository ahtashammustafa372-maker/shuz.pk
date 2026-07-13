import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import User from '../../../models/User';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    const user = await User.findOne({ email, password, role: 'admin' }).lean();

    if (user) {
      return NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (err) {
    console.error("API Login POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}