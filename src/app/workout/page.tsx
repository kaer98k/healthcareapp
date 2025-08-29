import WorkoutPage from '@/components/WorkoutPage'
import NavigationBar from '@/components/NavigationBar'

export default function WorkoutPageRoute() {
  return (
    <div className="app-container">
      <main className="flex-1 p-6 pb-24">
        <WorkoutPage />
      </main>
      <NavigationBar />
    </div>
  )
}
