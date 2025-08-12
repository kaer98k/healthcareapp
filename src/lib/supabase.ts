import { createClient } from '@supabase/supabase-js'

// 임시로 더미 값 사용 (테스트용)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key'

// 환경 변수가 없어도 에러를 발생시키지 않음

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
