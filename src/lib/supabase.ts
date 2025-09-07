import { createClient } from '@supabase/supabase-js'

// 환경 변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 환경 변수가 없으면 기본값 사용 (개발 환경에서만)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다. 기본값을 사용합니다.')
}

// Supabase 클라이언트 생성 (환경변수가 없어도 빌드 오류 방지)
export const supabase = createClient(
  supabaseUrl || 'https://wjkodoqunmzctepeaehb.supabase.co', 
  supabaseAnonKey || 'sb_publishable_g1YeOisMFXyVsr8gnkPXgQ_7D1SVnQj',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Google OAuth 로그인 함수
export const signInWithGoogle = async () => {
  try {
    console.log('Google OAuth 시작...')
    console.log('Supabase URL:', supabaseUrl)
    
    // 클라이언트 사이드에서만 window.location.origin 사용
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'https://your-app.vercel.app/auth/callback'
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
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

// Kakao OAuth 로그인 함수
export const signInWithKakao = async () => {
  try {
    console.log('Kakao OAuth 시작...')
    console.log('Supabase URL:', supabaseUrl)
    
    // 클라이언트 사이드에서만 window.location.origin 사용
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'https://your-app.vercel.app/auth/callback'
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
    
    if (error) {
      console.error('Kakao OAuth 오류:', error)
      throw error
    }
    
    console.log('Kakao OAuth 성공:', data)
    return { data, error: null }
  } catch (error) {
    console.error('Kakao OAuth 예외:', error)
    return { data: null, error }
  }
}

// 타입 안전성을 위한 헬퍼 함수
export const getSupabaseClient = () => supabase
