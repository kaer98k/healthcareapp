import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('비밀번호 재설정 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            이메일 전송 완료!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            입력하신 이메일로 비밀번호 재설정 링크를 보냈습니다.
            이메일을 확인하여 비밀번호를 재설정해주세요.
          </p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="mt-4 font-medium text-indigo-600 hover:text-indigo-500"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          비밀번호 재설정
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            로그인으로 돌아가기
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '전송 중...' : '비밀번호 재설정 링크 전송'}
          </button>
        </div>
      </form>
    </div>
  )
}
