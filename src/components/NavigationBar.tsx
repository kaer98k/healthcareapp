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
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 z-50">
      <div className="flex justify-around items-center py-3 px-4 bg-gray-900/95 backdrop-blur-sm">
        {/* 운동 일지 */}
        <Link 
          href="/" 
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            pathname === '/' 
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <div className="text-2xl">📝</div>
          <span className="text-xs font-medium">운동 일지</span>
        </Link>

        {/* 커뮤니티 */}
        <Link 
          href="/community" 
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            pathname === '/community' 
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <div className="text-2xl">👥</div>
          <span className="text-xs font-medium">커뮤니티</span>
        </Link>

        {/* 챌린지 */}
        <Link 
          href="/challenge" 
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            pathname === '/challenge' 
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <div className="text-2xl">🏆</div>
          <span className="text-xs font-medium">챌린지</span>
        </Link>

        {/* 프로필 */}
        <Link 
          href="/profile" 
          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            pathname === '/profile' 
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <div className="text-2xl">👤</div>
          <span className="text-xs font-medium">프로필</span>
        </Link>

      </div>
    </nav>
  )
}

export default NavigationBar
