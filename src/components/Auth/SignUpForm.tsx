import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface SignUpFormProps {
  onSuccess?: () => void;
}

interface ProfileSetup {
  nickname: string;
  profileImage: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileSetup, setProfileSetup] = useState<ProfileSetup>({
    nickname: '',
    profileImage: ''
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 회원가입 성공 후 프로필 설정 단계로 이동
        setShowProfileSetup(true);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileSetup.nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 프로필 정보를 사용자 메타데이터에 저장
      const { error } = await supabase.auth.updateUser({
        data: {
          nickname: profileSetup.nickname,
          profileImage: profileSetup.profileImage
        }
      });

      if (error) throw error;

      // 프로필 설정 완료 후 메인 화면으로 이동
      onSuccess?.();
    } catch (error: any) {
      setError('프로필 설정에 실패했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setProfileSetup(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setImagePreview('');
    setProfileSetup(prev => ({ ...prev, profileImage: '' }));
  };

  const checkNicknameDuplicate = async (nickname: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('nickname')
        .eq('nickname', nickname)
        .single();

      if (error) {
        console.error('Error checking nickname duplicate:', error);
        setIsNicknameDuplicate(false); // 에러 발생 시 중복 표시 안 함
        return;
      }

      setIsNicknameDuplicate(!!data); // 데이터가 있으면 중복, 없으면 중복 아님
    } catch (error: any) {
      console.error('Error checking nickname duplicate:', error);
      setIsNicknameDuplicate(false); // 에러 발생 시 중복 표시 안 함
    }
  };

  if (showProfileSetup) {
    return (
      <div className="max-w-md mx-auto p-6 bg-card border border-border rounded-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">프로필 설정</h2>
        <p className="text-muted-foreground mb-6 text-center">
          커뮤니티에서 사용할 프로필을 설정해주세요
        </p>

        <form onSubmit={handleProfileSetup} className="space-y-6">
          {/* 프로필 이미지 설정 */}
          <div className="text-center">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              프로필 이미지 <span className="text-gray-400 text-xs">(선택사항)</span>
            </label>
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
                      type="button"
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
                    type="button"
                    onClick={removeProfileImage}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    🗑️ 삭제
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                프로필 이미지는 나중에 설정에서도 변경할 수 있습니다
              </p>
            </div>
          </div>

          {/* 닉네임 설정 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileSetup.nickname}
              onChange={(e) => {
                const value = e.target.value;
                setProfileSetup(prev => ({ ...prev, nickname: value }));
                // 중복 닉네임 검사 (실시간)
                if (value.trim().length >= 1) {
                  checkNicknameDuplicate(value);
                }
              }}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              placeholder="커뮤니티에서 사용할 닉네임을 입력하세요"
              minLength={1}
              maxLength={12}
              required
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                {profileSetup.nickname.length}/12 (언어/숫자 상관없이 1-12자)
              </p>
              {profileSetup.nickname.trim().length >= 1 && (
                <span className={`text-xs ${isNicknameDuplicate ? 'text-red-500' : 'text-green-500'}`}>
                  {isNicknameDuplicate ? '❌ 사용 불가' : '✅ 사용 가능'}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowProfileSetup(false)}
              className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              뒤로 가기
            </button>
            <button
              type="submit"
              disabled={loading || !profileSetup.nickname.trim() || isNicknameDuplicate}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '설정 중...' : '프로필 설정 완료'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card border border-border rounded-lg">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">회원가입</h2>
      
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            placeholder="이메일을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            placeholder="비밀번호를 입력하세요 (최소 6자)"
            minLength={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
