import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface WorkoutEntry {
  id: string;
  date: string;
  workoutType: string;
  duration: number;
  exercises: Exercise[];
  notes: string;
  isPublic: boolean;
  likes: number;
  userId: string;
  userNickname: string;
  calories?: number;
  metValue?: number;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number;
}

interface UserProfile {
  id: string;
  nickname: string;
  workout_log_sharing?: boolean;
  weight?: number;
}



const WorkoutLog: React.FC = () => {
  const [workoutEntries, setWorkoutEntries] = useState<WorkoutEntry[]>([]);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [searchNickname, setSearchNickname] = useState('');
  const [searchedUser, setSearchedUser] = useState<UserProfile | null>(null);
  const [searchedUserWorkouts, setSearchedUserWorkouts] = useState<WorkoutEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [newEntry, setNewEntry] = useState({
    workoutType: '',
    duration: '',
    notes: '',
    isPublic: false,
    selectedCategory: '',
    selectedExercise: '',
    estimatedCalories: 0
  });

  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    restTime: ''
  });

  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([]);

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // 임시로 기본 사용자 정보 생성 (데이터베이스 테이블 문제 해결 전까지)
          const basicUser = {
            id: user.id,
            nickname: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '사용자'
          };
          
          setCurrentUser(basicUser);
          // 현재 사용자의 운동일지 로드 (로컬 상태만)
          // loadUserWorkouts(user.id);
        }
      } catch (error) {
        console.error('사용자 정보 로드 오류:', error);
      }
    };
    getCurrentUser();
  }, []);

  // 사용자의 운동일지 로드
  const loadUserWorkouts = async (userId: string) => {
    try {
      const { data: workouts } = await supabase
        .from('workout_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (workouts) {
        setWorkoutEntries(workouts);
      }
    } catch (error) {
      console.error('운동일지 로드 오류:', error);
    }
  };

  // 닉네임으로 사용자 검색
  const searchUserByNickname = async () => {
    if (!searchNickname.trim()) return;

    setIsSearching(true);
    try {
      // 샘플 사용자 데이터 (실제 데이터베이스 대신 사용)
      const sampleUsers = [
        {
          id: 'sample-user-1',
          nickname: '운동마스터김철수',
          workout_log_sharing: true
        },
        {
          id: 'sample-user-2',
          nickname: '헬스러버박영희',
          workout_log_sharing: true
        },
        {
          id: 'sample-user-3',
          nickname: '요가마스터이민수',
          workout_log_sharing: true
        },
        {
          id: 'sample-user-4',
          nickname: '크로스핏킹정수진',
          workout_log_sharing: true
        },
        {
          id: 'sample-user-5',
          nickname: '다이어트성공한지영',
          workout_log_sharing: true
        }
      ];

      // 검색어와 일치하는 사용자 찾기
      const matchedUser = sampleUsers.find(user => 
        user.nickname.toLowerCase().includes(searchNickname.toLowerCase())
      );

      if (matchedUser) {
        setSearchedUser(matchedUser);
        // 샘플 운동일지 데이터 생성
        const sampleWorkouts = generateSampleWorkouts(matchedUser.nickname);
        setSearchedUserWorkouts(sampleWorkouts);
      } else {
        setSearchedUser(null);
        setSearchedUserWorkouts([]);
        alert('해당 닉네임의 사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('사용자 검색 오류:', error);
      setSearchedUser(null);
      setSearchedUserWorkouts([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 칼로리 계산 함수
  const calculateCalories = (metValue: number, duration: number, weight: number = 70): number => {
    // 칼로리 계산 공식: (MET × 체중(kg) × 3.5) / 200 × 운동시간(분)
    return Math.round((metValue * weight * 3.5) / 200 * duration);
  };



  // 샘플 운동일지 데이터 생성 함수
  const generateSampleWorkouts = (nickname: string): WorkoutEntry[] => {
    const workoutTypes = [
      '상체 운동', '하체 운동', '전신 운동', '유산소 운동', '스트레칭',
      '벤치프레스', '스쿼트', '데드리프트', '풀업', '플랭크'
    ];
    
    const exerciseNames = [
      '벤치프레스', '스쿼트', '데드리프트', '풀업', '플랭크',
      '런지', '버피', '마운틴클라이머', '버드독', '크런치'
    ];

    const sampleWorkouts: WorkoutEntry[] = [];
    
    for (let i = 0; i < 5; i++) {
      const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      const exercises: Exercise[] = [];
      
      // 3-5개의 운동 생성
      const exerciseCount = Math.floor(Math.random() * 3) + 3;
      for (let j = 0; j < exerciseCount; j++) {
        exercises.push({
          name: exerciseNames[Math.floor(Math.random() * exerciseNames.length)],
          sets: Math.floor(Math.random() * 3) + 3,
          reps: Math.floor(Math.random() * 10) + 8,
          weight: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 20 : undefined,
          restTime: Math.floor(Math.random() * 60) + 30
        });
      }

              const metValue = 4.0; // 웨이트 트레이닝 기본 MET 값
        const calories = calculateCalories(metValue, Math.floor(Math.random() * 60) + 30, 70);
        
        sampleWorkouts.push({
          id: `sample-workout-${i}`,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          workoutType,
          duration: Math.floor(Math.random() * 60) + 30,
          exercises,
          notes: `${workoutType} 완료! 오늘도 열심히 운동했습니다 💪`,
          isPublic: true,
          likes: Math.floor(Math.random() * 20),
          userId: `sample-user-${i}`,
          userNickname: nickname,
          calories,
          metValue
        });
    }

    return sampleWorkouts;
  };

  // 검색된 사용자의 공개 운동일지 로드
  const loadSearchedUserWorkouts = async (userId: string) => {
    try {
      const { data: workouts } = await supabase
        .from('workout_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (workouts) {
        setSearchedUserWorkouts(workouts);
      }
    } catch (error) {
      console.error('검색된 사용자 운동일지 로드 오류:', error);
    }
  };

  // 공개/비공개 토글
  const togglePublicStatus = async (entryId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('workout_entries')
        .update({ is_public: !currentStatus })
        .eq('id', entryId);

      if (error) throw error;

      // 로컬 상태 업데이트
      setWorkoutEntries(entries =>
        entries.map(entry =>
          entry.id === entryId ? { ...entry, isPublic: !currentStatus } : entry
        )
      );
    } catch (error) {
      console.error('공개 상태 변경 오류:', error);
      alert('공개 상태 변경에 실패했습니다.');
    }
  };

  const handleAddExercise = () => {
    if (newExercise.name && newExercise.sets && newExercise.reps) {
      const exercise: Exercise = {
        name: newExercise.name,
        sets: parseInt(newExercise.sets),
        reps: parseInt(newExercise.reps),
        weight: newExercise.weight ? parseInt(newExercise.weight) : undefined,
        restTime: newExercise.restTime ? parseInt(newExercise.restTime) : 60
      };
      
      // 운동 추가 시 칼로리 계산
      const metValue = getMetValueForExercise(newExercise.name);
      if (metValue && newEntry.duration) {
        const calories = calculateCalories(metValue, parseInt(newEntry.duration), currentUser?.weight || 70);
        setNewEntry(prev => ({ ...prev, estimatedCalories: calories }));
      }
      
      setCurrentExercises([...currentExercises, exercise]);
      setNewExercise({ name: '', sets: '', reps: '', weight: '', restTime: '' });
    }
  };

  // 운동 이름에 따른 MET 값 반환 함수
  const getMetValueForExercise = (exerciseName: string): number | null => {
    const exerciseMetMap: { [key: string]: number } = {
      // 유산소 운동
      '가벼운 걷기': 2.0,
      '보통 속도 걷기': 3.5,
      '빠른 걷기': 4.5,
      '가벼운 조깅': 6.0,
      '보통 속도 달리기': 8.0,
      '빠른 달리기': 10.0,
      '자전거 타기': 7.5,
      '수영': 8.0,
      '줄넘기': 12.0,
      '계단 오르기': 8.0,
      
      // 근력 운동
      '웨이트 트레이닝': 4.0,
      '스쿼트': 5.0,
      '데드리프트': 6.0,
      '벤치프레스': 4.5,
      '풀업': 8.0,
      '푸시업': 8.0,
      '플랭크': 4.0,
      '런지': 5.5,
      '버피': 8.0,
      '크런치': 3.0,
      
      // 유연성 운동
      '요가': 2.5,
      '스트레칭': 2.0,
      '필라테스': 3.0,
      '타이치': 3.5,
      
      // 전신 운동
      '크로스핏': 10.0,
      '서킷 트레이닝': 8.0,
      'HIIT': 12.0,
      '킥복싱': 8.5,
      '복싱': 9.0,
      '테니스': 7.0,
      '농구': 8.0,
      '축구': 8.5
    };
    
    return exerciseMetMap[exerciseName] || null;
  };

  const handleSubmitEntry = async () => {
    if (newEntry.workoutType && newEntry.duration && currentExercises.length > 0 && currentUser) {
      try {
        const entry = {
          workout_type: newEntry.workoutType,
          duration: parseInt(newEntry.duration),
          exercises: currentExercises,
          notes: newEntry.notes,
          is_public: newEntry.isPublic,
          user_id: currentUser.id,
          user_nickname: currentUser.nickname
        };

        const { data, error } = await supabase
          .from('workout_entries')
          .insert([entry])
          .select()
          .single();

        if (error) throw error;

        // 새로 생성된 운동일지를 목록에 추가
        const newWorkoutEntry: WorkoutEntry = {
          id: data.id,
          date: new Date().toISOString().split('T')[0],
          workoutType: data.workout_type,
          duration: data.duration,
          exercises: data.exercises,
          notes: data.notes,
          isPublic: data.is_public,
          likes: 0,
          userId: data.user_id,
          userNickname: data.user_nickname,
          calories: newEntry.estimatedCalories,
          metValue: getMetValueForExercise(currentExercises[0]?.name || '') || undefined
        };

        setWorkoutEntries([newWorkoutEntry, ...workoutEntries]);
        setShowNewEntryForm(false);
        setNewEntry({ workoutType: '', duration: '', notes: '', isPublic: false, selectedCategory: '', selectedExercise: '', estimatedCalories: 0 });
        setCurrentExercises([]);
      } catch (error) {
        console.error('운동일지 저장 오류:', error);
        alert('운동일지 저장에 실패했습니다.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">운동 일지</h1>
        <p className="text-text-secondary">나의 운동 기록을 남기고 관리하세요</p>
      </div>

      {/* 닉네임 검색 바 */}
      <div className="bg-background-secondary border border-border-primary rounded-lg p-4 mb-8">
        <h3 className="font-medium text-text-primary mb-3">다른 사용자 운동일지 검색</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={searchNickname}
            onChange={(e) => setSearchNickname(e.target.value)}
            placeholder="검색할 닉네임을 입력하세요"
            className="flex-1 px-3 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary"
            onKeyPress={(e) => e.key === 'Enter' && searchUserByNickname()}
          />
          <button
            onClick={searchUserByNickname}
            disabled={isSearching}
            className="px-6 py-2 bg-accent-green text-white rounded-lg hover:bg-accent-green-dark transition-colors disabled:opacity-50"
          >
            {isSearching ? '검색 중...' : '검색'}
          </button>
        </div>
      </div>

      {/* 검색된 사용자 운동일지 */}
      {searchedUser && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-text-primary">
              {searchedUser.nickname}님의 운동일지
            </h2>
            <button
              onClick={() => {
                setSearchedUser(null);
                setSearchedUserWorkouts([]);
                setSearchNickname('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              닫기
            </button>
          </div>
          
          {searchedUserWorkouts.length > 0 ? (
            <div className="space-y-6">
              {searchedUserWorkouts.map((entry) => (
                <div key={entry.id} className="bg-background-secondary border border-border-primary rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                                    <div>
                  <h3 className="text-xl font-semibold text-text-primary">{entry.workoutType}</h3>
                  <p className="text-text-secondary">{entry.date} • {entry.duration}분</p>
                  {entry.calories && (
                    <p className="text-accent-green font-medium text-sm">🔥 {entry.calories} kcal 소모</p>
                  )}
                </div>
                    <span className="px-2 py-1 bg-accent-green text-white text-xs rounded-full">공개</span>
                  </div>

                  {/* 운동 상세 */}
                  <div className="mb-4">
                    <h4 className="font-medium text-text-primary mb-2">운동 상세:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {entry.exercises.map((exercise, index) => (
                        <div key={index} className="bg-background-tertiary p-3 rounded-lg">
                          <div className="font-medium text-text-primary">{exercise.name}</div>
                          <div className="text-sm text-text-secondary">
                            {exercise.sets}세트 × {exercise.reps}회
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                          </div>
                          <div className="text-xs text-text-secondary">휴식: {exercise.restTime}초</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 메모 */}
                  {entry.notes && (
                    <div className="mb-4">
                      <h4 className="font-medium text-text-primary mb-2">메모:</h4>
                      <p className="text-text-primary bg-background-tertiary p-3 rounded-lg">{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              공개된 운동일지가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* 새 운동 기록 폼 */}
      {showNewEntryForm && (
        <div className="bg-background-secondary border border-border-primary rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">새로운 운동 기록</h2>
          


          {/* 운동 추가 폼 */}
          <div className="border border-border-primary rounded-lg p-4 mb-4">
            <h3 className="font-medium text-text-primary mb-3">운동 추가</h3>
            
            {/* 운동 시간 입력 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">운동 시간 (분)</label>
              <input
                type="number"
                value={newEntry.duration}
                onChange={(e) => setNewEntry({...newEntry, duration: e.target.value})}
                className="w-full px-3 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary"
                placeholder="60"
              />
            </div>
            
            {/* 운동 종류 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">운동 종류</label>
              <select
                value={newExercise.name}
                onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                className="w-full px-3 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary"
              >
                <option value="">운동 종류를 선택하세요</option>
                <optgroup label="유산소 운동">
                  <option value="가벼운 걷기">가벼운 걷기</option>
                  <option value="보통 속도 걷기">보통 속도 걷기</option>
                  <option value="빠른 걷기">빠른 걷기</option>
                  <option value="가벼운 조깅">가벼운 조깅</option>
                  <option value="보통 속도 달리기">보통 속도 달리기</option>
                  <option value="빠른 달리기">빠른 달리기</option>
                  <option value="자전거 타기">자전거 타기</option>
                  <option value="수영">수영</option>
                  <option value="줄넘기">줄넘기</option>
                  <option value="계단 오르기">계단 오르기</option>
                </optgroup>
                <optgroup label="근력 운동">
                  <option value="웨이트 트레이닝">웨이트 트레이닝</option>
                  <option value="스쿼트">스쿼트</option>
                  <option value="데드리프트">데드리프트</option>
                  <option value="벤치프레스">벤치프레스</option>
                  <option value="풀업">풀업</option>
                  <option value="푸시업">푸시업</option>
                  <option value="플랭크">플랭크</option>
                  <option value="런지">런지</option>
                  <option value="버피">버피</option>
                  <option value="크런치">크런치</option>
                </optgroup>
                <optgroup label="유연성 운동">
                  <option value="요가">요가</option>
                  <option value="스트레칭">스트레칭</option>
                  <option value="필라테스">필라테스</option>
                  <option value="타이치">타이치</option>
                </optgroup>
                <optgroup label="전신 운동">
                  <option value="크로스핏">크로스핏</option>
                  <option value="서킷 트레이닝">서킷 트레이닝</option>
                  <option value="HIIT">HIIT</option>
                  <option value="킥복싱">킥복싱</option>
                  <option value="복싱">복싱</option>
                  <option value="테니스">테니스</option>
                  <option value="농구">농구</option>
                  <option value="축구">축구</option>
                </optgroup>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
              <input
                type="number"
                value={newExercise.sets}
                onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
                className="px-3 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary"
                placeholder="세트"
              />
              <input
                type="number"
                value={newExercise.reps}
                onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                className="px-3 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary"
                placeholder="횟수"
              />
              <input
                type="number"
                value={newExercise.weight}
                onChange={(e) => setNewExercise({...newExercise, weight: e.target.value})}
                className="px-3 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary"
                placeholder="무게(kg)"
              />
              <input
                type="number"
                value={newExercise.restTime}
                onChange={(e) => setNewExercise({...newExercise, restTime: e.target.value})}
                className="px-3 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary"
                placeholder="휴식(초)"
              />
            </div>
            
            {/* 운동 추가 버튼들 */}
            <div className="flex space-x-2">
              <button
                onClick={handleAddExercise}
                className="px-4 py-2 bg-accent-green text-white rounded-lg hover:bg-accent-green-dark transition-colors flex-1"
              >
                운동 추가
              </button>
              <button
                onClick={handleAddExercise}
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-dark transition-colors"
                title="다른 운동 추가"
              >
                +
              </button>
            </div>
          </div>

          {/* 추가된 운동 목록 */}
          {currentExercises.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-text-primary mb-2">추가된 운동:</h4>
              <div className="space-y-2">
                {currentExercises.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between bg-background-tertiary p-2 rounded-lg">
                    <span className="text-text-primary">{exercise.name}</span>
                    <span className="text-text-secondary">
                      {exercise.sets}세트 × {exercise.reps}회
                      {exercise.weight && ` @ ${exercise.weight}kg`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 예상 소모 칼로리 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-primary mb-2">예상 소모 칼로리</label>
            <div className="w-full px-3 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary flex items-center justify-between">
              <span className="text-text-primary">
                {newEntry.estimatedCalories > 0 ? `${newEntry.estimatedCalories} kcal` : '운동 추가 후 계산됩니다'}
              </span>
              {newEntry.estimatedCalories > 0 && (
                <span className="text-accent-green font-semibold">🔥</span>
              )}
            </div>
            {newEntry.estimatedCalories > 0 && (
              <div className="mt-2 text-sm text-text-secondary">
                {currentUser?.weight ? `체중 ${currentUser.weight}kg 기준` : '기본 체중 70kg 기준'}으로 계산되었습니다
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text-primary mb-2">메모</label>
            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
              className="w-full px-3 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary"
              rows={3}
              placeholder="오늘 운동에 대한 메모를 남겨보세요..."
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isPublic"
              checked={newEntry.isPublic}
              onChange={(e) => setNewEntry({...newEntry, isPublic: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="isPublic" className="text-text-primary">동료들과 공유하기</label>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSubmitEntry}
              className="px-6 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-dark transition-colors"
            >
              기록 저장
            </button>
            <button
              onClick={() => setShowNewEntryForm(false)}
              className="px-6 py-2 bg-background-tertiary text-text-primary rounded-lg hover:bg-background-primary transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 내 운동 기록 목록 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">내 운동 기록</h2>
        {workoutEntries.length > 0 ? (
          workoutEntries.map((entry) => (
            <div key={entry.id} className="bg-background-secondary border border-border-primary rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">{entry.workoutType}</h3>
                  <p className="text-text-secondary">{entry.date} • {entry.duration}분</p>
                  {entry.calories && (
                    <p className="text-accent-green font-medium text-sm">🔥 {entry.calories} kcal 소모</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePublicStatus(entry.id, entry.isPublic)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      entry.isPublic 
                        ? 'bg-accent-green text-white hover:bg-green-600' 
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    {entry.isPublic ? '공개' : '비공개'}
                  </button>
                </div>
              </div>

              {/* 운동 상세 */}
              <div className="mb-4">
                <h4 className="font-medium text-text-primary mb-2">운동 상세:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {entry.exercises.map((exercise, index) => (
                    <div key={index} className="bg-background-tertiary p-3 rounded-lg">
                      <div className="font-medium text-text-primary">{exercise.name}</div>
                      <div className="text-sm text-text-secondary">
                        {exercise.sets}세트 × {exercise.reps}회
                        {exercise.weight && ` @ ${exercise.weight}kg`}
                      </div>
                      <div className="text-xs text-text-secondary">휴식: {exercise.restTime}초</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 메모 */}
              {entry.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-text-primary mb-2">메모:</h4>
                  <p className="text-text-primary bg-background-tertiary p-3 rounded-lg">{entry.notes}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-text-secondary">
            아직 운동 기록이 없습니다. 첫 번째 운동 기록을 남겨보세요!
          </div>
        )}
      </div>

      {/* 하단 중앙 운동 기록하기 버튼 */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 text-center z-10">
        <button
          onClick={() => setShowNewEntryForm(true)}
          className="px-12 py-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl text-xl"
        >
          ✏️ 운동 기록하기
        </button>
        <p className="text-sm text-text-secondary mt-3 text-white drop-shadow-lg">
          새로운 운동 기록을 남기고 목표를 달성해보세요!
        </p>
      </div>
    </div>
  );
};

export default WorkoutLog;
