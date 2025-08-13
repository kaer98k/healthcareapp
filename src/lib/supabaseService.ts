import { supabase } from './supabase'
import type { 
  UserProfile, 
  Exercise, 
  WorkoutRecommendation,
  Inserts,
  Updates,
  Tables
} from '../types/database'

// 사용자 프로필 관련 서비스
export class UserProfileService {
  // 사용자 프로필 조회
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('사용자 프로필 조회 오류:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('사용자 프로필 조회 예외:', error)
      return null
    }
  }

  // 사용자 프로필 생성/업데이트
  static async upsertUserProfile(profile: Inserts<'user_profiles'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert(profile, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('사용자 프로필 저장 오류:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('사용자 프로필 저장 예외:', error)
      return false
    }
  }

  // 사용자 프로필 삭제
  static async deleteUserProfile(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('사용자 프로필 삭제 오류:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('사용자 프로필 삭제 예외:', error)
      return false
    }
  }
}

// 운동 추천 관련 서비스
export class WorkoutService {
  // 운동 추천 저장
  static async saveWorkoutRecommendation(
    userId: string, 
    recommendation: WorkoutRecommendation
  ): Promise<string | null> {
    try {
      const workoutData: Inserts<'workouts'> = {
        user_id: userId,
        type: recommendation.type,
        exercises: recommendation.exercises,
        duration: recommendation.duration,
        difficulty: recommendation.difficulty,
        calories: recommendation.calories,
        description: recommendation.description
      }

      const { data, error } = await supabase
        .from('workouts')
        .insert(workoutData)
        .select('id')
        .single()

      if (error) {
        console.error('운동 추천 저장 오류:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('운동 추천 저장 예외:', error)
      return null
    }
  }

  // 사용자의 운동 기록 조회
  static async getUserWorkouts(userId: string): Promise<Tables<'workouts'>[]> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('운동 기록 조회 오류:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('운동 기록 조회 예외:', error)
      return []
    }
  }

  // 운동 완료 처리
  static async completeWorkout(workoutId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workouts')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', workoutId)

      if (error) {
        console.error('운동 완료 처리 오류:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('운동 완료 처리 예외:', error)
      return false
    }
  }

  // 운동 기록 삭제
  static async deleteWorkout(workoutId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)

      if (error) {
        console.error('운동 기록 삭제 오류:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('운동 기록 삭제 예외:', error)
      return false
    }
  }
}

// 운동 로그 관련 서비스
export class ExerciseLogService {
  // 운동 세트 로그 저장
  static async saveExerciseLog(log: Inserts<'exercise_logs'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('exercise_logs')
        .insert(log)
        .select('id')
        .single()

      if (error) {
        console.error('운동 로그 저장 오류:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('운동 로그 저장 예외:', error)
      return null
    }
  }

  // 운동별 로그 조회
  static async getExerciseLogs(workoutId: string): Promise<Tables<'exercise_logs'>[]> {
    try {
      const { data, error } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('workout_id', workoutId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('운동 로그 조회 오류:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('운동 로그 조회 예외:', error)
      return []
    }
  }

  // 운동 로그 업데이트
  static async updateExerciseLog(
    logId: string, 
    updates: Updates<'exercise_logs'>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('exercise_logs')
        .update(updates)
        .eq('id', logId)

      if (error) {
        console.error('운동 로그 업데이트 오류:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('운동 로그 업데이트 예외:', error)
      return false
    }
  }

  // 운동 로그 삭제
  static async deleteExerciseLog(logId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('exercise_logs')
        .delete()
        .eq('id', logId)

      if (error) {
        console.error('운동 로그 삭제 오류:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('운동 로그 삭제 예외:', error)
      return false
    }
  }
}

// 통계 및 분석 서비스
export class AnalyticsService {
  // 사용자 운동 통계 조회
  static async getUserWorkoutStats(userId: string): Promise<{
    totalWorkouts: number
    totalCalories: number
    averageDuration: number
    favoriteType: string
  }> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        console.error('운동 통계 조회 오류:', error)
        return {
          totalWorkouts: 0,
          totalCalories: 0,
          averageDuration: 0,
          favoriteType: '없음'
        }
      }

      if (!data || data.length === 0) {
        return {
          totalWorkouts: 0,
          totalCalories: 0,
          averageDuration: 0,
          favoriteType: '없음'
        }
      }

      const totalWorkouts = data.length
      const totalCalories = data.reduce((sum, workout) => sum + workout.calories, 0)
      const averageDuration = data.reduce((sum, workout) => sum + workout.duration, 0) / totalWorkouts

      // 가장 많이 한 운동 타입 찾기
      const typeCounts = data.reduce((acc, workout) => {
        acc[workout.type] = (acc[workout.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const favoriteType = Object.entries(typeCounts).reduce((a, b) => 
        typeCounts[a[0]] > typeCounts[b[0]] ? a : b
      )[0]

      return {
        totalWorkouts,
        totalCalories,
        averageDuration: Math.round(averageDuration),
        favoriteType
      }
    } catch (error) {
      console.error('운동 통계 조회 예외:', error)
      return {
        totalWorkouts: 0,
        totalCalories: 0,
        averageDuration: 0,
        favoriteType: '없음'
      }
    }
  }
}
