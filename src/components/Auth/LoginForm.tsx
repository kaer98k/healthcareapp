'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onSwitchToSignUp?: () => void;
  onSwitchToResetPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError, onSwitchToSignUp, onSwitchToResetPassword }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      const errorMessage = '구글 로그인 중 오류가 발생했습니다: ' + error.message;
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      const errorMessage = '카카오 로그인 중 오류가 발생했습니다: ' + error.message;
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = () => {
    router.push('/email-login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      {/* 메인 콘텐츠 */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">🏋️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="space-y-4 mb-8">
          {/* 구글 로그인 */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? '로그인 중...' : 'Google로 계속하기'}
          </button>

          {/* 카카오 로그인 */}
          <button
            onClick={handleKakaoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 border border-yellow-300 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-5 h-5 mr-3 bg-black text-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
              카
            </div>
            {loading ? '로그인 중...' : '카카오로 계속하기'}
          </button>
        </div>

        {/* 구분선 */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* 이메일 로그인 버튼 */}
        <button
          onClick={handleEmailLogin}
          className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          이메일로 로그인
        </button>

        {/* 오류 메시지 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* 푸터 */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-gray-500 text-sm">
            계정이 없으신가요?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              회원가입
            </button>
          </p>
          <p className="text-gray-500 text-sm">
            <button
              onClick={onSwitchToResetPassword}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              비밀번호를 잊으셨나요?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
