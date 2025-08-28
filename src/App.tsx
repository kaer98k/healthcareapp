import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import WorkoutLog from './components/WorkoutLog';
import Dashboard from './components/Dashboard';
import WorkoutPage from './components/WorkoutPage';
import ConfigDebugger from './components/ConfigDebugger';
import LoginForm from './components/Auth/LoginForm';
import EmailLoginForm from './components/Auth/EmailLoginForm';
import SignUpForm from './components/Auth/SignUpForm';
import './App.css';

// 네비게이션 바를 조건부로 렌더링하는 컴포넌트
const NavigationBar: React.FC = () => {
  const location = useLocation();
  const authRoutes = ['/login', '/email-login', '/signup'];
  
  // 인증 관련 페이지에서는 네비게이션 바를 숨김
  if (authRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border shadow-lg">
      <div className="flex justify-around items-center py-3 px-4 bg-background" >
        {/* 운동 일지 */}
        <a 
          href="/" 
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105"
        >
          <div className="text-2xl">📝</div>
          <span className="text-xs font-medium text-foreground">운동 일지</span>
        </a>

        {/* 커뮤니티 */}
        <a 
          href="/community" 
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105"
        >
          <div className="text-2xl">👥</div>
          <span className="text-xs font-medium text-foreground">커뮤니티</span>
        </a>

        {/* 챌린지 */}
        <a 
          href="/workout" 
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105"
        >
          <div className="text-2xl">🏆</div>
          <span className="text-xs font-medium text-foreground">챌린지</span>
        </a>

        {/* 설정 */}
        <a 
          href="/settings" 
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105"
        >
          <div className="text-2xl">⚙️</div>
          <span className="text-xs font-medium text-foreground">설정</span>
        </a>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            {/* 메인 콘텐츠 영역 */}
            <main className="flex-1 p-6 pb-24">
              <Routes>
                <Route path="/" element={<WorkoutLog />} />
                <Route path="/community" element={<Dashboard />} />
                <Route path="/workout" element={<WorkoutPage />} />
                <Route path="/settings" element={<ConfigDebugger />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/email-login" element={<EmailLoginForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                {/* 이전 주소 검색 경로를 운동 일지로 리다이렉트 */}
                <Route path="/address-search" element={<Navigate to="/" replace />} />
                {/* 알 수 없는 경로는 운동 일지로 리다이렉트 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* 하단 네비게이션 바 (조건부 렌더링) */}
            <NavigationBar />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
