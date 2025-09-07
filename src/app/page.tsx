'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import NavigationBar from '@/components/NavigationBar'
import { StepTracker } from '@/components/StepTracker'
import { useStepTracker } from '@/hooks/useStepTracker'
import { saveWorkoutRecord, getUserWorkoutRecords } from '@/lib/workoutApi'
import { WorkoutRecord } from '@/types/workout'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [workoutMemo, setWorkoutMemo] = useState('')
  const [workoutRating, setWorkoutRating] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [workoutHistory, setWorkoutHistory] = useState<Array<{
    id: string
    date: string
    memo: string
    rating: number
  }>>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editMemo, setEditMemo] = useState('')
  const [editRating, setEditRating] = useState(0)
  const [weeklyGoal, setWeeklyGoal] = useState(100000)
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [tempGoal, setTempGoal] = useState('')
  const [weeklySteps, setWeeklySteps] = useState([8500, 12000, 6500, 15000, 11000, 18000, 9000])
  const router = useRouter()
  
  // 걸음수 추적 Hook 사용
  const { stepData } = useStepTracker()

  // 실시간 걸음수를 주간 걸음수에 반영
  useEffect(() => {
    const today = new Date().getDay() // 0=일요일, 1=월요일, ..., 6=토요일
    const todayIndex = today === 0 ? 6 : today - 1 // 일요일을 마지막 인덱스로 조정
    
    setWeeklySteps(prev => {
      const newWeeklySteps = [...prev]
      newWeeklySteps[todayIndex] = stepData.steps
      return newWeeklySteps
    })
  }, [stepData.steps])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (!session) {
          router.push('/login')
          return
        }

        setUser(session.user)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // 운동 기록 저장 함수
  const handleSaveWorkout = async () => {
    if (workoutMemo.trim() && workoutRating > 0) {
      try {
        // 걸음수 기반으로 운동 시간과 칼로리 계산
        const estimatedDuration = Math.max(10, Math.floor(stepData.steps / 100)) // 최소 10분
        const estimatedCalories = Math.floor(stepData.steps * 0.04) // 걸음수 * 0.04칼로리

        const workoutData = {
          exercise_type: '걷기',
          duration: estimatedDuration,
          calories_burned: estimatedCalories,
          notes: `메모: ${workoutMemo}, 평점: ${workoutRating}/5`
        }

        const { data, error } = await saveWorkoutRecord(workoutData)
        
        if (error) {
          console.error('운동 기록 저장 실패:', error)
          alert('운동 기록 저장에 실패했습니다.')
          return
        }

        // 로컬 상태 업데이트
        const newWorkout = {
          id: data?.id || Date.now().toString(),
          date: new Date().toLocaleDateString('ko-KR'),
          memo: workoutMemo,
          rating: workoutRating
        }
        
        setWorkoutHistory(prev => [newWorkout, ...prev])
        
        if (process.env.NODE_ENV === 'development') {
          console.log('운동 기록 저장:', newWorkout)
        }
        setIsSaved(true)
        
        // 3초 후 저장 완료 메시지 숨기기
        setTimeout(() => {
          setIsSaved(false)
          setWorkoutMemo('')
          setWorkoutRating(0)
        }, 3000)
      } catch (error) {
        console.error('운동 기록 저장 오류:', error)
        alert('운동 기록 저장 중 오류가 발생했습니다.')
      }
    } else {
      alert('운동 기록과 평가를 모두 입력해주세요.')
    }
  }

  // 평가 이모지 반환 함수
  const getRatingEmoji = (rating: number) => {
    switch (rating) {
      case 1: return '😫'
      case 2: return '😔'
      case 3: return '😐'
      case 4: return '😊'
      case 5: return '🤩'
      default: return '😐'
    }
  }

  // 수정 모드 시작
  const startEdit = (workout: any) => {
    setEditingId(workout.id)
    setEditMemo(workout.memo)
    setEditRating(workout.rating)
  }

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null)
    setEditMemo('')
    setEditRating(0)
  }

  // 수정 저장
  const saveEdit = () => {
    if (editMemo.trim() && editRating > 0) {
      setWorkoutHistory(prev => 
        prev.map(workout => 
          workout.id === editingId 
            ? { ...workout, memo: editMemo, rating: editRating }
            : workout
        )
      )
      setEditingId(null)
      setEditMemo('')
      setEditRating(0)
    } else {
      alert('운동 기록과 평가를 모두 입력해주세요.')
    }
  }

  // 운동 기록 삭제
  const deleteWorkout = (id: string) => {
    if (confirm('정말로 이 운동 기록을 삭제하시겠습니까?')) {
      setWorkoutHistory(prev => prev.filter(workout => workout.id !== id))
    }
  }

  // 목표 편집 시작
  const startEditGoal = () => {
    setIsEditingGoal(true)
    setTempGoal(weeklyGoal.toString())
  }

  // 목표 편집 취소
  const cancelEditGoal = () => {
    setIsEditingGoal(false)
    setTempGoal('')
  }

  // 목표 저장
  const saveGoal = () => {
    const newGoal = parseInt(tempGoal)
    if (newGoal > 0) {
      setWeeklyGoal(newGoal)
      setIsEditingGoal(false)
      setTempGoal('')
    } else {
      alert('올바른 목표를 입력해주세요.')
    }
  }

  // 현재 주간 걸음수 계산
  const getCurrentWeeklySteps = () => {
    return weeklySteps.reduce((total, steps) => total + steps, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="app-container">
      <main className="flex-1 p-3 sm:p-6 pb-24 bg-black text-white relative overflow-hidden">
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* 왼쪽 원형 장식 */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 left-20 w-16 h-16 border border-blue-500/20 rounded-full animate-pulse delay-1000"></div>
          
          {/* 오른쪽 원형 장식 */}
          <div className="absolute top-40 right-16 w-24 h-24 border border-purple-500/20 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-60 right-8 w-12 h-12 border border-blue-500/20 rounded-full animate-pulse delay-1500"></div>
          
          {/* 작은 점들 */}
          <div className="absolute top-16 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-32 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-1000"></div>
          
          {/* 연결선들 */}
          <div className="absolute top-40 left-1/4 w-px h-20 bg-gradient-to-b from-purple-500/30 to-transparent"></div>
          <div className="absolute top-60 right-1/3 w-px h-16 bg-gradient-to-b from-blue-500/30 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* 헤더 */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-pulse">
              WORKOUT DASHBOARD
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg px-4">오늘의 운동 현황을 실시간으로 모니터링하세요</p>
          </div>

          {/* 실시간 걸음수 추적 */}
          <div className="mb-6 sm:mb-8">
            <StepTracker />
          </div>

          {/* 자유로운 운동 기록 메모장 */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-purple-500/20 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">📝 오늘의 운동 메모</h2>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">운동 기록</label>
                <textarea 
                  value={workoutMemo}
                  onChange={(e) => setWorkoutMemo(e.target.value)}
                  placeholder="오늘의 운동을 자유롭게 기록해보세요...&#10;&#10;예시:&#10;• 오전 7시 - 30분 러닝 (5km)&#10;• 오후 3시 - 웨이트 트레이닝 (가슴, 어깨)&#10;• 저녁 8시 - 요가 20분&#10;&#10;오늘의 목표: 10,000걸음 달성!&#10;느낀 점: 러닝이 점점 편해지고 있다. 내일은 더 오래 뛰어보자."
                  className="w-full h-48 sm:h-56 lg:h-64 px-3 sm:px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 resize-none text-sm sm:text-base"
                />
              </div>
              
              {/* 운동 평가 섹션 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-4">오늘의 운동 평가</label>
                <div className="flex justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setWorkoutRating(rating)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-white text-base sm:text-lg font-bold group ${
                        workoutRating === rating
                          ? 'border-purple-500 bg-purple-600/30 shadow-lg shadow-purple-500/25'
                          : 'border-gray-600 bg-gray-800/50 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                      title={`${rating}점 - ${rating === 1 ? '매우 나쁨' : rating === 2 ? '나쁨' : rating === 3 ? '보통' : rating === 4 ? '좋음' : '매우 좋음'}`}
                    >
                      {rating === 1 && '😫'}
                      {rating === 2 && '😔'}
                      {rating === 3 && '😐'}
                      {rating === 4 && '😊'}
                      {rating === 5 && '🤩'}
                    </button>
                  ))}
            </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>매우 나쁨</span>
                  <span>매우 좋음</span>
              </div>
            </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                <div className="text-xs sm:text-sm text-gray-400">
                  💡 팁: 자유롭게 운동 내용, 목표, 느낀 점 등을 기록하세요
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                  {isSaved && (
                    <div className="text-green-400 text-xs sm:text-sm flex items-center">
                      ✅ 저장 완료!
                    </div>
                  )}
                  <button 
                    onClick={handleSaveWorkout}
                    className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold text-sm sm:text-base flex-1 sm:flex-none"
                  >
                    저장하기
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* 주간 걸음수 차트 */}
          <div className="mt-6 sm:mt-8">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-purple-500/10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">🚶‍♂️ 주간 걸음수</h3>
              <div className="relative h-32 sm:h-36 lg:h-40 mb-4">
                <svg className="w-full h-full" viewBox="0 0 400 120">
                  {/* 배경 그리드 */}
                  <defs>
                    <linearGradient id="stepGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9"/>
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.7"/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5"/>
                    </linearGradient>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* 수평 그리드 라인 */}
                  {[0, 25, 50, 75, 100].map((y, i) => (
                    <line
                      key={i}
                      x1="40" y1={20 + y * 0.8}
                      x2="360" y2={20 + y * 0.8}
                      stroke="rgba(156, 163, 175, 0.2)"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* 걸음수 데이터 */}
                  {(() => {
                    const stepData = [
                      { day: '월', steps: weeklySteps[0] },
                      { day: '화', steps: weeklySteps[1] },
                      { day: '수', steps: weeklySteps[2] },
                      { day: '목', steps: weeklySteps[3] },
                      { day: '금', steps: weeklySteps[4] },
                      { day: '토', steps: weeklySteps[5] },
                      { day: '일', steps: weeklySteps[6] }
                    ]
                    
                    const maxSteps = 20000
                    
                    // 부드러운 파도 모양 곡선 생성
                    const createWaveCurve = (points: { x: number; y: number }[]) => {
                      if (points.length < 2) return ''
                      
                      let path = `M ${points[0].x} ${points[0].y}`
                      
                      for (let i = 1; i < points.length; i++) {
                        const prev = points[i - 1]
                        const curr = points[i]
                        
                        // 파도 모양을 위한 제어점 계산
                        const midX = (prev.x + curr.x) / 2
                        const waveHeight = Math.abs(curr.y - prev.y) * 0.3
                        const waveY = Math.min(prev.y, curr.y) - waveHeight
                        
                        const cp1x = prev.x + (curr.x - prev.x) * 0.3
                        const cp1y = prev.y
                        const cp2x = curr.x - (curr.x - prev.x) * 0.3
                        const cp2y = curr.y
                        
                        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
                      }
                      
                      return path
                    }
                    
                    const points = stepData.map((data, index) => ({
                      x: 40 + (index * 45),
                      y: 100 - (data.steps / maxSteps) * 80
                    }))
                    
                    const wavePath = createWaveCurve(points)
                    
                    return (
                      <>
                        {/* 부드러운 파도 그래프 */}
                        <path
                          d={wavePath}
                          fill="none"
                          stroke="url(#waveGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#glow)"
                          className="animate-pulse"
                        />
                        
                        {/* 두 번째 파도 레이어 */}
                        <path
                          d={wavePath}
                          fill="none"
                          stroke="url(#waveGradient2)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.6"
                          className="animate-pulse delay-500"
                        />
                        
                        {/* 데이터 포인트와 레이블 */}
                        {stepData.map((data, index) => {
                          const x = 40 + (index * 45)
                          const y = 100 - (data.steps / maxSteps) * 80
                          return (
                            <g key={index}>
                              <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#8b5cf6"
                                stroke="#000"
                                strokeWidth="2"
                                className="hover:r-6 transition-all duration-300"
                              />
                              <circle
                                cx={x}
                                cy={y}
                                r="8"
                                fill="#8b5cf6"
                                opacity="0.3"
                                className="animate-pulse"
                              />
                              {/* 데이터 레이블 */}
                              <text
                                x={x}
                                y={y - 15}
                                textAnchor="middle"
                                className="text-xs fill-white font-semibold"
                                style={{ fontSize: '10px' }}
                              >
                                {data.steps.toLocaleString()}
                              </text>
                            </g>
                          )
                        })}
                      </>
                    )
                  })()}
                </svg>
              </div>
              
              {/* 요일별 걸음수 표시 */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {[
                  { day: '월', steps: weeklySteps[0] },
                  { day: '화', steps: weeklySteps[1] },
                  { day: '수', steps: weeklySteps[2] },
                  { day: '목', steps: weeklySteps[3] },
                  { day: '금', steps: weeklySteps[4] },
                  { day: '토', steps: weeklySteps[5] },
                  { day: '일', steps: weeklySteps[6] }
                ].map((data, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-black border-2 border-purple-500 rounded-lg p-2 sm:p-3 mb-2 shadow-lg shadow-purple-500/25">
                      <div className="text-white font-bold text-xs sm:text-sm">
                        {data.steps.toLocaleString()}
                      </div>
                      <div className="text-white/80 text-xs">걸음</div>
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm font-medium">
                      {data.day}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 주간 목표 표시 */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    {isEditingGoal ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={tempGoal}
                          onChange={(e) => setTempGoal(e.target.value)}
                          className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-purple-500 focus:outline-none"
                          placeholder="목표"
                        />
                        <span className="text-gray-400">걸음</span>
                        <button
                          onClick={saveGoal}
                          className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors duration-200"
                        >
                          저장
                        </button>
                        <button
                          onClick={cancelEditGoal}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors duration-200"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">주간 목표: {weeklyGoal.toLocaleString()}걸음</span>
                        <button
                          onClick={startEditGoal}
                          className="text-purple-400 hover:text-purple-300 text-xs underline transition-colors duration-200"
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-purple-400 font-semibold">
                    현재: {getCurrentWeeklySteps().toLocaleString()}걸음 ({Math.round((getCurrentWeeklySteps() / weeklyGoal) * 100)}%)
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((getCurrentWeeklySteps() / weeklyGoal) * 100, 100)}%` }}
                  ></div>
              </div>
              </div>
            </div>
          </div>

          {/* 운동 일지 기록 */}
          {workoutHistory.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-purple-500/10">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📚 운동 일지 기록</h3>
                <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                  {workoutHistory.map((workout) => (
                    <div key={workout.id} className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs sm:text-sm text-gray-400">{workout.date}</span>
                          <span className="text-lg">{getRatingEmoji(workout.rating)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs text-gray-500">
                            {workout.rating}점
                          </div>
                          <button
                            onClick={() => startEdit(workout)}
                            className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors duration-200"
                          >
                            수정하기
                          </button>
                          <button
                            onClick={() => deleteWorkout(workout.id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors duration-200"
                          >
                            삭제
              </button>
            </div>
          </div>

                      {editingId === workout.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editMemo}
                            onChange={(e) => setEditMemo(e.target.value)}
                            className="w-full h-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 resize-none text-sm"
                            placeholder="운동 기록을 수정하세요..."
                          />
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">평가:</span>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  onClick={() => setEditRating(rating)}
                                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-white text-sm ${
                                    editRating === rating
                                      ? 'border-purple-500 bg-purple-600/30'
                                      : 'border-gray-600 bg-gray-800/50 hover:bg-purple-600/20'
                                  }`}
                                >
                                  {getRatingEmoji(rating)}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-200"
                            >
                              취소
                            </button>
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors duration-200"
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {workout.memo}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {workoutHistory.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📝</div>
                    <p className="text-gray-400 text-sm sm:text-base">아직 운동 기록이 없습니다.</p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">위에서 첫 번째 운동을 기록해보세요!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <NavigationBar />
    </div>
  )
}
