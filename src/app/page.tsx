'use client'

import { useRouter } from 'next/navigation'
import { useLocation } from '@/hooks/useLocation'
import WorkoutLog from '@/components/WorkoutLog'
import Dashboard from '@/components/Dashboard'
import WorkoutPage from '@/components/WorkoutPage'
import ConfigDebugger from '@/components/ConfigDebugger'
import NavigationBar from '@/components/NavigationBar'

export default function HomePage() {
  const router = useRouter()
  const { pathname } = useLocation()

  // 현재 경로에 따라 컴포넌트 렌더링
  const renderComponent = () => {
    switch (pathname) {
      case '/':
        return <WorkoutLog />
      case '/community':
        return <Dashboard />
      case '/workout':
        return <WorkoutPage />
      case '/settings':
        return <ConfigDebugger />
      default:
        return <WorkoutLog />
    }
  }

  return (
    <div className="app-container">
      <main className="flex-1 p-6 pb-24">
        {renderComponent()}
      </main>
      <NavigationBar />
    </div>
  )
}
