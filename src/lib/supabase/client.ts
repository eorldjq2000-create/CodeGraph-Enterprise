import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

// 환경 변수가 없을 경우를 대비한 하이브리드 로컬 Mocking 지원
export const supabase = createClient(supabaseUrl, supabaseKey);
