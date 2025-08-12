import React, { useState } from 'react';
// 타입은 any로 사용하여 import 문제 해결
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Yoga, Heart, Dumbbell } from './icons';

interface WorkoutRecommendationsProps {
  recommendations: any[];
  userProfile: any;
  onBack: () => void;
}

export const WorkoutRecommendations: React.FC<WorkoutRecommendationsProps> = ({
  recommendations,
  userProfile,
  onBack
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);

  const getWorkoutIcon = (type: string) => {
    if (type.includes('근력')) return <Dumbbell className="h-6 w-6" />;
    if (type.includes('유산소')) return <Heart className="h-6 w-6" />;
    if (type.includes('요가')) return <Yoga className="h-6 w-6" />;
    return <Dumbbell className="h-6 w-6" />;
  };

  const getWorkoutColor = (type: string) => {
    if (type.includes('근력')) return 'bg-blue-50 border-blue-200';
    if (type.includes('유산소')) return 'bg-red-50 border-red-200';
    if (type.includes('요가')) return 'bg-green-50 border-green-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getWorkoutTextColor = (type: string) => {
    if (type.includes('근력')) return 'text-blue-800';
    if (type.includes('유산소')) return 'text-red-800';
    if (type.includes('요가')) return 'text-green-800';
    return 'text-gray-800';
  };

  if (selectedWorkout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedWorkout(null)}>
            ← 추천 목록으로
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">{selectedWorkout.type}</h2>
        </div>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800">운동 개요</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">예상 소요 시간</p>
                <p className="text-2xl font-bold text-blue-600">{selectedWorkout.duration}분</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">예상 칼로리</p>
                <p className="text-2xl font-bold text-blue-600">{selectedWorkout.calories}kcal</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">난이도</p>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedWorkout.difficulty === 'beginner' ? '초보자' :
                   selectedWorkout.difficulty === 'intermediate' ? '중급자' : '고급자'}
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-lg">{selectedWorkout.description}</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">운동 루틴</h3>
          {selectedWorkout.exercises.map((exercise, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">{exercise.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {exercise.sets && exercise.reps && (
                      <p className="text-gray-700">
                        <span className="font-semibold">세트:</span> {exercise.sets}세트
                      </p>
                    )}
                    {exercise.sets && exercise.reps && (
                      <p className="text-gray-700">
                        <span className="font-semibold">반복:</span> {exercise.reps}회
                      </p>
                    )}
                    {exercise.time && (
                      <p className="text-gray-700">
                        <span className="font-semibold">시간:</span> {exercise.time}분
                      </p>
                    )}
                    {exercise.intensity && (
                      <p className="text-gray-700">
                        <span className="font-semibold">강도:</span> {exercise.intensity}
                      </p>
                    )}
                    <p className="text-gray-700">
                      <span className="font-semibold">휴식:</span> {exercise.restTime}초
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 italic">{exercise.description}</p>
                    {exercise.progression && (
                      <div className="mt-2 p-3 bg-blue-100 rounded-lg">
                        <p className="text-sm font-semibold text-blue-800">진행 방법:</p>
                        <p className="text-sm text-blue-700">{exercise.progression}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 운동 팁</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 운동 전후로 충분한 스트레칭을 해주세요</li>
            <li>• 적절한 휴식과 수분 섭취를 잊지 마세요</li>
            <li>• 본인의 체력에 맞는 강도로 시작하세요</li>
            <li>• 꾸준함이 가장 중요한 운동의 비결입니다</li>
            <li>• 통증이 느껴지면 즉시 운동을 중단하세요</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          안녕하세요, <span className="text-blue-600">{userProfile.name}</span>님! ✨
        </h2>
        <p className="text-xl text-gray-600">
          {userProfile.fitnessGoal === 'weight_loss' && '체중 감량을 위한 맞춤형 운동을 추천해드립니다!'}
          {userProfile.fitnessGoal === 'muscle_gain' && '근육량 증가를 위한 맞춤형 운동을 추천해드립니다!'}
          {userProfile.fitnessGoal === 'strength' && '근력 향상을 위한 맞춤형 운동을 추천해드립니다!'}
          {userProfile.fitnessGoal === 'endurance' && '지구력 향상을 위한 맞춤형 운동을 추천해드립니다!'}
          {userProfile.fitnessGoal === 'flexibility' && '유연성 향상을 위한 맞춤형 운동을 추천해드립니다!'}
          {userProfile.fitnessGoal === 'general_fitness' && '전반적인 건강을 위한 맞춤형 운동을 추천해드립니다!'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((recommendation, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${getWorkoutColor(recommendation.type)}`}
            onClick={() => setSelectedWorkout(recommendation)}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {getWorkoutIcon(recommendation.type)}
              </div>
              <CardTitle className={`text-xl ${getWorkoutTextColor(recommendation.type)}`}>
                {recommendation.type}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {recommendation.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-center">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">소요 시간:</span>
                  <span className="font-semibold text-gray-800">{recommendation.duration}분</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">예상 칼로리:</span>
                  <span className="font-semibold text-gray-800">{recommendation.calories}kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">난이도:</span>
                  <span className="font-semibold text-gray-800">
                    {recommendation.difficulty === 'beginner' ? '초보자' :
                     recommendation.difficulty === 'intermediate' ? '중급자' : '고급자'}
                  </span>
                </div>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWorkout(recommendation);
                    }}
                  >
                    자세히 보기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onBack}>
          ← 새로운 추천 받기
        </Button>
      </div>
    </div>
  );
};
