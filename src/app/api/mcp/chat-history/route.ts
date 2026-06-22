/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import crypto from 'crypto';

// In-memory fallback if Supabase is not configured
const mockDatabase: any[] = [];

export async function POST(request: Request) {
  try {
    const { targetFile, rawCodeLength, compressedLength, promptInput, aiOutput } = await request.json();

    if (!targetFile) {
      return NextResponse.json({ error: 'targetFile is required' }, { status: 400 });
    }

    // Formula: Saved Tokens = (Raw Code Characters - Compressed Skeleton Characters) / 3.5
    const rawLen = typeof rawCodeLength === 'number' ? rawCodeLength : 10000;
    const compLen = typeof compressedLength === 'number' ? compressedLength : 500;
    
    let savedTokens = Math.max(0, Math.floor((rawLen - compLen) / 3.5));
    if (isNaN(savedTokens)) savedTokens = 0;

    const session_id = crypto.randomUUID();
    const turn_index = 0; // Currently simulating a single turn dump

    const record = {
      session_id,
      turn_index,
      target_file: targetFile,
      prompt_input: promptInput || '',
      ai_output: aiOutput || 'AI Refactoring Simulation Completed.',
      token_saved: savedTokens,
      created_at: new Date().toISOString()
    };

    // If Supabase is connected, insert it. Otherwise use local array.
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from('chat_history').insert([record]);
      if (error) console.error("Supabase Error:", error);
    } else {
      mockDatabase.push(record);
    }

    return NextResponse.json({ success: true, record });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save chat history' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase.from('chat_history').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      const totalTokensSaved = data.reduce((acc, row) => acc + (row.token_saved || 0), 0);
      return NextResponse.json({ history: data, totalTokensSaved, totalSessions: data.length });
    } else {
      const totalTokensSaved = mockDatabase.reduce((acc, row) => acc + (row.token_saved || 0), 0);
      return NextResponse.json({ history: mockDatabase, totalTokensSaved, totalSessions: mockDatabase.length });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
  }
}
