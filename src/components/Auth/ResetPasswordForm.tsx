import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ResetPasswordFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onSwitchToLogin?: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ 
  onSuccess, 
  onError, 
  onSwitchToLogin 
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      if (onError) {
        onError('이메일을 입력해주세요.');
      }
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`
      });

      if (error) {
        throw error;
      }

      setSent(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('비밀번호 재설정 오류:', error);
      if (onError) {
        onError(error.message || '비밀번호 재설정에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="panel-container max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-status-activeBackground mb-4">
            <svg className="h-8 w-8 text-status-activeText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-panel-header font-panel-header text-text-primary mb-2">
            이메일 전송 완료
          </h2>
          <p className="text-body font-body text-text-secondary">
            {email}로 비밀번호 재설정 링크를 전송했습니다.<br />
            이메일을 확인하여 비밀번호를 재설정해주세요.
          </p>
        </div>
        
        {onSwitchToLogin && (
          <button
            onClick={onSwitchToLogin}
            className="utility-button w-full py-3 px-4 text-body font-body font-medium transition-all duration-200 hover:scale-105"
          >
            로그인으로 돌아가기
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="panel-container max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-panel-header font-panel-header text-text-primary mb-2">
          비밀번호 재설정
        </h2>
        <p className="text-body font-body text-text-secondary">
          가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-label font-label text-text-secondary mb-2">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input w-full px-4 py-3"
            placeholder="가입한 이메일을 입력하세요"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="utility-button w-full py-3 px-4 text-body font-body font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '전송 중...' : '재설정 링크 전송'}
        </button>
      </form>

      {onSwitchToLogin && (
        <div className="mt-6 text-center">
          <div className="text-body font-body text-text-secondary">
            비밀번호를 기억하셨나요?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-accent-blue hover:text-accent-blue/80 transition-colors duration-200"
            >
              로그인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordForm;
