import React, { useState } from 'react';
// 타입은 any로 사용하여 import 문제 해결
import { recommendWorkout } from './utils/workoutRecommender';
import { UserProfileForm } from './components/UserProfileForm';
import { WorkoutRecommendations } from './components/WorkoutRecommendations';
import { LoginForm } from './components/Auth/LoginForm';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Yoga, Heart, Dumbbell } from './components/icons';
import { useAuth } from './contexts/AuthContext';
import { ConfigDebugger } from './components/ConfigDebugger';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

// 기존 운동 루틴 데이터 (간단한 모드용)
const simpleWorkoutRoutines = {
  strength: [
    { name: "스쿼트", sets: "3세트", reps: "10회", description: "하체 근력 강화에 효과적인 기본 운동" },
    { name: "벤치프레스", sets: "3세트", reps: "8회", description: "가슴과 삼두근 발달에 도움" },
    { name: "데드리프트", sets: "3세트", reps: "5회", description: "전신 근력과 코어 강화" },
    { name: "오버헤드 프레스", sets: "3세트", reps: "8회", description: "어깨와 상체 근력 향상" },
    { name: "바벨 로우", sets: "3세트", reps: "10회", description: "등 근육 발달과 자세 교정" },
  ],
  cardio: [
    { name: "달리기", time: "30분", intensity: "보통", description: "심폐지구력 향상과 칼로리 소모" },
    { name: "사이클", time: "20분", intensity: "높음", description: "무릎 부담이 적은 유산소 운동" },
    { name: "줄넘기", time: "15분", intensity: "낮음", description: "전신 조화와 민첩성 향상" },
    { name: "버피", time: "10분", intensity: "높음", description: "고강도 전신 운동" },
    { name: "스위밍", time: "25분", intensity: "보통", description: "전신 근력과 심폐지구력 향상" },
  ],
  yoga: [
    { name: "태양 경배 자세", time: "5분", description: "전신을 깨우고 에너지를 활성화" },
    { name: "다운독 자세", time: "5분", description: "어깨와 팔 근력 강화" },
    { name: "명상", time: "10분", description: "스트레스 해소와 정신적 안정" },
    { name: "나무 자세", time: "3분", description: "균형감각과 집중력 향상" },
    { name: "전사 자세", time: "4분", description: "하체 근력과 유연성 향상" },
  ],
};

// 메인 앱 컴포넌트
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  
  // 앱 상태 관리
  const [appMode, setAppMode] = useState<'welcome' | 'simple' | 'advanced'>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  
  // 고급 모드 상태
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [oneRMData, setOneRMData] = useState<any | null>(null);
  const [workoutRecommendations, setWorkoutRecommendations] = useState<any[]>([]);

  // 이름 입력 핸들러
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(inputName);
  };

  // 운동 종류 선택 핸들러 (간단 모드)
  const handleWorkoutSelect = (workout: string) => {
    setSelectedWorkout(workout);
  };

  // 고급 모드 제출 핸들러
  const handleAdvancedSubmit = (profile: any, oneRM: any) => {
    setUserProfile(profile);
    setOneRMData(oneRM);
    const recommendations = recommendWorkout(profile, oneRM);
    setWorkoutRecommendations(recommendations);
    setAppMode('advanced');
  };

  // 간단 모드로 돌아가기
  const handleBackToSimple = () => {
    setAppMode('simple');
    setSelectedWorkout(null);
  };

  // 새로운 추천 받기
  const handleNewRecommendation = () => {
    setAppMode('welcome');
    setUserProfile(null);
    setOneRMData(null);
    setWorkoutRecommendations([]);
  };

  // 선택된 운동 루틴을 렌더링하는 함수 (간단 모드)
  const renderSimpleWorkoutRoutine = () => {
    const routine = simpleWorkoutRoutines[selectedWorkout as keyof typeof simpleWorkoutRoutines];
    if (!routine) return null;

    return (
      <div className="space-y-4">
        {routine.map((item, index) => (
          <Card key={index} className="transition-transform transform hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {item.sets && <p className="text-gray-700"><span className="font-semibold">세트:</span> {item.sets}</p>}
                {item.reps && <p className="text-gray-700"><span className="font-semibold">반복:</span> {item.reps}</p>}
                {item.time && <p className="text-gray-700"><span className="font-semibold">시간:</span> {item.time}</p>}
                {item.intensity && <p className="text-gray-700"><span className="font-semibold">강도:</span> {item.intensity}</p>}
                <p className="text-sm text-gray-600 italic">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // 운동 종류별 제목을 반환하는 함수
  const getWorkoutTitle = (workout: string) => {
    switch (workout) {
      case 'strength':
        return '오늘의 근력 운동 루틴';
      case 'cardio':
        return '오늘의 유산소 운동 루틴';
      case 'yoga':
        return '오늘의 요가 루틴';
      default:
        return '';
    }
  };

  // 로딩 중이면 로딩 화면 표시
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 로그인하지 않은 경우 로그인 화면 표시
  if (!user) {
    return <LoginForm />;
  }

  // 환영 화면
  if (appMode === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center p-4 font-sans transition-colors duration-300">
        {/* 헤더 */}
        <header className="w-full max-w-6xl p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-8 text-center border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent tracking-tight">
            AI 건강 코치
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            개인 맞춤형 운동 루틴과 전문적인 운동 가이드를 받아보세요.
          </p>
          <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>🏃‍♂️ 근력 운동</span>
            <span>💪 유산소 운동</span>
            <span>🧘‍♀️ 요가 & 명상</span>
          </div>
        </header>

        <main className="w-full max-w-6xl p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          {!userName ? (
            // 사용자 이름 입력 폼
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-600">환영합니다! 👋</CardTitle>
                <CardDescription className="text-lg">
                  운동을 시작하기 위해 이름을 입력해주세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNameSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      required
                      className="text-lg py-3"
                    />
                  </div>
                  <Button type="submit" className="w-full py-3 text-lg">
                    시작하기 🚀
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            // 모드 선택
            <div className="space-y-8">
                          <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                안녕하세요, <span className="text-blue-500">{userName}</span>님! ✨
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">어떤 방식으로 운동을 시작하고 싶으신가요?</p>
            </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* 간단 모드 */}
                <Card className="cursor-pointer hover:shadow-xl transition-shadow border-2 border-blue-200 hover:border-blue-300">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-blue-100 rounded-full">
                        <Dumbbell className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-blue-600">간단 모드</CardTitle>
                    <CardDescription className="text-lg">
                      기본적인 운동 루틴을 빠르게 확인하고 시작하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      onClick={() => setAppMode('simple')} 
                      className="w-full py-3 text-lg"
                    >
                      간단 모드 시작
                    </Button>
                  </CardContent>
                </Card>

                {/* 고급 모드 */}
                <Card className="cursor-pointer hover:shadow-xl transition-shadow border-2 border-green-200 hover:border-green-300">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-green-100 rounded-full">
                        <Heart className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-green-600">맞춤형 모드</CardTitle>
                    <CardDescription className="text-lg">
                      신체 정보와 목표를 입력하여 개인 맞춤형 운동을 받아보세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      onClick={() => setAppMode('advanced')} 
                      variant="outline"
                      className="w-full py-3 text-lg border-green-300 text-green-600 hover:bg-green-50"
                    >
                      맞춤형 모드 시작
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>

        {/* 푸터 */}
        <footer className="w-full max-w-6xl p-6 mt-8 text-center text-gray-500 text-sm bg-white rounded-xl shadow-lg border border-gray-100">
          <p>&copy; 2024 AI 건강 코치. 전문적인 운동 가이드로 건강한 삶을 만들어가세요. 🏆</p>
        </footer>
      </div>
    );
  }

  // 맞춤형 모드
  if (appMode === 'advanced') {
    if (!userProfile || workoutRecommendations.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center p-4 font-sans">
          <header className="w-full max-w-6xl p-8 bg-white rounded-2xl shadow-xl mb-8 text-center border border-gray-100">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent tracking-tight">
              AI 건강 코치
            </h1>
          </header>
          
          <main className="w-full max-w-6xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <UserProfileForm onSubmit={handleAdvancedSubmit} />
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center p-4 font-sans">
        <header className="w-full max-w-6xl p-8 bg-white rounded-2xl shadow-xl mb-8 text-center border border-gray-100">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent tracking-tight">
            AI 건강 코치
          </h1>
        </header>
        
        <main className="w-full max-w-6xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <WorkoutRecommendations 
            recommendations={workoutRecommendations}
            userProfile={userProfile}
            onBack={handleNewRecommendation}
          />
        </main>
      </div>
    );
  }

  // 간단 모드
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center p-4 font-sans">
      {/* 헤더 */}
      <header className="w-full max-w-6xl p-8 bg-white rounded-2xl shadow-xl mb-8 text-center border border-gray-100">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent tracking-tight">
          AI 건강 코치
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          간단한 운동 루틴을 확인하고 시작하세요.
        </p>
      </header>

      <main className="w-full max-w-6xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-700 text-center">
              안녕하세요, <span className="text-blue-500">{userName}</span>님! ✨
            </h2>
            <p className="text-center text-gray-600">오늘 어떤 운동을 하고 싶으신가요?</p>
          </div>

          {/* 운동 선택 버튼 그룹 */}
          <div className="flex justify-center flex-wrap gap-4">
            <Button
              variant={selectedWorkout === 'strength' ? 'default' : 'outline'}
              onClick={() => handleWorkoutSelect('strength')}
              className="flex items-center gap-2"
            >
              <Dumbbell className="h-4 w-4" /> 근력 운동
            </Button>
            <Button
              variant={selectedWorkout === 'cardio' ? 'default' : 'outline'}
              onClick={() => handleWorkoutSelect('cardio')}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" /> 유산소 운동
            </Button>
            <Button
              variant={selectedWorkout === 'yoga' ? 'default' : 'outline'}
              onClick={() => handleWorkoutSelect('yoga')}
              className="flex items-center gap-2"
            >
              <Yoga className="h-4 w-4" /> 요가
            </Button>
          </div>

          {selectedWorkout && (
            // 선택된 운동 루틴 표시
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-700 text-center mb-4">
                {getWorkoutTitle(selectedWorkout)}
              </h3>
              {renderSimpleWorkoutRoutine()}
            </div>
          )}

          {/* 모드 변경 버튼 */}
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={handleBackToSimple}>
              ← 간단 모드로 돌아가기
            </Button>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="w-full max-w-6xl p-6 mt-8 text-center text-gray-500 text-sm bg-white rounded-xl shadow-lg border border-gray-100">
        <p>&copy; 2024 AI 건강 코치. 전문적인 운동 가이드로 건강한 삶을 만들어가세요. 🏆</p>
      </footer>
      
      {/* 설정 디버거 */}
      <ConfigDebugger />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
      <ThemeToggle />
    </ThemeProvider>
  )
}

export default App;
