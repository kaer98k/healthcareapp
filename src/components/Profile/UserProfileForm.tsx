import React, { useState } from 'react';

interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_fitness';
}

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    activityLevel: 'moderate',
    fitnessGoal: 'general_fitness'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="panel-container max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-panel-header font-panel-header text-text-primary mb-2">
          사용자 프로필 설정
        </h2>
        <p className="text-body font-body text-text-secondary">
          개인 맞춤형 운동 추천을 위해 프로필 정보를 입력해주세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-label font-label text-text-secondary mb-2">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={profile.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="form-input w-full px-4 py-3"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-label font-label text-text-secondary mb-2">
              나이
            </label>
            <input
              id="age"
              type="number"
              min="1"
              max="120"
              value={profile.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              className="form-input w-full px-4 py-3"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="gender" className="block text-label font-label text-text-secondary mb-2">
              성별
            </label>
            <select
              id="gender"
              value={profile.gender}
              onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | 'other')}
              className="form-input w-full px-4 py-3"
              required
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div>
            <label htmlFor="height" className="block text-label font-label text-text-secondary mb-2">
              키 (cm)
            </label>
            <input
              id="height"
              type="number"
              min="100"
              max="250"
              value={profile.height}
              onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
              className="form-input w-full px-4 py-3"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="weight" className="block text-label font-label text-text-secondary mb-2">
              체중 (kg)
            </label>
            <input
              id="weight"
              type="number"
              min="30"
              max="300"
              step="0.1"
              value={profile.weight}
              onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
              className="form-input w-full px-4 py-3"
              required
            />
          </div>

          <div>
            <label htmlFor="activityLevel" className="block text-label font-label text-text-secondary mb-2">
              활동 수준
            </label>
            <select
              id="activityLevel"
              value={profile.activityLevel}
              onChange={(e) => handleInputChange('activityLevel', e.target.value as UserProfile['activityLevel'])}
              className="form-input w-full px-4 py-3"
              required
            >
              <option value="sedentary">거의 움직이지 않음</option>
              <option value="light">가벼운 활동 (주 1-3일)</option>
              <option value="moderate">보통 활동 (주 3-5일)</option>
              <option value="active">적극적 활동 (주 6-7일)</option>
              <option value="very_active">매우 적극적 활동</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="fitnessGoal" className="block text-label font-label text-text-secondary mb-2">
            피트니스 목표
          </label>
          <select
            id="fitnessGoal"
            value={profile.fitnessGoal}
            onChange={(e) => handleInputChange('fitnessGoal', e.target.value as UserProfile['fitnessGoal'])}
            className="form-input w-full px-4 py-3"
            required
          >
            <option value="weight_loss">체중 감량</option>
            <option value="muscle_gain">근육 증가</option>
            <option value="endurance">지구력 향상</option>
            <option value="flexibility">유연성 향상</option>
            <option value="general_fitness">전반적인 건강</option>
          </select>
        </div>

        <button
          type="submit"
          className="utility-button w-full py-3 px-4 text-body font-body font-medium transition-all duration-200 hover:scale-105"
        >
          프로필 저장 및 운동 추천 받기
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;
