import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'
import { ResetPasswordForm } from './ResetPasswordForm'

type AuthMode = 'login' | 'signup' | 'reset-password'

export const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  const renderAuthForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignUp={() => setAuthMode('signup')}
            onSwitchToResetPassword={() => setAuthMode('reset-password')}
          />
        )
      case 'signup':
        return (
          <SignUpForm
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )
      case 'reset-password':
        return (
          <ResetPasswordForm
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )
      default:
        return <LoginForm onSwitchToSignUp={() => setAuthMode('signup')} onSwitchToResetPassword={() => setAuthMode('reset-password')} />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        {renderAuthForm()}
      </div>
    </div>
  )
}
