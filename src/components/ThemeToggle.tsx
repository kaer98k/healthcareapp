import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  const handleToggle = () => {
    console.log('테마 토글 버튼 클릭됨, 현재 테마:', theme) // 디버깅 로그
    toggleTheme()
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return (
          // 다크모드 아이콘 (달)
          <svg 
            className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )
      case 'dark':
        return (
          // 커뮤니티 아이콘 (사용자들)
          <svg 
            className="w-6 h-6 text-blue-500 group-hover:text-blue-600 transition-colors" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        )
      case 'community':
        return (
          // 라이트모드 아이콘 (태양)
          <svg 
            className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 transition-colors" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '다크 모드로 전환'
      case 'dark':
        return '커뮤니티 모드로 전환'
      case 'community':
        return '라이트 모드로 전환'
      default:
        return '테마 전환'
    }
  }

  return (
    <button
      onClick={handleToggle}
      className="fixed top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 z-50 group"
      aria-label={getThemeLabel()}
      title={getThemeLabel()}
    >
      {getThemeIcon()}
    </button>
  )
}
