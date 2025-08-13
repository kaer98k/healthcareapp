# Healthcare App - 헬스케어 앱

건강 관리와 운동 추천을 위한 웹 애플리케이션입니다.

## 🚀 주요 기능

- **사용자 인증**: Supabase를 통한 이메일/비밀번호 로그인 및 회원가입
- **프로필 관리**: 개인 정보, 운동 목표, 경험 수준 등 설정
- **운동 추천**: 사용자 프로필 기반 맞춤형 운동 프로그램 추천
- **운동 기록**: 개인 운동 이력 관리 및 통계
- **데이터 동기화**: Supabase를 통한 실시간 데이터 동기화

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React Context API
- **Build Tool**: Vite

## 📋 Supabase 설정

### 1. 프로젝트 생성
1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트 생성
2. 프로젝트 URL과 API 키 확인

### 2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 데이터베이스 스키마
Supabase SQL 편집기에서 다음 테이블들을 생성:

```sql
-- 사용자 프로필 테이블
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
  height INTEGER NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  fitness_goal TEXT NOT NULL,
  experience TEXT CHECK (experience IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  equipment TEXT NOT NULL,
  available_time INTEGER NOT NULL,
  medical_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 운동 기록 테이블
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  exercises JSONB NOT NULL,
  duration INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  calories INTEGER NOT NULL,
  description TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 운동 로그 테이블
CREATE TABLE exercise_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL(5,2),
  time INTEGER,
  rest_time INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

-- 사용자 프로필 정책
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- 운동 기록 정책
CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- 운동 로그 정책
CREATE POLICY "Users can view own exercise logs" ON exercise_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise logs" ON exercise_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise logs" ON exercise_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercise logs" ON exercise_logs
  FOR DELETE USING (auth.uid() = user_id);
```

## 🚀 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Auth/           # 인증 관련 컴포넌트
│   └── Profile/        # 프로필 관련 컴포넌트
├── contexts/           # React Context
├── lib/                # 라이브러리 설정
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── App.tsx             # 메인 앱 컴포넌트
```

## 🔐 인증 시스템

- **회원가입**: 이메일 인증을 통한 계정 생성
- **로그인**: 이메일/비밀번호 로그인
- **비밀번호 재설정**: 이메일을 통한 비밀번호 재설정
- **세션 관리**: 자동 토큰 갱신 및 세션 유지

## 💾 데이터 관리

- **사용자 프로필**: 개인 정보 및 운동 설정
- **운동 추천**: AI 기반 맞춤형 운동 프로그램
- **운동 기록**: 개인 운동 이력 및 통계
- **실시간 동기화**: Supabase를 통한 실시간 데이터 업데이트

## 🎯 운동 추천 시스템

- **목표 기반**: 체중 감량, 근육량 증가, 근력 향상 등
- **경험 수준**: 초보자, 중급자, 고급자별 맞춤 프로그램
- **장비 고려**: 보유 장비에 따른 운동 선택
- **시간 최적화**: 사용 가능한 시간에 맞춘 운동 계획

## 📱 반응형 디자인

- **모바일 우선**: 모바일 기기에 최적화된 UI/UX
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **접근성**: 웹 접근성 가이드라인 준수

## 🔧 개발 도구

- **ESLint**: 코드 품질 관리
- **TypeScript**: 타입 안전성 보장
- **Vite**: 빠른 개발 및 빌드
- **Hot Reload**: 실시간 코드 변경 반영

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.
