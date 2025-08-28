import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ResetPasswordForm from './ResetPasswordForm';

type AuthMode = 'login' | 'signup' | 'reset';

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSuccess = () => {
    setMessage({ type: 'success', text: '성공적으로 처리되었습니다!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleError = (error: string) => {
    setMessage({ type: 'error', text: error });
    setTimeout(() => setMessage(null), 5000);
  };

  const renderForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <LoginForm
            onSuccess={handleSuccess}
            onError={handleError}
            onSwitchToSignUp={() => setAuthMode('signup')}
            onSwitchToResetPassword={() => setAuthMode('reset')}
          />
        );
      case 'signup':
        return (
          <SignUpForm
            onSuccess={handleSuccess}
            onError={handleError}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        );
      case 'reset':
        return (
          <ResetPasswordForm
            onSuccess={handleSuccess}
            onError={handleError}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case 'login':
        return '로그인';
      case 'signup':
        return '회원가입';
      case 'reset':
        return '비밀번호 재설정';
      default:
        return '';
    }
  };

  const getDescription = () => {
    switch (authMode) {
      case 'login':
        return '계정에 로그인하여 건강 관리 시스템을 이용하세요';
      case 'signup':
        return '새로운 계정을 만들어 건강 관리 시스템을 시작하세요';
      case 'reset':
        return '이메일을 입력하여 비밀번호를 재설정하세요';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 메시지 표시 */}
        {message && (
          <div className={`mb-6 p-4 rounded-medium text-body font-body ${
            message.type === 'success' 
              ? 'bg-status-activeBackground text-status-activeText border border-status-activeText' 
              : 'bg-red-900/20 text-red-400 border border-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* 인증 폼 */}
        {renderForm()}

        {/* 모드 전환 버튼 */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setAuthMode('login')}
              className={`text-body font-body transition-colors duration-200 ${
                authMode === 'login' 
                  ? 'text-accent-blue border-b-2 border-accent-blue' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`text-body font-body transition-colors duration-200 ${
                authMode === 'signup' 
                  ? 'text-accent-blue border-b-2 border-accent-blue' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
