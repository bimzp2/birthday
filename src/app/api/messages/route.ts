import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO messages (content) VALUES (?)');
    const result = stmt.run(content.trim());
    
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Gagal menyimpan pesan' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM messages ORDER BY created_at DESC');
    const messages = stmt.all();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Gagal mengambil pesan' }, { status: 500 });
  }
}
