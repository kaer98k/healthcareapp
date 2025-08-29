'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export const AuthCallback: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('OAuth 콜백 처리 시작...')
        
        // URL에서 세션 정보 확인
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('세션 확인 오류:', error)
          setError('인증 처리 중 오류가 발생했습니다.')
          setTimeout(() => router.push('/auth'), 3000)
          return
        }

        if (data.session) {
          console.log('인증 성공:', data.session.user.email)
          // 메인 페이지로 리디렉션
          router.push('/')
        } else {
          console.log('세션이 없음, 로그인 페이지로 이동')
          router.push('/auth')
        }
      } catch (err) {
        console.error('콜백 처리 예외:', err)
        setError('인증 처리 중 예상치 못한 오류가 발생했습니다.')
        setTimeout(() => router.push('/auth'), 3000)
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">인증 처리 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-6 text-xl font-medium text-gray-900">인증 실패</h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <p className="mt-4 text-sm text-gray-500">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    )
  }

  return null
}
