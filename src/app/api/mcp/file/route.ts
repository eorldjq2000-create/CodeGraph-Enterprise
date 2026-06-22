import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const absolutePath = path.join(process.cwd(), filePath);
    
    // Security check to prevent directory traversal
    if (!absolutePath.startsWith(process.cwd())) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (fs.existsSync(absolutePath)) {
      const content = fs.readFileSync(absolutePath, 'utf-8');
      return NextResponse.json({ content });
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
