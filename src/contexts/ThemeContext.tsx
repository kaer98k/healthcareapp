import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 로컬 스토리지에서 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('theme') as Theme
    return savedTheme || 'light'
  })

  // 테마 변경 시 HTML 클래스와 로컬 스토리지 업데이트
  useEffect(() => {
    const root = window.document.documentElement
    
    console.log('테마 변경:', theme) // 디버깅 로그
    
    // 기존 테마 클래스 제거
    root.classList.remove('light', 'dark')
    
    // 새 테마 클래스 추가
    root.classList.add(theme)
    
    // 로컬 스토리지에 저장
    localStorage.setItem('theme', theme)
    
    console.log('HTML 클래스 업데이트 완료:', root.classList.toString()) // 디버깅 로그
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light')
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
