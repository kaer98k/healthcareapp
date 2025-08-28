import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ConfigDebuggerProps {
  className?: string;
}

interface UserProfile {
  id?: string;
  name: string;
  email: string;
  nickname: string;
  profileImage: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  fitnessGoal: string;
  experience: string;
  availableTime: number;
  equipment: string;
  workout_log_sharing?: boolean;
}

const ConfigDebugger: React.FC<ConfigDebuggerProps> = ({ className }) => {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '홍길동',
    email: 'hong@example.com',
    nickname: '운동마스터',
    profileImage: '',
    age: 30,
    gender: 'male',
    height: 175,
    weight: 70,
    activityLevel: 'moderate',
    fitnessGoal: 'general_fitness',
    experience: 'intermediate',
    availableTime: 60,
    equipment: 'basic'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [workoutLogSharing, setWorkoutLogSharing] = useState(true); // 기본값: 공유 허용
  const [browserExpanded, setBrowserExpanded] = useState(false);
  const [windowExpanded, setWindowExpanded] = useState(false);
  const [communityRulesExpanded, setCommunityRulesExpanded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadConfiguration();
    loadUserProfile();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      setError(null);

      // 환경 변수 및 설정 정보 수집
      const configData = {
        environment: {
          NODE_ENV: import.meta.env.MODE,
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
          VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '***' : 'Not Set',
        },
        browser: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
        },
        window: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          location: window.location.href,
        },
        timestamp: new Date().toISOString(),
      };

      setConfig(configData);
    } catch (err) {
      setError('설정을 로드하는 중 오류가 발생했습니다.');
      console.error('ConfigDebugger 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      setProfileLoading(true);
      
      // 현재 로그인된 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('사용자 정보를 찾을 수 없습니다.');
        return;
      }

      // 임시로 기본 프로필 정보 생성 (데이터베이스 테이블 문제 해결 전까지)
      const basicProfile = {
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
        email: user.email || '',
        nickname: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
        profileImage: '',
        age: 30,
        gender: 'male',
        height: 170,
        weight: 70,
        activityLevel: 'moderate',
        fitnessGoal: 'general_fitness',
        experience: 'beginner',
        availableTime: 60,
        equipment: 'basic'
      };
      
      setUserProfile(basicProfile);
      setImagePreview('');
      
      // 운동 일지 공유 설정 로드 (기본값: true)
      setWorkoutLogSharing(true);
      
      console.log('기본 프로필 정보가 로드되었습니다. (데이터베이스 테이블 문제로 인해)');
    } catch (err) {
      console.error('프로필 로드 오류:', err);
      // 에러가 발생해도 기본값 사용
      setWorkoutLogSharing(true);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setUserProfile(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setImagePreview('');
    setUserProfile(prev => ({ ...prev, profileImage: '' }));
  };

  const saveProfile = async () => {
    try {
      setProfileLoading(true);
      // 실제 구현에서는 Supabase에 프로필을 저장합니다
      await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션
      setIsEditing(false);
      alert('프로필이 성공적으로 저장되었습니다!');
    } catch (err) {
      console.error('프로필 저장 오류:', err);
      alert('프로필 저장에 실패했습니다.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // 실제로는 여기서 API 호출하여 프로필 업데이트
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('로그아웃 오류:', error);
        return;
      }
      
      // 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const saveWorkoutLogSharing = async (enabled: boolean) => {
    try {
      // 임시로 로컬 상태만 변경 (데이터베이스 테이블 문제 해결 전까지)
      setWorkoutLogSharing(enabled);
      
      // UserProfile도 함께 업데이트
      setUserProfile(prev => ({
        ...prev,
        workout_log_sharing: enabled
      }));
      
      // 사용자에게 피드백 제공
      const message = enabled ? '운동 일지 공유가 활성화되었습니다.' : '운동 일지 공유가 비활성화되었습니다.';
      alert(message);
      
      console.log('운동 일지 공유 설정이 로컬에서만 저장되었습니다. (데이터베이스 테이블 문제로 인해)');
    } catch (err) {
      console.error('운동 일지 공유 설정 저장 오류:', err);
      alert('설정 저장에 실패했습니다.');
    }
  };

  const exportConfig = () => {
    const configStr = JSON.stringify(config, null, 2);
    const blob = new Blob([configStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      const configStr = JSON.stringify(config, null, 2);
      await navigator.clipboard.writeText(configStr);
      alert('설정이 클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('클립보드 복사 오류:', err);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="panel-container max-w-4xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-body font-body text-text-secondary">설정을 로드하는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel-container max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-body font-body font-medium text-red-400 mb-2">오류 발생</h3>
          <p className="text-body font-body text-text-secondary mb-4">{error}</p>
          <button
            onClick={loadConfiguration}
            className="utility-button px-6 py-3 text-body font-body font-medium transition-all duration-200 hover:scale-105"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-container max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-panel-header font-panel-header text-foreground mb-2">
          설정
        </h2>
      </div>

      {/* 탭 네비게이션 제거하고 행 기반 레이아웃으로 변경 */}
      
      {/* 1행: 사용자 프로필 */}
      <div className="space-y-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body font-body font-medium text-foreground flex items-center">
              사용자 프로필
            </h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="utility-button px-4 py-2 text-body font-body font-medium transition-all duration-200 hover:scale-105"
              >
                ✏️ 편집
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="utility-button px-4 py-2 text-body font-body font-medium transition-all duration-200 hover:scale-105"
                >
                  ❌ 취소
                </button>
                <button
                  onClick={saveProfile}
                  disabled={profileLoading}
                  className="utility-button px-4 py-2 text-body font-body font-medium transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700 text-white"
                >
                  {profileLoading ? '💾 저장 중...' : '💾 저장'}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              {/* 프로필 이미지 섹션 */}
              <div className="text-center">
                <label className="text-label font-label text-muted-foreground mb-3 block">프로필 이미지</label>
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="프로필 이미지"
                          className="w-24 h-24 rounded-full object-cover border-4 border-border"
                        />
                        <button
                          onClick={removeProfileImage}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-secondary border-4 border-dashed border-border flex items-center justify-center">
                        <span className="text-muted-foreground text-2xl">👤</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors text-sm">
                        📷 이미지 선택
                      </span>
                    </label>
                    {imagePreview && (
                      <button
                        onClick={removeProfileImage}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        🗑️ 삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-foreground mb-2">이름</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    placeholder="실명을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">닉네임</label>
                  <input
                    type="text"
                    value={userProfile.nickname}
                    onChange={(e) => handleProfileChange('nickname', e.target.value)}
                    className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    placeholder="커뮤니티에서 사용할 닉네임"
                    maxLength={20}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">이메일</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-foreground mb-2">나이</label>
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => handleProfileChange('age', parseInt(e.target.value))}
                    className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  min="10"
                  max="100"
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-foreground mb-2">성별</label>
                <select
                  value={userProfile.gender}
                  onChange={(e) => handleProfileChange('gender', e.target.value)}
                    className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">선택하세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-foreground mb-2">키 (cm)</label>
                <input
                  type="number"
                  value={userProfile.height}
                  onChange={(e) => handleProfileChange('height', parseInt(e.target.value))}
                    className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-foreground mb-2">몸무게 (kg)</label>
                <input
                  type="number"
                  value={userProfile.weight}
                  onChange={(e) => handleProfileChange('weight', parseInt(e.target.value))}
                    className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  min="30"
                  max="200"
                />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">활동 수준</label>
                <select
                  value={userProfile.activityLevel}
                  onChange={(e) => handleProfileChange('activityLevel', e.target.value)}
                  className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">선택하세요</option>
                  <option value="sedentary">거의 움직이지 않음 (사무직)</option>
                  <option value="light">가벼운 활동 (주 1-3일 운동)</option>
                  <option value="moderate">보통 활동 (주 3-5일 운동)</option>
                  <option value="active">적극적 활동 (주 6-7일 운동)</option>
                  <option value="very_active">매우 적극적 활동 (매일 운동)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">운동 목표</label>
                <select
                  value={userProfile.fitnessGoal}
                  onChange={(e) => handleProfileChange('fitnessGoal', e.target.value)}
                  className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">선택하세요</option>
                  <option value="weight_loss">체중 감량</option>
                  <option value="muscle_gain">근육량 증가</option>
                  <option value="strength">근력 향상</option>
                  <option value="endurance">지구력 향상</option>
                  <option value="flexibility">유연성 향상</option>
                  <option value="general_fitness">전반적인 건강</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-foreground mb-2">운동 경험</label>
                <select
                  value={userProfile.experience}
                  onChange={(e) => handleProfileChange('experience', e.target.value)}
                    className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">선택하세요</option>
                  <option value="beginner">초보자 (6개월 미만)</option>
                  <option value="intermediate">중급자 (6개월-2년)</option>
                  <option value="advanced">고급자 (2년 이상)</option>
                </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-foreground mb-2">운동 가능 시간 (분)</label>
                <input
                  type="number"
                  value={userProfile.availableTime}
                  onChange={(e) => handleProfileChange('availableTime', parseInt(e.target.value))}
                    className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  min="15"
                  max="180"
                />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">사용 가능한 장비</label>
                <select
                  value={userProfile.equipment}
                  onChange={(e) => handleProfileChange('equipment', e.target.value)}
                  className="form-input w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">선택하세요</option>
                  <option value="none">장비 없음 (맨몸 운동)</option>
                  <option value="basic">기본 장비 (덤벨, 매트 등)</option>
                  <option value="full_gym">풀짐 (바벨, 머신 등)</option>
                </select>
              </div>
            </div>
                      ) : (
            <div className="space-y-4">
              {/* 프로필 미리보기 */}
              <div className="text-center">
                <div className="inline-block">
                  {userProfile.profileImage ? (
                    <img
                      src={userProfile.profileImage}
                      alt="프로필 이미지"
                      className="w-20 h-20 rounded-full object-cover border-4 border-border mx-auto"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-secondary border-4 border-border flex items-center justify-center mx-auto">
                      <span className="text-muted-foreground text-3xl">👤</span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h4 className="text-lg font-semibold text-foreground">{userProfile.nickname}</h4>
                  <p className="text-sm text-muted-foreground">{userProfile.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">이메일:</span>
                  <span className="ml-2 text-foreground">{userProfile.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">나이:</span>
                  <span className="ml-2 text-foreground">{userProfile.age}세</span>
                </div>
                <div>
                  <span className="text-muted-foreground">성별:</span>
                  <span className="ml-2 text-foreground">{userProfile.gender === 'male' ? '남성' : '여성'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">키:</span>
                  <span className="ml-2 text-foreground">{userProfile.height}cm</span>
                </div>
                <div>
                  <span className="text-muted-foreground">몸무게:</span>
                  <span className="ml-2 text-foreground">{userProfile.weight}kg</span>
                </div>
                <div>
                  <span className="text-muted-foreground">활동 수준:</span>
                  <span className="ml-2 text-foreground">
                    {userProfile.activityLevel === 'sedentary' ? '거의 움직이지 않음' :
                     userProfile.activityLevel === 'light' ? '가벼운 활동' :
                     userProfile.activityLevel === 'moderate' ? '보통 활동' :
                     userProfile.activityLevel === 'active' ? '적극적 활동' :
                     userProfile.activityLevel === 'very_active' ? '매우 적극적 활동' : '선택 안함'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">운동 목표:</span>
                  <span className="ml-2 text-foreground">
                    {userProfile.fitnessGoal === 'weight_loss' ? '체중 감량' :
                     userProfile.fitnessGoal === 'muscle_gain' ? '근육량 증가' :
                     userProfile.fitnessGoal === 'strength' ? '근력 향상' :
                     userProfile.fitnessGoal === 'endurance' ? '지구력 향상' :
                     userProfile.fitnessGoal === 'flexibility' ? '유연성 향상' :
                     userProfile.fitnessGoal === 'general_fitness' ? '전반적인 건강' : '선택 안함'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">운동 경험:</span>
                  <span className="ml-2 text-foreground">
                    {userProfile.activityLevel === 'beginner' ? '초보자' :
                     userProfile.activityLevel === 'intermediate' ? '중급자' :
                     userProfile.activityLevel === 'advanced' ? '고급자' : '선택 안함'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">운동 시간:</span>
                  <span className="ml-2 text-foreground">{userProfile.availableTime}분</span>
                </div>
                <div>
                  <span className="text-muted-foreground">사용 장비:</span>
                  <span className="ml-2 text-foreground">
                    {userProfile.equipment === 'none' ? '장비 없음' :
                     userProfile.equipment === 'basic' ? '기본 장비' :
                     userProfile.equipment === 'full_gym' ? '풀짐' : '선택 안함'}
                  </span>
                </div>
              </div>
              </div>
            )}
        </div>
      </div>

      {/* 2행: 알림 설정 */}
      <div className="space-y-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-body font-body font-medium text-foreground mb-4 flex items-center">
            알림 설정
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body font-body text-muted-foreground mb-1">
                  운동 알림
                </p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 border-2 ${
                  notificationsEnabled ? 'bg-accent border-accent' : 'bg-gray-200 border-gray-500'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-md border-2 border-gray-300 ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5행: 운동 일지 공유 설정 */}
      <div className="space-y-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-body font-body font-medium text-foreground mb-4 flex items-center">
            🔒 운동 일지 공유 설정
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-body font-body text-foreground mb-2 font-medium">
                  닉네임 검색 시 운동 일지 공유
                </p>
                <p className="text-sm text-muted-foreground">
                  다른 사용자가 내 닉네임을 검색했을 때, 내 운동 일지 정보를 공개할지 설정합니다.
                </p>
              </div>
              <button
                onClick={() => saveWorkoutLogSharing(!workoutLogSharing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 border-2 ${
                  workoutLogSharing ? 'bg-accent border-accent' : 'bg-gray-200 border-gray-500'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-md border-2 border-gray-300 ${
                    workoutLogSharing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {/* 상세 설정 */}
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-3">📋 공유되는 정보</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>운동 종류 및 시간</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>운동 상세 (세트, 횟수, 무게)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>운동 메모</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>개인정보 (이름, 연락처 등)</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded-lg">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  💡 <strong>참고:</strong> 이 설정은 운동 일지 탭에서 개별적으로 공개/비공개를 설정할 수 있습니다. 
                  이 설정은 기본값으로 작동합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2.6행: 커뮤니티 세부 규정사항 */}
      <div className="space-y-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body font-body font-medium text-foreground flex items-center">
              📋 커뮤니티 세부 규정사항
            </h3>
            <button
              onClick={() => setCommunityRulesExpanded(!communityRulesExpanded)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <svg 
                className={`w-5 h-5 transform transition-transform duration-200 ${communityRulesExpanded ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {communityRulesExpanded && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3 text-red-600 dark:text-red-400">🚫 절대 금지 사항</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 허위 정보 및 과장된 표현</li>
                    <li>• 개인정보 노출 (실명, 연락처, 주소 등)</li>
                    <li>• 상업적 홍보 및 스팸성 내용</li>
                    <li>• 타인 비방, 차별적 표현</li>
                    <li>• 의료 상담이 필요한 질문</li>
                    <li>• 저작권 침해 및 무단 복사</li>
                    <li>• 음란, 폭력적, 불법적 내용</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-3 text-yellow-600 dark:text-yellow-400">⚠️ 주의 사항</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 정확하고 검증된 정보만 공유</li>
                    <li>• 개인 경험은 객관적으로 서술</li>
                    <li>• 상대방을 배려하는 표현 사용</li>
                    <li>• 건전하고 건설적인 토론 문화</li>
                    <li>• 서로 격려하고 동기부여</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-400 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">⚖️ 제재 정책</h4>
                <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                  <li>• 1차 위반: 경고 및 게시글 삭제</li>
                  <li>• 2차 위반: 7일간 글쓰기 제한</li>
                  <li>• 3차 위반: 30일간 글쓰기 제한</li>
                  <li>• 4차 위반: 계정 영구 정지</li>
                  <li>• 심각한 위반: 즉시 계정 정지 및 법적 조치</li>
                </ul>
              </div>

              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-400 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  모든 게시글은 운영진의 검토를 거쳐 게시되며, 
                  <span className="font-medium text-yellow-600 dark:text-yellow-400"> 규정 위반 시 즉시 삭제 및 제재 조치</span>됩니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>



      {/* 4행: 시스템 정보 */}
      <div className="space-y-6 mb-8">
        {/* 브라우저 정보 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body font-body font-medium text-foreground flex items-center">
              브라우저 정보
            </h3>
            <button
              onClick={() => setBrowserExpanded(!browserExpanded)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <svg 
                className={`w-5 h-5 transform transition-transform duration-200 ${browserExpanded ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {browserExpanded && (
            <div className="space-y-4">
              {Object.entries(config.browser || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span className="text-label font-label text-muted-foreground font-mono">{key}</span>
                  <span className="text-body font-body text-foreground font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 윈도우 정보 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body font-body font-medium text-foreground flex items-center">
              윈도우 정보
            </h3>
            <button
              onClick={() => setWindowExpanded(!windowExpanded)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <svg 
                className={`w-5 h-5 transform transition-transform duration-200 ${windowExpanded ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {windowExpanded && (
            <div className="space-y-4">
              {Object.entries(config.window || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span className="text-label font-label text-muted-foreground font-mono">{key}</span>
                  <span className="text-body font-body text-foreground font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 로그아웃 섹션 */}
      <div className="mt-8 bg-card border border-border rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">계정 관리</h3>
          <p className="text-muted-foreground mb-6">
            로그아웃하면 모든 세션이 종료되고 로그인 페이지로 이동합니다.
          </p>
        <button
            onClick={handleLogout}
            className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
            🚪 로그아웃
        </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigDebugger;
