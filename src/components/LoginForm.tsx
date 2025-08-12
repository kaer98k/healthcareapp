import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

export const LoginForm: React.FC = () => {
  const { signInWithGoogle, signInWithKakao, loading } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Google 로그인 실패:', error)
      alert('Google 로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao()
    } catch (error) {
      console.error('카카오 로그인 실패:', error)
      alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-black">
            AI Health Coach
          </CardTitle>
          <CardDescription className="text-lg text-black mt-2">
            맞춤형 운동 추천을 받아보세요
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
                         <Button
               onClick={handleGoogleLogin}
               className="w-full bg-white text-black border border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-3 py-3"
               disabled={loading}
             >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google로 계속하기</span>
            </Button>

            <Button
              onClick={handleKakaoLogin}
              className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 flex items-center justify-center space-x-3 py-3"
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 7.06a1.416 1.416 0 0 0-.846.113 1.439 1.439 0 0 0-.537.823 1.44 1.44 0 0 0 .537.823c.264.151.582.19.846.113a1.416 1.416 0 0 0 .537-.823 1.439 1.439 0 0 0-.537-.823zm-11.814 0a1.416 1.416 0 0 0-.846.113 1.439 1.439 0 0 0-.537.823 1.44 1.44 0 0 0 .537.823c.264.151.582.19.846.113a1.416 1.416 0 0 0 .537-.823 1.439 1.439 0 0 0-.537-.823z"/>
              </svg>
              <span>카카오로 계속하기</span>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-black">
              로그인하면 개인정보 보호정책 및 서비스 약관에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
