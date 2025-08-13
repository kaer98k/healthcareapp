// Supabase 데이터베이스 스키마 타입 정의

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          profile: UserProfile | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          profile?: UserProfile | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          profile?: UserProfile | null
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          type: string
          exercises: Exercise[]
          duration: number
          difficulty: string
          calories: number
          description: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          exercises: Exercise[]
          duration: number
          difficulty: string
          calories: number
          description: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          exercises?: Exercise[]
          duration?: number
          difficulty?: string
          calories?: number
          description?: string
          completed_at?: string | null
          created_at?: string
        }
      }
      exercise_logs: {
        Row: {
          id: string
          user_id: string
          workout_id: string
          exercise_name: string
          sets: number
          reps: number
          weight: number | null
          time: number | null
          rest_time: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_id: string
          exercise_name: string
          sets: number
          reps: number
          weight?: number | null
          time?: number | null
          rest_time: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string
          exercise_name?: string
          sets?: number
          reps?: number
          weight?: number | null
          time?: number | null
          rest_time?: number
          notes?: string | null
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          gender: 'male' | 'female' | 'other'
          height: number
          weight: number
          fitness_goal: string
          experience: 'beginner' | 'intermediate' | 'advanced'
          equipment: string
          available_time: number
          medical_conditions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age: number
          gender: 'male' | 'female' | 'other'
          height: number
          weight: number
          fitness_goal: string
          experience: 'beginner' | 'intermediate' | 'advanced'
          equipment: string
          available_time: number
          medical_conditions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age?: number
          gender?: 'male' | 'female' | 'other'
          height?: number
          weight?: number
          fitness_goal?: string
          experience?: 'beginner' | 'intermediate' | 'advanced'
          equipment?: string
          available_time?: number
          medical_conditions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 공통 타입 정의
export interface UserProfile {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number
  weight: number
  fitness_goal: string
  experience: 'beginner' | 'intermediate' | 'advanced'
  equipment: string
  available_time: number
  medical_conditions?: string
}

export interface Exercise {
  name: string
  sets?: number
  reps?: number
  weight?: number
  time?: number
  intensity?: string
  description: string
  rest_time: number
  progression?: string
}

export interface WorkoutRecommendation {
  type: string
  exercises: Exercise[]
  duration: number
  difficulty: string
  calories: number
  description: string
}

// Supabase 테이블 타입 추출
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// 사용자 정의 타입
export type User = Tables<'users'>
export type Workout = Tables<'workouts'>
export type ExerciseLog = Tables<'exercise_logs'>
export type UserProfileRow = Tables<'user_profiles'>
