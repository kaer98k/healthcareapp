'use client'

import Dashboard from '@/components/Dashboard'
import NavigationBar from '@/components/NavigationBar'

export default function CommunityPage() {
  return (
    <div className="app-container">
      <main className="flex-1 p-6 pb-24">
        <Dashboard />
      </main>
      <NavigationBar />
    </div>
  )
}
