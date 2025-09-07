'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ConfigDebugger from './ConfigDebugger';

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

interface Notification {
  id: string;
  type: 'friend_request' | 'workout_like' | 'comment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  fromUser?: string;
  fromUserNickname?: string;
  relatedId?: string;
}



const WorkoutLog: React.FC = () => {
  const [workoutEntries, setWorkoutEntries] = useState<WorkoutEntry[]>([]);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [searchNickname, setSearchNickname] = useState('');
  const [searchedUser, setSearchedUser] = useState<UserProfile | null>(null);
  const [searchedUserWorkouts, setSearchedUserWorkouts] = useState<WorkoutEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
          
          // 샘플 알림 데이터 로드
          loadSampleNotifications();
        }
      } catch (error) {
        console.error('사용자 정보 로드 오류:', error);
      }
    };
    getCurrentUser();
  }, []);

  // 샘플 알림 데이터 생성
  const loadSampleNotifications = () => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'friend_request',
        title: '친구 신청',
        message: '운동마스터김철수님이 친구 신청을 보냈습니다.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        isRead: false,
        fromUser: 'user1',
        fromUserNickname: '운동마스터김철수'
      },
      {
        id: '2',
        type: 'workout_like',
        title: '운동일지 좋아요',
        message: '헬스러버박영희님이 당신의 운동일지에 좋아요를 눌렀습니다.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        fromUser: 'user2',
        fromUserNickname: '헬스러버박영희'
      },
      {
        id: '3',
        type: 'comment',
        title: '댓글 알림',
        message: '요가마스터이민수님이 당신의 운동일지에 댓글을 남겼습니다.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        fromUser: 'user3',
        fromUserNickname: '요가마스터이민수'
      },
      {
        id: '4',
        type: 'system',
        title: '시스템 업데이트',
        message: '새로운 운동 챌린지가 추가되었습니다. 참여해보세요!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: true
      },
    ];
    
    setNotifications(sampleNotifications);
  };

  // 알림 읽음 처리
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // 모든 알림 읽음 처리
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // 알림 삭제
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

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
      <div className="text-center mb-8 relative">
        <h1 className="text-3xl font-bold text-text-primary mb-2">운동 일지</h1>
        <p className="text-text-secondary">나의 운동 기록을 남기고 관리하세요</p>
        
        {/* 설정 아이콘 - 우측 하단 */}
        <button
          onClick={() => setShowSettings(true)}
          className="absolute bottom-0 right-0 p-2 text-text-primary hover:text-accent-green transition-colors duration-200 hover:scale-110"
          title="설정"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* 알림 아이콘 (종 모양) - 설정 아이콘 오른쪽 */}
        <button
          onClick={() => setShowNotifications(true)}
          className="absolute bottom-0 right-2 p-2 text-text-primary hover:text-accent-green transition-colors duration-200 hover:scale-110 relative"
          title="알림"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* 닉네임 검색 바 */}
      <div className="bg-background-secondary border border-border-primary rounded-lg p-4 mb-8">
        <h3 className="font-medium text-text-primary mb-3">닉네임 검색</h3>
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

      {/* 설정 모달 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">설정</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                title="닫기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 bg-white">
              <ConfigDebugger />
            </div>
          </div>
        </div>
      )}

      {/* 알림 모달 */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-gray-900">알림</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                    {unreadCount}개
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    모두 읽음
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  title="닫기"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.isRead 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${
                              notification.type === 'friend_request' ? 'bg-green-500' :
                              notification.type === 'workout_like' ? 'bg-red-500' :
                              notification.type === 'comment' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}></div>
                            <h3 className={`font-medium ${
                              notification.isRead ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className={`text-sm ${
                            notification.isRead ? 'text-gray-600' : 'text-gray-800'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.timestamp).toLocaleString('ko-KR')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              읽음
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔔</div>
                  <p className="text-gray-600">알림이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLog;
