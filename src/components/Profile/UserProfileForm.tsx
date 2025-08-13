import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { UserProfileService } from '../../lib/supabaseService'
import type { UserProfile } from '../../types/database'

interface UserProfileFormProps {
  onSave?: () => void
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSave }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    fitness_goal: 'general_fitness',
    experience: 'beginner',
    equipment: 'none',
    available_time: 60,
    medical_conditions: ''
  })

  // 기존 프로필 로드
  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user])

  const loadUserProfile = async () => {
    if (!user) return
    
    try {
      const existingProfile = await UserProfileService.getUserProfile(user.id)
      if (existingProfile) {
        setProfile(existingProfile)
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const profileData = {
        ...profile,
        user_id: user.id
      }

      const success = await UserProfileService.upsertUserProfile(profileData)
      
      if (success) {
        setSaved(true)
        onSave?.()
        
        // 3초 후 저장 완료 메시지 숨기기
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError('프로필 저장에 실패했습니다.')
      }
    } catch (error) {
      setError('프로필 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const fitnessGoals = [
    { value: 'weight_loss', label: '체중 감량' },
    { value: 'muscle_gain', label: '근육량 증가' },
    { value: 'strength', label: '근력 향상' },
    { value: 'endurance', label: '지구력 향상' },
    { value: 'flexibility', label: '유연성 향상' },
    { value: 'general_fitness', label: '전반적인 체력 향상' }
  ]

  const experienceLevels = [
    { value: 'beginner', label: '초보자' },
    { value: 'intermediate', label: '중급자' },
    { value: 'advanced', label: '고급자' }
  ]

  const equipmentOptions = [
    { value: 'none', label: '없음 (맨몸 운동)' },
    { value: 'basic', label: '기본 (덤벨, 매트 등)' },
    { value: 'full', label: '완비 (바벨, 벤치 등)' }
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">프로필 설정</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          프로필이 성공적으로 저장되었습니다!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 *
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              나이 *
            </label>
            <input
              type="number"
              min="10"
              max="100"
              value={profile.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성별 *
            </label>
            <select
              value={profile.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              키 (cm) *
            </label>
            <input
              type="number"
              min="100"
              max="250"
              value={profile.height}
              onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              체중 (kg) *
            </label>
            <input
              type="number"
              min="30"
              max="200"
              step="0.1"
              value={profile.weight}
              onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              운동 목표 *
            </label>
            <select
              value={profile.fitness_goal}
              onChange={(e) => handleInputChange('fitness_goal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {fitnessGoals.map(goal => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              운동 경험 *
            </label>
            <select
              value={profile.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              보유 장비 *
            </label>
            <select
              value={profile.equipment}
              onChange={(e) => handleInputChange('equipment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {equipmentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              운동 가능 시간 (분) *
            </label>
            <input
              type="number"
              min="15"
              max="180"
              step="15"
              value={profile.available_time}
              onChange={(e) => handleInputChange('available_time', parseInt(e.target.value))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* 의료 정보 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주의사항 (선택사항)
          </label>
          <textarea
            value={profile.medical_conditions || ''}
            onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="건강상 주의사항이나 특별한 조건이 있다면 입력해주세요"
          />
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '저장 중...' : '프로필 저장'}
          </button>
        </div>
      </form>
    </div>
  )
}
