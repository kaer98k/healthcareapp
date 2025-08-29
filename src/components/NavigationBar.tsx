'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NavigationBar: React.FC = () => {
  const pathname = usePathname()
  const authRoutes = ['/login', '/email-login', '/signup']
  
  // 인증 관련 페이지에서는 네비게이션 바를 숨김
  if (authRoutes.includes(pathname)) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border shadow-lg">
      <div className="flex justify-around items-center py-3 px-4 bg-background">
        {/* 운동 일지 */}
        <Link 
          href="/" 
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105"
        >
          <div className="text-2xl">📝</div>
          <span className="text-xs font-medium text-foreground">운동 일지</span>
        </Link>

        {/* 커뮤니티 */}
        <Link 
          href="/community" 
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105"
        >
          <div className="text-2xl">👥</div>
          <span className="text-xs font-medium text-foreground">커뮤니티</span>
        </Link>

        {/* 챌린지 */}
        <Link 
          href="/workout" 
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105"
        >
          <div className="text-2xl">🏆</div>
          <span className="text-xs font-medium text-foreground">챌린지</span>
        </Link>

        {/* 설정 */}
        <Link 
          href="/settings" 
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105"
        >
          <div className="text-2xl">⚙️</div>
          <span className="text-xs font-medium text-foreground">설정</span>
        </Link>
      </div>
    </nav>
  )
}

export default NavigationBar
