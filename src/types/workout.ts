// 운동 기록 타입 정의
export interface WorkoutRecord {
  id?: string
  user_id?: string
  exercise_type: string
  duration: number // 분 단위
  calories_burned?: number
  notes?: string
  created_at?: string
  updated_at?: string
}

// 운동 기록 생성 타입
export interface CreateWorkoutRecord {
  exercise_type: string
  duration: number
  calories_burned?: number
  notes?: string
}

// 운동 기록 업데이트 타입
export interface UpdateWorkoutRecord {
  exercise_type?: string
  duration?: number
  calories_burned?: number
  notes?: string
}
