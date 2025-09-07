'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function AuthCallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (data.session) {
          // 로그인 성공, 메인 페이지로 이동
          router.push('/')
        } else {
          // 세션이 없으면 로그인 페이지로 이동
          router.push('/login')
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setError('인증 처리 중 오류가 발생했습니다.')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 처리 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm">잠시 후 로그인 페이지로 이동합니다.</p>
        </div>
      </div>
    )
  }

  return null
}

export default function AuthCallbackPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackPage />
    </Suspense>
  )
}
