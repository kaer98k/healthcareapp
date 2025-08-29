import ConfigDebugger from '@/components/ConfigDebugger'
import NavigationBar from '@/components/NavigationBar'

export default function SettingsPage() {
  return (
    <div className="app-container">
      <main className="flex-1 p-6 pb-24">
        <ConfigDebugger />
      </main>
      <NavigationBar />
    </div>
  )
}
