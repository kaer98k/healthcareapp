import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 생성 (하드코딩된 URL 사용)
export const supabase = createClient(
  'https://wjkodoqunmzctepeaehb.supabase.co', 
  'sb_publishable_g1YeOisMFXyVsr8gnkPXgQ_7D1SVnQj',
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
    console.log('Supabase URL:', supabaseUrl || 'https://wjkodoqunmzctepeaehb.supabase.co')
    
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
