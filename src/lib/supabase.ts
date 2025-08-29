import { createClient } from '@supabase/supabase-js'

// 환경 변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 환경 변수가 없으면 에러 발생
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요.'
  )
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Google OAuth 로그인 함수
export const signInWithGoogle = async () => {
  try {
    console.log('Google OAuth 시작...')
    console.log('Supabase URL:', supabaseUrl)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://spdwmdsuwshovphqvyyl.supabase.co/auth/v1/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
    
    if (error) {
      console.error('Google OAuth 오류:', error)
      throw error
    }
    
    console.log('Google OAuth 성공:', data)
    return { data, error: null }
  } catch (error) {
    console.error('Google OAuth 예외:', error)
    return { data: null, error }
  }
}

// 타입 안전성을 위한 헬퍼 함수
export const getSupabaseClient = () => supabase
