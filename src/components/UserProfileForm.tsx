import React, { useState } from 'react';
// 타입은 any로 사용하여 import 문제 해결
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface UserProfileFormProps {
  onSubmit: (profile: any, oneRM: any) => void;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<any>>({});
  const [oneRM, setOneRM] = useState<Partial<any>>({});

  const handleProfileChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleOneRMChange = (field: string, value: number) => {
    setOneRM(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step === 1 && isProfileValid()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const isProfileValid = () => {
    return profile.name && profile.age && profile.gender && profile.height && profile.weight;
  };

  const handleSubmit = () => {
    if (isProfileValid()) {
      onSubmit(profile, oneRM);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">기본 정보 입력</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">이름 *</Label>
          <Input
            id="name"
            type="text"
            placeholder="이름을 입력하세요"
            value={profile.name || ''}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">나이 *</Label>
          <Input
            id="age"
            type="number"
            placeholder="나이를 입력하세요"
            value={profile.age || ''}
            onChange={(e) => handleProfileChange('age', parseInt(e.target.value))}
            min="10"
            max="100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">성별 *</Label>
          <select
            id="gender"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={profile.gender || ''}
            onChange={(e) => handleProfileChange('gender', e.target.value)}
            required
          >
            <option value="">성별을 선택하세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">키 (cm) *</Label>
          <Input
            id="height"
            type="number"
            placeholder="키를 입력하세요"
            value={profile.height || ''}
            onChange={(e) => handleProfileChange('height', parseInt(e.target.value))}
            min="100"
            max="250"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">몸무게 (kg) *</Label>
          <Input
            id="weight"
            type="number"
            placeholder="몸무게를 입력하세요"
            value={profile.weight || ''}
            onChange={(e) => handleProfileChange('weight', parseInt(e.target.value))}
            min="30"
            max="200"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="activityLevel">활동 수준 *</Label>
          <select
            id="activityLevel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={profile.activityLevel || ''}
            onChange={(e) => handleProfileChange('activityLevel', e.target.value)}
            required
          >
            <option value="">활동 수준을 선택하세요</option>
            <option value="sedentary">거의 움직이지 않음 (사무직)</option>
            <option value="light">가벼운 활동 (주 1-3일 운동)</option>
            <option value="moderate">보통 활동 (주 3-5일 운동)</option>
            <option value="active">적극적 활동 (주 6-7일 운동)</option>
            <option value="very_active">매우 적극적 활동 (매일 운동)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={nextStep} disabled={!isProfileValid()}>
          다음 단계 →
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">운동 목표 및 경험</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fitnessGoal">운동 목표 *</Label>
          <select
            id="fitnessGoal"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={profile.fitnessGoal || ''}
            onChange={(e) => handleProfileChange('fitnessGoal', e.target.value)}
            required
          >
            <option value="">운동 목표를 선택하세요</option>
            <option value="weight_loss">체중 감량</option>
            <option value="muscle_gain">근육량 증가</option>
            <option value="strength">근력 향상</option>
            <option value="endurance">지구력 향상</option>
            <option value="flexibility">유연성 향상</option>
            <option value="general_fitness">전반적인 건강</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">운동 경험 *</Label>
          <select
            id="experience"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={profile.experience || ''}
            onChange={(e) => handleProfileChange('experience', e.target.value)}
            required
          >
            <option value="">운동 경험을 선택하세요</option>
            <option value="beginner">초보자 (6개월 미만)</option>
            <option value="intermediate">중급자 (6개월-2년)</option>
            <option value="advanced">고급자 (2년 이상)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableTime">운동 가능 시간 (분) *</Label>
          <Input
            id="availableTime"
            type="number"
            placeholder="운동 가능 시간을 입력하세요"
            value={profile.availableTime || ''}
            onChange={(e) => handleProfileChange('availableTime', parseInt(e.target.value))}
            min="15"
            max="180"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipment">사용 가능한 장비 *</Label>
          <select
            id="equipment"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={profile.equipment || ''}
            onChange={(e) => handleProfileChange('equipment', e.target.value)}
            required
          >
            <option value="">사용 가능한 장비를 선택하세요</option>
            <option value="none">장비 없음 (맨몸 운동)</option>
            <option value="basic">기본 장비 (덤벨, 매트 등)</option>
            <option value="full_gym">풀짐 (바벨, 머신 등)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          ← 이전 단계
        </Button>
        <Button onClick={nextStep}>
          다음 단계 →
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">1RM 정보 (선택사항)</h3>
      <p className="text-gray-600 text-center mb-6">
        1RM을 모르는 경우 비워두셔도 됩니다. 추후 측정하여 업데이트할 수 있습니다.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="squat">스쿼트 1RM (kg)</Label>
          <Input
            id="squat"
            type="number"
            placeholder="스쿼트 1RM을 입력하세요"
            value={oneRM.squat || ''}
            onChange={(e) => handleOneRMChange('squat', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="benchPress">벤치프레스 1RM (kg)</Label>
          <Input
            id="benchPress"
            type="number"
            placeholder="벤치프레스 1RM을 입력하세요"
            value={oneRM.benchPress || ''}
            onChange={(e) => handleOneRMChange('benchPress', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadlift">데드리프트 1RM (kg)</Label>
          <Input
            id="deadlift"
            type="number"
            placeholder="데드리프트 1RM을 입력하세요"
            value={oneRM.deadlift || ''}
            onChange={(e) => handleOneRMChange('deadlift', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overheadPress">오버헤드 프레스 1RM (kg)</Label>
          <Input
            id="overheadPress"
            type="number"
            placeholder="오버헤드 프레스 1RM을 입력하세요"
            value={oneRM.overheadPress || ''}
            onChange={(e) => handleOneRMChange('overheadPress', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="barbellRow">바벨 로우 1RM (kg)</Label>
          <Input
            id="barbellRow"
            type="number"
            placeholder="바벨 로우 1RM을 입력하세요"
            value={oneRM.barbellRow || ''}
            onChange={(e) => handleOneRMChange('barbellRow', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          ← 이전 단계
        </Button>
        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
          운동 추천 받기 🚀
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl text-blue-600">맞춤형 운동 추천</CardTitle>
        <CardDescription className="text-lg">
          {step === 1 && "기본 정보를 입력해주세요"}
          {step === 2 && "운동 목표와 경험을 알려주세요"}
          {step === 3 && "1RM 정보를 입력해주세요 (선택사항)"}
        </CardDescription>
        
        {/* 진행 단계 표시 */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-3 h-3 rounded-full ${
                  stepNumber === step
                    ? 'bg-blue-600'
                    : stepNumber < step
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </CardContent>
    </Card>
  );
};
