'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark' | 'community'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark' | 'community') => void
}

const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'community',
  toggleTheme: () => {},
  setTheme: () => {}
})

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
  const [theme, setThemeState] = useState<'light' | 'dark' | 'community'>('community')

  // 로컬 스토리지에서 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'community' | null
    if (savedTheme) {
      setThemeState(savedTheme)
    }
  }, [])

  // 테마 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('theme', theme)
    // 테마에 따른 CSS 변수 설정
    updateCSSVariables(theme)
  }, [theme])

  const updateCSSVariables = (currentTheme: 'light' | 'dark' | 'community') => {
    const root = document.documentElement
    
    if (currentTheme === 'community') {
      // 커뮤니티 테마 - 미래지향적 색상 팔레트
      root.style.setProperty('--background', '0 0% 100%')
      root.style.setProperty('--foreground', '222.2 84% 4.9%')
      root.style.setProperty('--card', '0 0% 100%')
      root.style.setProperty('--card-foreground', '222.2 84% 4.9%')
      root.style.setProperty('--popover', '0 0% 100%')
      root.style.setProperty('--popover-foreground', '222.2 84% 4.9%')
      root.style.setProperty('--primary', '217.2 91.2% 59.8%') // 밝은 파란색
      root.style.setProperty('--primary-foreground', '210 40% 98%')
      root.style.setProperty('--secondary', '210 40% 96%')
      root.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%')
      root.style.setProperty('--muted', '210 40% 96%')
      root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%')
      root.style.setProperty('--accent', '210 40% 96%')
      root.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%')
      root.style.setProperty('--destructive', '0 84.2% 60.2%')
      root.style.setProperty('--destructive-foreground', '210 40% 98%')
      root.style.setProperty('--border', '214.3 31.8% 91.4%')
      root.style.setProperty('--input', '214.3 31.8% 91.4%')
      root.style.setProperty('--ring', '217.2 91.2% 59.8%')
      root.style.setProperty('--radius', '0.5rem')
    } else if (currentTheme === 'dark') {
      // 다크 테마
      root.style.setProperty('--background', '222.2 84% 4.9%')
      root.style.setProperty('--foreground', '210 40% 98%')
      root.style.setProperty('--card', '222.2 84% 4.9%')
      root.style.setProperty('--card-foreground', '210 40% 98%')
      root.style.setProperty('--popover', '222.2 84% 4.9%')
      root.style.setProperty('--popover-foreground', '210 40% 98%')
      root.style.setProperty('--primary', '217.2 91.2% 59.8%')
      root.style.setProperty('--primary-foreground', '222.2 47.4% 11.2%')
      root.style.setProperty('--secondary', '217.2 32.6% 17.5%')
      root.style.setProperty('--secondary-foreground', '210 40% 98%')
      root.style.setProperty('--muted', '217.2 32.6% 17.5%')
      root.style.setProperty('--muted-foreground', '215 20.2% 65.1%')
      root.style.setProperty('--accent', '217.2 32.6% 17.5%')
      root.style.setProperty('--accent-foreground', '210 40% 98%')
      root.style.setProperty('--destructive', '0 62.8% 30.6%')
      root.style.setProperty('--destructive-foreground', '210 40% 98%')
      root.style.setProperty('--border', '217.2 32.6% 17.5%')
      root.style.setProperty('--input', '217.2 32.6% 17.5%')
      root.style.setProperty('--ring', '217.2 91.2% 59.8%')
    } else {
      // 라이트 테마
      root.style.setProperty('--background', '0 0% 100%')
      root.style.setProperty('--foreground', '222.2 84% 4.9%')
      root.style.setProperty('--card', '0 0% 100%')
      root.style.setProperty('--card-foreground', '222.2 84% 4.9%')
      root.style.setProperty('--popover', '0 0% 100%')
      root.style.setProperty('--popover-foreground', '222.2 84% 4.9%')
      root.style.setProperty('--primary', '222.2 47.4% 11.2%')
      root.style.setProperty('--primary-foreground', '210 40% 98%')
      root.style.setProperty('--secondary', '210 40% 96%')
      root.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%')
      root.style.setProperty('--muted', '210 40% 96%')
      root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%')
      root.style.setProperty('--accent', '210 40% 96%')
      root.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%')
      root.style.setProperty('--destructive', '0 84.2% 60.2%')
      root.style.setProperty('--destructive-foreground', '210 40% 98%')
      root.style.setProperty('--border', '214.3 31.8% 91.4%')
      root.style.setProperty('--input', '214.3 31.8% 91.4%')
      root.style.setProperty('--ring', '222.2 84% 4.9%')
    }
  }

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'community'
      return 'light'
    })
  }

  const setTheme = (newTheme: 'light' | 'dark' | 'community') => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
