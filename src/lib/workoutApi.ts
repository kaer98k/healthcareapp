import { supabase } from './supabase'
import { WorkoutRecord, CreateWorkoutRecord, UpdateWorkoutRecord } from '@/types/workout'

// 운동 기록 저장
export const saveWorkoutRecord = async (workout: CreateWorkoutRecord): Promise<{ data: WorkoutRecord | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('workout_records')
      .insert([workout])
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('운동 기록 저장 오류:', error)
    return { data: null, error }
  }
}

// 사용자의 운동 기록 조회
export const getUserWorkoutRecords = async (): Promise<{ data: WorkoutRecord[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('workout_records')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('운동 기록 조회 오류:', error)
    return { data: null, error }
  }
}

// 운동 기록 업데이트
export const updateWorkoutRecord = async (id: string, updates: UpdateWorkoutRecord): Promise<{ data: WorkoutRecord | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('workout_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('운동 기록 업데이트 오류:', error)
    return { data: null, error }
  }
}

// 운동 기록 삭제
export const deleteWorkoutRecord = async (id: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('workout_records')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('운동 기록 삭제 오류:', error)
    return { error }
  }
}

// 운동 기록 통계 조회
export const getWorkoutStats = async (): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('workout_records')
      .select('exercise_type, duration, calories_burned, created_at')

    if (error) throw error

    // 통계 계산
    const stats = {
      totalWorkouts: data.length,
      totalDuration: data.reduce((sum, record) => sum + record.duration, 0),
      totalCalories: data.reduce((sum, record) => sum + (record.calories_burned || 0), 0),
      exerciseTypes: data.reduce((acc, record) => {
        acc[record.exercise_type] = (acc[record.exercise_type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      weeklyData: getWeeklyData(data)
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error('운동 통계 조회 오류:', error)
    return { data: null, error }
  }
}

// 주간 데이터 계산
const getWeeklyData = (records: any[]) => {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const weeklyRecords = records.filter(record => 
    new Date(record.created_at) >= weekAgo
  )

  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayRecords = weeklyRecords.filter(record => 
      new Date(record.created_at).toDateString() === date.toDateString()
    )
    
    return {
      date: date.toISOString().split('T')[0],
      duration: dayRecords.reduce((sum, record) => sum + record.duration, 0),
      calories: dayRecords.reduce((sum, record) => sum + (record.calories_burned || 0), 0),
      workouts: dayRecords.length
    }
  }).reverse()

  return dailyData
}
