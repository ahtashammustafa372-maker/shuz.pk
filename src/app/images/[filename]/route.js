import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  // Await params as required in Next.js 15+
  const resolvedParams = await params;
  const filename = resolvedParams.filename;
  
  if (!filename) {
    return NextResponse.json({ error: 'Filename missing' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'images', filename);
  
  try {
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      
      let contentType = 'image/jpeg';
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.svg') contentType = 'image/svg+xml';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } else {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } catch (err) {
    console.error('Error serving image:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
