-- KRPIC 관리자 시스템을 위한 Supabase 테이블 스키마
-- Supabase SQL Editor에서 실행하세요

-- 1. 프로필 테이블 (사용자 추가 정보)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 교육 프로그램 테이블
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price INTEGER DEFAULT 0,
  duration TEXT,
  thumbnail TEXT,
  instructor TEXT DEFAULT '전문 상담사',
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 새 컬럼 추가 (기존 테이블이 있는 경우)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor TEXT DEFAULT '전문 상담사';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS detail_images TEXT[] DEFAULT '{}';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 진도 추적 필드 추가 (기존 enrollments 테이블이 있는 경우)
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS watched_seconds INTEGER DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS video_duration_seconds INTEGER DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS last_watched_position INTEGER DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS max_watched_position INTEGER DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS certificate_number TEXT;

-- 3. 수강 신청 테이블
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
  payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid, refunded
  payment_amount INTEGER DEFAULT 0,
  notes TEXT,
  -- 진도 추적 필드
  watched_seconds INTEGER DEFAULT 0,
  video_duration_seconds INTEGER DEFAULT 0,
  last_watched_position INTEGER DEFAULT 0,
  max_watched_position INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  certificate_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 4. 프로필 자동 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거 삭제 후 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. 프로필 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments;
CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS (Row Level Security) 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- 프로필 정책
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- 교육 프로그램 정책
CREATE POLICY "Anyone can view active courses" ON courses
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can do anything with courses" ON courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- 수강 신청 정책
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own enrollments" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can do anything with enrollments" ON enrollments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- 7. 기존 사용자들의 프로필 생성 (이미 가입한 사용자가 있는 경우)
INSERT INTO profiles (id, email, name, phone)
SELECT
  id,
  email,
  raw_user_meta_data->>'name',
  raw_user_meta_data->>'phone'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- 8. 첫 번째 관리자 설정 (여기에 관리자로 지정할 이메일 입력)
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'admin@example.com';
