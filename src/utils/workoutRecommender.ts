// 인라인 타입 정의
interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number; // kg
  time?: number; // 분
  intensity?: string;
  description: string;
  restTime: number; // 초
  progression?: string;
}

interface WorkoutRecommendation {
  type: string;
  exercises: Exercise[];
  duration: number; // 분
  difficulty: string;
  calories: number;
  description: string;
}

// 운동 데이터베이스
const exerciseDatabase = {
  strength: {
    beginner: [
      {
        name: "스쿼트",
        sets: 3,
        reps: 10,
        description: "하체 근력 강화의 기본 운동",
        restTime: 90,
        progression: "무게를 점진적으로 증가시키거나 세트 수를 늘리세요"
      },
      {
        name: "푸시업",
        sets: 3,
        reps: 8,
        description: "가슴과 삼두근 발달",
        restTime: 60,
        progression: "무릎 푸시업에서 시작하여 점진적으로 난이도를 높이세요"
      },
      {
        name: "플랭크",
        sets: 3,
        time: 30,
        description: "코어 강화 운동",
        restTime: 60,
        progression: "시간을 점진적으로 늘리세요"
      }
    ],
    intermediate: [
      {
        name: "바벨 스쿼트",
        sets: 4,
        reps: 8,
        description: "하체 근력과 전신 안정성 향상",
        restTime: 120,
        progression: "1RM의 70-80% 무게로 진행하세요"
      },
      {
        name: "벤치프레스",
        sets: 4,
        reps: 6,
        description: "가슴과 삼두근 발달",
        restTime: 120,
        progression: "1RM의 75-85% 무게로 진행하세요"
      },
      {
        name: "데드리프트",
        sets: 3,
        reps: 5,
        description: "전신 근력과 코어 강화",
        restTime: 180,
        progression: "1RM의 70-80% 무게로 진행하세요"
      }
    ],
    advanced: [
      {
        name: "파워리프팅 스쿼트",
        sets: 5,
        reps: 3,
        description: "최대 근력 향상",
        restTime: 180,
        progression: "1RM의 80-90% 무게로 진행하세요"
      },
      {
        name: "파워 클린",
        sets: 5,
        reps: 3,
        description: "폭발력과 전신 조화 향상",
        restTime: 180,
        progression: "1RM의 70-80% 무게로 진행하세요"
      }
    ]
  },
  cardio: {
    beginner: [
      {
        name: "빠른 걷기",
        time: 20,
        intensity: "낮음",
        description: "심폐지구력 향상의 시작점",
        restTime: 0,
        progression: "시간을 점진적으로 늘리거나 속도를 높이세요"
      },
      {
        name: "줄넘기",
        time: 10,
        intensity: "보통",
        description: "전신 조화와 민첩성 향상",
        restTime: 30,
        progression: "시간을 늘리거나 더 복잡한 동작을 추가하세요"
      }
    ],
    intermediate: [
      {
        name: "인터벌 러닝",
        time: 25,
        intensity: "높음",
        description: "고강도 인터벌로 심폐지구력 향상",
        restTime: 60,
        progression: "인터벌 시간을 늘리거나 휴식 시간을 줄이세요"
      },
      {
        name: "사이클",
        time: 30,
        intensity: "보통",
        description: "무릎 부담이 적은 유산소 운동",
        restTime: 0,
        progression: "저항을 높이거나 속도를 증가시키세요"
      }
    ],
    advanced: [
      {
        name: "버피",
        time: 20,
        intensity: "매우 높음",
        description: "고강도 전신 운동",
        restTime: 45,
        progression: "세트 수를 늘리거나 휴식 시간을 줄이세요"
      }
    ]
  },
  yoga: {
    beginner: [
      {
        name: "태양 경배 A",
        time: 5,
        description: "전신을 깨우고 에너지를 활성화",
        restTime: 30,
        progression: "동작을 더 천천히, 정확하게 수행하세요"
      },
      {
        name: "아이 자세",
        time: 3,
        description: "목과 어깨 긴장 완화",
        restTime: 20,
        progression: "유지 시간을 늘리세요"
      }
    ],
    intermediate: [
      {
        name: "전사 자세",
        time: 5,
        description: "하체 근력과 균형감각 향상",
        restTime: 45,
        progression: "더 깊은 자세로 들어가거나 유지 시간을 늘리세요"
      }
    ],
    advanced: [
      {
        name: "핸드스탠드",
        time: 10,
        description: "상체 근력과 균형감각 향상",
        restTime: 60,
        progression: "벽 없이 수행하거나 더 오래 유지하세요"
      }
    ]
  }
};

// 사용자 정보를 기반으로 운동 추천
export function recommendWorkout(userProfile: any, oneRMData: any): WorkoutRecommendation[] {
  const recommendations: WorkoutRecommendation[] = [];
  
  // 목표에 따른 운동 타입 결정
  const workoutTypes = getWorkoutTypesByGoal(userProfile.fitnessGoal);
  
  workoutTypes.forEach(type => {
    const exercises = getExercisesByTypeAndLevel(type, userProfile.experience, userProfile.equipment);
    const duration = calculateWorkoutDuration(exercises, userProfile.availableTime);
    const calories = calculateCaloriesBurned(userProfile, duration, type);
    
    recommendations.push({
      type: getWorkoutTypeName(type),
      exercises: exercises,
      duration: duration,
      difficulty: userProfile.experience,
      calories: calories,
      description: getWorkoutDescription(type, userProfile.fitnessGoal)
    });
  });
  
  return recommendations;
}

// 목표에 따른 운동 타입 결정
function getWorkoutTypesByGoal(goal: string): string[] {
  switch (goal) {
    case 'weight_loss':
      return ['cardio', 'strength'];
    case 'muscle_gain':
      return ['strength', 'cardio'];
    case 'strength':
      return ['strength'];
    case 'endurance':
      return ['cardio', 'strength'];
    case 'flexibility':
      return ['yoga', 'strength'];
    case 'general_fitness':
      return ['strength', 'cardio', 'yoga'];
    default:
      return ['strength', 'cardio'];
  }
}

// 운동 타입과 레벨에 따른 운동 선택
function getExercisesByTypeAndLevel(type: string, level: string, equipment: string): Exercise[] {
  const exercises = exerciseDatabase[type as keyof typeof exerciseDatabase]?.[level as keyof typeof exerciseDatabase.strength] || [];
  
  // 장비 제한에 따른 필터링
  if (equipment === 'none') {
    return exercises.filter(ex => 
      !ex.name.includes('바벨') && 
      !ex.name.includes('벤치') && 
      !ex.name.includes('데드리프트')
    );
  }
  
  return exercises;
}

// 운동 시간 계산
function calculateWorkoutDuration(exercises: Exercise[], availableTime: number): number {
  let totalTime = 0;
  
  exercises.forEach(exercise => {
    if (exercise.time) {
      totalTime += exercise.time;
    } else if (exercise.sets && exercise.reps) {
      // 세트당 약 2분 소요 가정
      totalTime += exercise.sets * 2;
    }
    totalTime += exercise.restTime / 60; // 휴식 시간을 분으로 변환
  });
  
  // 준비 운동과 정리 운동 시간 추가
  totalTime += 10;
  
  return Math.min(totalTime, availableTime);
}

// 칼로리 소모량 계산
function calculateCaloriesBurned(userProfile: any, duration: number, workoutType: string): number {
  const bmr = calculateBMR(userProfile);
  const met = getMETValue(workoutType, userProfile.experience);
  
  return Math.round((met * userProfile.weight * duration) / 60);
}

// 기초대사율(BMR) 계산
function calculateBMR(userProfile: any): number {
  if (userProfile.gender === 'male') {
    return 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age);
  } else {
    return 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age);
  }
}

// MET 값 (운동 강도)
function getMETValue(workoutType: string, experience: string): number {
  const baseMET = {
    strength: 3.5,
    cardio: 6.0,
    yoga: 2.5
  };
  
  const experienceMultiplier = {
    beginner: 0.8,
    intermediate: 1.0,
    advanced: 1.2
  };
  
  return baseMET[workoutType as keyof typeof baseMET] * experienceMultiplier[experience as keyof typeof experienceMultiplier];
}

// 운동 타입 이름
function getWorkoutTypeName(type: string): string {
  const names = {
    strength: '근력 운동',
    cardio: '유산소 운동',
    yoga: '요가 & 명상'
  };
  return names[type as keyof typeof names] || type;
}

// 운동 설명
function getWorkoutDescription(type: string, goal: string): string {
  const descriptions = {
    strength: '근력과 근지구력을 향상시키는 운동입니다.',
    cardio: '심폐지구력과 체지방 감소에 효과적입니다.',
    yoga: '유연성과 정신적 안정을 제공합니다.'
  };
  
  return descriptions[type as keyof typeof descriptions] || '';
}
