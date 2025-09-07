'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import NavigationBar from '../../components/NavigationBar'
import { useAuth } from '../../contexts/AuthContext'
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Activity,
  Target,
  Award,
  Settings,
  LogOut,
  Star
} from 'lucide-react'
import Image from 'next/image'

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  birthDate: string
  address: string
  phone: string
  bio: string
  fitnessGoal: string
  activityLevel: string
  height: number
  weight: number
  joinDate: string
  totalSteps: number
  achievements: string[]
  badges: {
    id: string
    name: string
    description: string
    icon: string
    category: 'daily' | 'weekly' | 'monthly' | 'special' | 'challenge'
    requirement: number
    current: number
    isUnlocked: boolean
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    unlockedAt?: string
  }[]
  preferences: {
    notifications: boolean
    privacy: boolean
    theme: string
  }
  privacySettings: {
    personalInfo: boolean  // 개인정보 공개 여부
    healthInfo: boolean    // 건강정보 공개 여부
    achievements: boolean  // 성과 공개 여부
  }
}

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth()
  const searchParams = useSearchParams()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'achievements'>('profile')
  const [isOwnProfile, setIsOwnProfile] = useState(true) // 본인 프로필인지 여부
  const [profileImage, setProfileImage] = useState<string | null>(null) // 프로필 이미지 상태
  
  // URL 파라미터에서 사용자 ID 확인
  useEffect(() => {
    const userId = searchParams.get('userId')
    if (userId && userId !== user?.id) {
      setIsOwnProfile(false)
      // 여기서 다른 사용자의 프로필 데이터를 가져오는 로직 추가
      // 예: fetchUserProfile(userId)
    } else {
      setIsOwnProfile(true)
    }
  }, [searchParams, user?.id])
  
  // 사용자 프로필 상태
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '',
    name: '김건강',
    email: user?.email || '',
    avatar: '👤',
    birthDate: '1990-01-01',
    address: '서울특별시 강남구',
    phone: '010-1234-5678',
    bio: '건강한 삶을 추구하는 운동 애호가입니다. 매일 꾸준한 운동으로 건강을 관리하고 있습니다.',
    fitnessGoal: '체중 감량',
    activityLevel: '활발함',
    height: 175,
    weight: 70,
    joinDate: '2024-01-15',
    totalSteps: 1250000,
    achievements: ['첫 걸음', '1만 걸음 달성', '1개월 연속 운동', '체중 5kg 감량'],
    badges: [
      // 일일 배지들
      {
        id: 'first_steps',
        name: '첫 걸음',
        description: '처음으로 1,000걸음을 걸었습니다',
        icon: '👶',
        category: 'daily',
        requirement: 1000,
        current: 1000,
        isUnlocked: true,
        rarity: 'common',
        unlockedAt: '2024-01-15'
      },
      {
        id: 'daily_warrior',
        name: '일일 전사',
        description: '하루 10,000걸음 달성',
        icon: '⚔️',
        category: 'daily',
        requirement: 10000,
        current: 10000,
        isUnlocked: true,
        rarity: 'common',
        unlockedAt: '2024-01-20'
      },
      {
        id: 'marathon_daily',
        name: '일일 마라톤',
        description: '하루 42,195걸음 달성 (마라톤 거리)',
        icon: '🏃‍♂️',
        category: 'daily',
        requirement: 42195,
        current: 25000,
        isUnlocked: false,
        rarity: 'epic'
      },
      {
        id: 'night_owl',
        name: '올빼미',
        description: '자정 이후 5,000걸음 이상 걸기',
        icon: '🦉',
        category: 'daily',
        requirement: 5000,
        current: 0,
        isUnlocked: false,
        rarity: 'rare'
      },
      {
        id: 'early_bird',
        name: '일찍 일어나는 새',
        description: '오전 6시 이전에 3,000걸음 달성',
        icon: '🐦',
        category: 'daily',
        requirement: 3000,
        current: 1500,
        isUnlocked: false,
        rarity: 'rare'
      },
      
      // 주간 배지들
      {
        id: 'weekend_warrior',
        name: '주말 전사',
        description: '주말 2일 연속 15,000걸음 달성',
        icon: '💪',
        category: 'weekly',
        requirement: 15000,
        current: 12000,
        isUnlocked: false,
        rarity: 'rare'
      },
      {
        id: 'consistency_king',
        name: '꾸준함의 왕',
        description: '일주일 동안 매일 8,000걸음 이상',
        icon: '👑',
        category: 'weekly',
        requirement: 56000,
        current: 45000,
        isUnlocked: false,
        rarity: 'epic'
      },
      {
        id: 'speed_demon',
        name: '속도의 악마',
        description: '1시간 내에 6,000걸음 달성',
        icon: '⚡',
        category: 'special',
        requirement: 6000,
        current: 4000,
        isUnlocked: false,
        rarity: 'epic'
      },
      
      // 월간 배지들
      {
        id: 'monthly_marathon',
        name: '월간 마라톤러',
        description: '한 달에 100만 걸음 달성',
        icon: '🏅',
        category: 'monthly',
        requirement: 1000000,
        current: 1250000,
        isUnlocked: true,
        rarity: 'legendary',
        unlockedAt: '2024-02-15'
      },
      {
        id: 'mountain_climber',
        name: '산악인',
        description: '한 달에 200만 걸음 달성',
        icon: '⛰️',
        category: 'monthly',
        requirement: 2000000,
        current: 1250000,
        isUnlocked: false,
        rarity: 'legendary'
      },
      
      // 특별 배지들
      {
        id: 'midnight_walker',
        name: '한밤중의 산책자',
        description: '자정에 정확히 12,000걸음 달성',
        icon: '🌙',
        category: 'special',
        requirement: 12000,
        current: 0,
        isUnlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'lucky_seven',
        name: '럭키 세븐',
        description: '7시 7분에 7,777걸음 달성',
        icon: '🍀',
        category: 'special',
        requirement: 7777,
        current: 0,
        isUnlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'rain_walker',
        name: '빗속의 산책자',
        description: '비 오는 날 10,000걸음 달성',
        icon: '☔',
        category: 'special',
        requirement: 10000,
        current: 0,
        isUnlocked: false,
        rarity: 'rare'
      },
      {
        id: 'snow_warrior',
        name: '눈사람 전사',
        description: '눈 오는 날 15,000걸음 달성',
        icon: '❄️',
        category: 'special',
        requirement: 15000,
        current: 0,
        isUnlocked: false,
        rarity: 'epic'
      },
      
      // 챌린지 배지들
      {
        id: 'step_master',
        name: '걸음수 마스터',
        description: '총 1억 걸음 달성',
        icon: '🎯',
        category: 'challenge',
        requirement: 100000000,
        current: 1250000,
        isUnlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'streak_legend',
        name: '연속의 전설',
        description: '100일 연속 10,000걸음 달성',
        icon: '🔥',
        category: 'challenge',
        requirement: 1000000,
        current: 250000,
        isUnlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'time_traveler',
        name: '시간 여행자',
        description: '24시간 내에 24,000걸음 달성',
        icon: '⏰',
        category: 'challenge',
        requirement: 24000,
        current: 18000,
        isUnlocked: false,
        rarity: 'epic'
      },
      {
        id: 'dance_king',
        name: '댄스킹',
        description: '1분에 200걸음 이상으로 30분간 걷기',
        icon: '💃',
        category: 'challenge',
        requirement: 6000,
        current: 0,
        isUnlocked: false,
        rarity: 'rare'
      },
      {
        id: 'zen_walker',
        name: '선(禪) 산책자',
        description: '정확히 10,000걸음으로 끝내기',
        icon: '🧘‍♂️',
        category: 'challenge',
        requirement: 10000,
        current: 0,
        isUnlocked: false,
        rarity: 'epic'
      },
      {
        id: 'reverse_walker',
        name: '역주행자',
        description: '오후에 5,000걸음, 오전에 5,000걸음 달성',
        icon: '🔄',
        category: 'challenge',
        requirement: 10000,
        current: 0,
        isUnlocked: false,
        rarity: 'rare'
      }
    ],
    preferences: {
      notifications: true,
      privacy: false,
      theme: 'dark'
    },
    privacySettings: {
      personalInfo: true,   // 개인정보 공개
      healthInfo: false,    // 건강정보 비공개
      achievements: true    // 성과 공개
    }
  })

  // 편집용 임시 상태
  const [editProfile, setEditProfile] = useState<UserProfile>(profile)

  // 프로필 업데이트
  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setEditProfile(prev => ({ ...prev, [field]: value }))
  }

  // 프로필 저장
  const handleSaveProfile = () => {
    setProfile(editProfile)
    setIsEditing(false)
    // 여기에 실제 API 호출 로직 추가
    console.log('프로필 저장:', editProfile)
    if (profileImage) {
      console.log('프로필 이미지 저장:', profileImage)
      // 여기에 이미지 서버 업로드 로직 추가
    }
  }

  // 프로필 취소
  const handleCancelEdit = () => {
    setEditProfile(profile)
    setIsEditing(false)
    setProfileImage(null)
    // 파일 입력 초기화
    const fileInput = document.getElementById('profile-image-input') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // 로그아웃
  const handleLogout = async () => {
    try {
      await signOut()
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login'
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  // 비공개 정보 표시 컴포넌트
  const PrivateInfoMessage = ({ category }: { category: string }) => (
    <div className="flex items-center justify-center p-4 bg-gray-800/50 border border-gray-600/30 rounded-lg">
      <div className="text-center">
        <Shield className="w-8 h-8 text-gray-500 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">
          {category}은(는) 비공개 설정입니다
        </p>
      </div>
    </div>
  )

  // 정보 표시 여부 확인 함수
  const shouldShowInfo = (category: 'personalInfo' | 'healthInfo' | 'achievements') => {
    return isOwnProfile || profile.privacySettings[category]
  }

  // 이미지 업로드 처리
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.')
        return
      }

      // 이미지 파일 타입 확인
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
      }

      // FileReader를 사용하여 이미지 미리보기
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileImage(result)
        // 여기서 실제 서버에 이미지 업로드하는 로직 추가
        console.log('이미지 업로드:', file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  // 이미지 제거
  const handleImageRemove = () => {
    setProfileImage(null)
    // 파일 입력 초기화
    const fileInput = document.getElementById('profile-image-input') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <main className="flex-1 p-3 sm:p-6 pb-32 text-white relative z-10">
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* 왼쪽 원형 장식 */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 left-20 w-16 h-16 border border-blue-500/20 rounded-full animate-pulse delay-1000"></div>
          
          {/* 오른쪽 원형 장식 */}
          <div className="absolute top-40 right-16 w-24 h-24 border border-purple-500/20 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-60 right-8 w-12 h-12 border border-blue-500/20 rounded-full animate-pulse delay-1500"></div>
          
          {/* 작은 점들 */}
          <div className="absolute top-16 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-32 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-20">
          {/* 헤더 */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-pulse px-4">
              PROFILE
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg px-4">나의 건강 정보를 관리하세요</p>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-1 sm:p-2 flex shadow-2xl shadow-purple-500/20">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 font-bold text-xs sm:text-sm uppercase tracking-wider ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 border border-purple-400/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                프로필
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 font-bold text-xs sm:text-sm uppercase tracking-wider ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 border border-purple-400/50'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  설정
                </button>
              )}
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 font-bold text-xs sm:text-sm uppercase tracking-wider ${
                  activeTab === 'achievements'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 border border-purple-400/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                성과
              </button>
            </div>
          </div>

          {/* 프로필 탭 */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* 프로필 카드 */}
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-500/20">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* 아바타 */}
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-4xl sm:text-5xl text-white shadow-lg overflow-hidden">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="프로필 이미지"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : isEditing ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={editProfile.avatar}
                            onChange={(e) => handleProfileChange('avatar', e.target.value)}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-transparent border-2 border-white/30 rounded-full text-center text-2xl sm:text-3xl text-white focus:outline-none focus:border-white/60"
                            maxLength={2}
                          />
                        </div>
                      ) : (
                        profile.avatar
                      )}
                    </div>
                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2 flex space-x-1">
                        {/* 이미지 업로드 버튼 */}
                        <label 
                          className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors cursor-pointer group relative"
                          title="사진 업로드"
                        >
                          <Camera className="w-4 h-4" />
                          <input
                            id="profile-image-input"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          {/* 툴팁 */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            갤러리에서 선택
                          </div>
                        </label>
                        {/* 이미지 제거 버튼 */}
                        {profileImage && (
                          <button
                            onClick={handleImageRemove}
                            className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors group relative"
                            title="사진 제거"
                          >
                            <X className="w-4 h-4" />
                            {/* 툴팁 */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              사진 제거
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 기본 정보 */}
                  <div className="flex-1 text-center sm:text-left">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editProfile.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          className="w-full px-4 py-2 bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white text-xl font-bold focus:outline-none focus:border-purple-400"
                        />
                        <input
                          type="email"
                          value={editProfile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className="w-full px-4 py-2 bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg text-gray-300 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{profile.name}</h2>
                        <p className="text-gray-300 text-sm sm:text-base">{profile.email}</p>
                      </div>
                    )}
                    
                  </div>

                  {/* 액션 버튼 - 본인 프로필일 때만 표시 */}
                  {isOwnProfile && (
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveProfile}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 flex items-center space-x-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>저장</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-gray-500/25 hover:shadow-gray-500/40 flex items-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>취소</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center space-x-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>편집</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 상세 정보 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 개인 정보 */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 shadow-2xl shadow-blue-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-400" />
                      개인 정보
                    </h3>
                    {isOwnProfile && (
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile.privacySettings.personalInfo}
                            onChange={(e) => setProfile(prev => ({
                              ...prev,
                              privacySettings: { ...prev.privacySettings, personalInfo: e.target.checked }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {shouldShowInfo('personalInfo') ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <label className="text-sm text-gray-400">생년월일</label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={editProfile.birthDate}
                              onChange={(e) => handleProfileChange('birthDate', e.target.value)}
                              className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
                            />
                          ) : (
                            <p className="text-white">{profile.birthDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <label className="text-sm text-gray-400">주소</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editProfile.address}
                              onChange={(e) => handleProfileChange('address', e.target.value)}
                              className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
                            />
                          ) : (
                            <p className="text-white">{profile.address}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <label className="text-sm text-gray-400">전화번호</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editProfile.phone}
                              onChange={(e) => handleProfileChange('phone', e.target.value)}
                              className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
                            />
                          ) : (
                            <p className="text-white">{profile.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <PrivateInfoMessage category="개인정보" />
                  )}
                </div>

                {/* 건강 정보 */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 shadow-2xl shadow-green-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-400" />
                      건강 정보
                    </h3>
                    {isOwnProfile && (
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile.privacySettings.healthInfo}
                            onChange={(e) => setProfile(prev => ({
                              ...prev,
                              privacySettings: { ...prev.privacySettings, healthInfo: e.target.checked }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {shouldShowInfo('healthInfo') ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">키 (cm)</label>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editProfile.height}
                              onChange={(e) => handleProfileChange('height', parseInt(e.target.value))}
                              className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
                            />
                          ) : (
                            <p className="text-white text-lg font-semibold">{profile.height}cm</p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">몸무게 (kg)</label>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editProfile.weight}
                              onChange={(e) => handleProfileChange('weight', parseInt(e.target.value))}
                              className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
                            />
                          ) : (
                            <p className="text-white text-lg font-semibold">{profile.weight}kg</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">운동 목표</label>
                        {isEditing ? (
                          <select
                            value={editProfile.fitnessGoal}
                            onChange={(e) => handleProfileChange('fitnessGoal', e.target.value)}
                            className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
                          >
                            <option value="체중 감량">체중 감량</option>
                            <option value="근육 증가">근육 증가</option>
                            <option value="체력 향상">체력 향상</option>
                            <option value="유연성 향상">유연성 향상</option>
                          </select>
                        ) : (
                          <p className="text-white">{profile.fitnessGoal}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">활동 수준</label>
                        {isEditing ? (
                          <select
                            value={editProfile.activityLevel}
                            onChange={(e) => handleProfileChange('activityLevel', e.target.value)}
                            className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
                          >
                            <option value="비활동적">비활동적</option>
                            <option value="가벼운 활동">가벼운 활동</option>
                            <option value="활발함">활발함</option>
                            <option value="매우 활발함">매우 활발함</option>
                          </select>
                        ) : (
                          <p className="text-white">{profile.activityLevel}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <PrivateInfoMessage category="건강정보" />
                  )}
                </div>
              </div>

              {/* 자기소개 */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-purple-400" />
                  자기소개
                </h3>
                {isEditing ? (
                  <textarea
                    value={editProfile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 resize-none h-24"
                    placeholder="자기소개를 입력하세요..."
                  />
                ) : (
                  <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </div>
          )}

          {/* 설정 탭 */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* 프라이버시 설정 */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-400" />
                  프라이버시 설정
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-purple-500/20">
                    <div>
                      <h4 className="text-white font-semibold flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-400" />
                        개인정보 공개
                      </h4>
                      <p className="text-gray-400 text-sm">생년월일, 주소, 전화번호 공개 여부</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.privacySettings.personalInfo}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          privacySettings: { ...prev.privacySettings, personalInfo: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-green-500/20">
                    <div>
                      <h4 className="text-white font-semibold flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-green-400" />
                        건강정보 공개
                      </h4>
                      <p className="text-gray-400 text-sm">키, 몸무게, 운동목표, 활동수준 공개 여부</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.privacySettings.healthInfo}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          privacySettings: { ...prev.privacySettings, healthInfo: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-yellow-500/20">
                    <div>
                      <h4 className="text-white font-semibold flex items-center">
                        <Award className="w-4 h-4 mr-2 text-yellow-400" />
                        성과 공개
                      </h4>
                      <p className="text-gray-400 text-sm">걸음수, 달성 성과, 운동 통계 공개 여부</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.privacySettings.achievements}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          privacySettings: { ...prev.privacySettings, achievements: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 계정 설정 */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-cyan-400" />
                  계정 설정
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">알림 설정</h4>
                      <p className="text-gray-400 text-sm">푸시 알림을 받을지 선택하세요</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, notifications: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">프로필 공개</h4>
                      <p className="text-gray-400 text-sm">전체 프로필을 공개할지 선택하세요</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.preferences.privacy}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, privacy: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 shadow-2xl shadow-red-500/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <LogOut className="w-5 h-5 mr-2 text-red-400" />
                  계정 관리
                </h3>
                <div className="space-y-4">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 성과 탭 */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* 통계 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6 text-center shadow-2xl shadow-purple-500/20">
                  <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  {shouldShowInfo('achievements') ? (
                    <>
                      <h3 className="text-2xl font-bold text-white">{profile.totalSteps.toLocaleString()}</h3>
                      <p className="text-gray-400">총 걸음수</p>
                    </>
                  ) : (
                    <PrivateInfoMessage category="걸음수" />
                  )}
                </div>
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6 text-center shadow-2xl shadow-green-500/20">
                  <Award className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  {shouldShowInfo('achievements') ? (
                    <>
                      <h3 className="text-2xl font-bold text-white">{profile.badges.filter(badge => badge.isUnlocked).length}</h3>
                      <p className="text-gray-400">달성한 배지</p>
                      <div className="mt-2 text-xs text-gray-300">
                        총 {profile.badges.length}개 중
                      </div>
                    </>
                  ) : (
                    <PrivateInfoMessage category="성과" />
                  )}
                </div>
                <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-6 text-center shadow-2xl shadow-cyan-500/20">
                  <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  {shouldShowInfo('achievements') ? (
                    <>
                      <h3 className="text-2xl font-bold text-white">365</h3>
                      <p className="text-gray-400">연속 운동일</p>
                    </>
                  ) : (
                    <PrivateInfoMessage category="운동일" />
                  )}
                </div>
              </div>

              {/* 성과 목록 */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 shadow-2xl shadow-yellow-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-400" />
                    달성한 성과
                  </h3>
                  {isOwnProfile && (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.privacySettings.achievements}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            privacySettings: { ...prev.privacySettings, achievements: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-600"></div>
                      </label>
                    </div>
                  )}
                </div>
                
                {shouldShowInfo('achievements') ? (
                  <div className="space-y-6">
                    {/* 달성한 배지들 */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-yellow-400" />
                        달성한 배지 ({profile.badges.filter(badge => badge.isUnlocked).length}/{profile.badges.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {profile.badges.filter(badge => badge.isUnlocked).map((badge) => (
                          <div key={badge.id} className="relative group">
                            <div className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                              badge.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/25' :
                              badge.rarity === 'epic' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-lg shadow-purple-500/25' :
                              badge.rarity === 'rare' ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50 shadow-lg shadow-blue-500/25' :
                              'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-gray-500/50'
                            }`}>
                              <div className="text-center">
                                <div className="text-3xl mb-2">{badge.icon}</div>
                                <h5 className="text-white font-semibold text-sm mb-1">{badge.name}</h5>
                                <p className="text-gray-300 text-xs mb-2">{badge.description}</p>
                                <div className="text-xs text-gray-400">
                                  {badge.unlockedAt && `달성일: ${badge.unlockedAt}`}
                                </div>
                              </div>
                            </div>
                            {/* 툴팁 */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {badge.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 진행 중인 배지들 */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-blue-400" />
                        진행 중인 배지 ({profile.badges.filter(badge => !badge.isUnlocked && badge.current > 0).length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.badges.filter(badge => !badge.isUnlocked && badge.current > 0).map((badge) => (
                          <div key={badge.id} className="p-4 bg-gray-800/50 border border-gray-600/30 rounded-lg">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="text-2xl opacity-50">{badge.icon}</div>
                              <div>
                                <h5 className="text-white font-semibold">{badge.name}</h5>
                                <p className="text-gray-400 text-sm">{badge.description}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">진행률</span>
                                <span className="text-white">{Math.round((badge.current / badge.requirement) * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min((badge.current / badge.requirement) * 100, 100)}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>{badge.current.toLocaleString()} / {badge.requirement.toLocaleString()}</span>
                                <span className={`px-2 py-1 rounded ${
                                  badge.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                                  badge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                                  badge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                                  'bg-gray-500/20 text-gray-300'
                                }`}>
                                  {badge.rarity.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 기존 성과들 */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-green-400" />
                        기타 성과
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
                            <Award className="w-5 h-5 text-green-400" />
                            <span className="text-white font-medium">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <PrivateInfoMessage category="성과" />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <NavigationBar />
    </div>
  )
}

export default function ProfilePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePage />
    </Suspense>
  )
}
