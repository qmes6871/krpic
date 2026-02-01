-- ================================================
-- 공지사항(notices) 및 수강생 후기(reviews) 테이블 설정
-- Supabase SQL Editor에서 실행하세요.
-- ================================================


-- ================================================
-- 1. 공지사항 테이블 생성
-- ================================================

CREATE TABLE IF NOT EXISTS notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'notice',
  important BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 설정
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (에러 방지)
DROP POLICY IF EXISTS "Anyone can read notices" ON notices;
DROP POLICY IF EXISTS "Authenticated users can insert notices" ON notices;
DROP POLICY IF EXISTS "Authenticated users can update notices" ON notices;
DROP POLICY IF EXISTS "Authenticated users can delete notices" ON notices;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read notices" ON notices
  FOR SELECT USING (true);

-- 인증된 사용자만 생성/수정/삭제 가능
CREATE POLICY "Authenticated users can insert notices" ON notices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update notices" ON notices
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete notices" ON notices
  FOR DELETE TO authenticated USING (true);

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_notice_views(notice_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE notices SET views = views + 1 WHERE id = notice_id;
END;
$$ LANGUAGE plpgsql;


-- ================================================
-- 2. 수강생 후기 테이블 생성
-- ================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author VARCHAR(100) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  helpful INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 설정
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (에러 방지)
DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON reviews;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

-- 인증된 사용자만 생성/수정/삭제 가능
CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update reviews" ON reviews
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete reviews" ON reviews
  FOR DELETE TO authenticated USING (true);

-- 도움됨 수 증가 함수
CREATE OR REPLACE FUNCTION increment_review_helpful(review_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE reviews SET helpful = helpful + 1 WHERE id = review_id;
END;
$$ LANGUAGE plpgsql;


-- ================================================
-- 3. 공지사항 데모 데이터
-- ================================================

INSERT INTO notices (title, content, category, important, views, created_at) VALUES
('2025년 설 연휴 운영 안내', '안녕하세요, KRPIC 재범방지교육통합센터입니다.

2025년 설 연휴 기간 동안 운영 안내를 드립니다.

■ 휴무 기간: 2025년 1월 28일(화) ~ 1월 30일(목)
■ 정상 운영: 2025년 1월 31일(금)부터

휴무 기간 중에도 온라인 교육 수강은 정상적으로 이용 가능합니다.
단, 고객센터 상담 및 수료증 발급 업무는 연휴 이후 순차적으로 처리됩니다.

모두 따뜻하고 행복한 설 연휴 보내시기 바랍니다.
감사합니다.', 'notice', true, 1523, '2025-01-20'),

('신규 교육과정 오픈 - AI 기반 맞춤형 학습 시스템', 'KRPIC 재범방지교육통합센터에서 새로운 AI 기반 맞춤형 학습 시스템을 도입했습니다.

■ 주요 기능:
  - 개인별 학습 패턴 분석
  - 맞춤형 콘텐츠 추천
  - 실시간 학습 피드백
  - 취약 분야 집중 학습

■ 적용 과정: 전 교육과정

더 효과적인 교육 경험을 위해 지속적으로 발전하겠습니다.', 'update', true, 2341, '2025-01-18'),

('모바일 앱 업데이트 안내 (v2.5.0)', 'KRPIC 모바일 앱이 업데이트되었습니다.

■ 버전: 2.5.0
■ 업데이트 내용:
  - 다크모드 지원
  - 오프라인 학습 기능 추가
  - UI/UX 전면 개선
  - 버그 수정 및 성능 최적화

앱스토어/플레이스토어에서 최신 버전으로 업데이트해 주세요.', 'update', false, 1876, '2025-01-15'),

('2025년 신년 이벤트 - 수강료 20% 할인', '새해를 맞아 특별 할인 이벤트를 진행합니다!

■ 이벤트 기간: 2025년 1월 1일 ~ 1월 31일
■ 할인율: 전 과정 20% 할인
■ 쿠폰코드: NEWYEAR2025

※ 기존 할인과 중복 적용 불가
※ 1인 1회 사용 가능

새해에도 KRPIC과 함께 새로운 시작을 하세요!', 'event', true, 4521, '2025-01-01'),

('수료증 발급 시스템 업그레이드 완료', '수료증 발급 시스템이 업그레이드되었습니다.

■ 적용일: 2025년 1월 10일
■ 변경사항:
  - 수료증 디자인 전면 개편
  - QR코드 진위확인 기능 추가
  - PDF/이미지 다운로드 지원
  - 수료 이력 통합 조회

더 나은 서비스를 위해 노력하겠습니다.', 'update', false, 987, '2025-01-10'),

('고객센터 운영시간 확대 안내', '더 나은 서비스를 위해 고객센터 운영시간을 확대합니다.

■ 변경 전: 평일 09:00 ~ 17:00
■ 변경 후: 평일 08:00 ~ 20:00, 토요일 10:00 ~ 17:00

■ 상담 채널:
  - 전화: 1588-0000
  - 카카오톡: @KRPIC
  - 이메일: support@krpic.or.kr

일요일 및 공휴일은 휴무입니다.', 'notice', false, 654, '2025-01-08'),

('온라인 교육 수강 가이드', '온라인 교육 수강 방법을 안내해 드립니다.

■ 수강 절차:
  1. 회원가입 및 로그인
  2. 교육과정 선택 및 결제
  3. 나의 강의실에서 수강 시작
  4. 진도율 100% 달성 시 수료

■ 주의사항:
  - 수강 기간 내 이수 필수
  - 최소 진도율 충족 필요
  - 시험 응시 후 수료증 발급

문의사항은 고객센터로 연락 주세요.', 'guide', false, 3245, '2025-01-05'),

('개인정보처리방침 개정 안내', '개인정보처리방침이 아래와 같이 개정됩니다.

■ 시행일: 2025년 2월 1일
■ 주요 변경사항:
  - 개인정보 보유기간 명확화
  - 제3자 제공 항목 상세화
  - 이용자 권리 행사 방법 개선

개정된 방침은 홈페이지 하단에서 확인하실 수 있습니다.', 'notice', false, 432, '2025-01-03');


-- ================================================
-- 4. 수강생 후기 데모 데이터
-- ================================================

INSERT INTO reviews (author, course_title, category, content, rating, helpful, verified, created_at) VALUES
('김**', '음주운전 교육', 'drunk-driving', '처음에는 형식적인 교육이라고 생각했는데, 실제로 듣고 나니 제 자신을 돌아보게 되었습니다. 앞으로는 절대 음주운전 하지 않겠습니다. 강사님의 실제 사례 설명이 정말 와닿았어요.', 5, 124, true, '2025-01-18'),

('이**', '폭력범죄 교육', 'violence', '분노를 다스리는 방법을 배웠습니다. 상담 선생님도 친절하시고 많은 도움이 되었습니다. 특히 심호흡 기법과 인지행동 치료 부분이 실생활에서 바로 적용할 수 있어서 좋았습니다.', 5, 98, true, '2025-01-17'),

('박**', '준법의식 교육', 'law-compliance', '모바일로 편하게 수강할 수 있어서 좋았습니다. 내용도 이해하기 쉽게 설명되어 있어요. 바쁜 일상 중에도 틈틈이 수강할 수 있어서 편리했습니다.', 4, 76, true, '2025-01-16'),

('최**', '도박중독 교육', 'gambling', '도박의 위험성에 대해 다시 한번 생각하게 되었습니다. 회복 프로그램 연계도 좋은 것 같습니다. 상담사 선생님께서 진심으로 도와주시려는 게 느껴졌어요.', 5, 89, true, '2025-01-15'),

('정**', '재산범죄 교육', 'property', '사례 중심의 교육이라 현실적으로 와닿았습니다. 수료증도 빠르게 발급받았어요. 실제 판례를 통해 배우니 더 기억에 남습니다.', 4, 65, true, '2025-01-14'),

('강**', '디지털범죄 교육', 'digital', '온라인에서 조심해야 할 점들을 배웠습니다. 짧은 시간이지만 알찬 내용이었습니다. SNS 사용 시 주의할 점도 배워서 유익했어요.', 5, 72, true, '2025-01-14'),

('윤**', '음주운전 교육', 'drunk-driving', '2번째 교육이었는데 더 심도있는 내용이라 반성하게 됩니다. 피해자 가족의 인터뷰 영상이 특히 마음에 와닿았습니다. 다시는 이런 실수를 반복하지 않겠습니다.', 5, 156, true, '2025-01-13'),

('한**', '마약범죄 교육', 'drugs', '마약의 위험성과 뇌에 미치는 영향을 과학적으로 설명해주셔서 무섭기도 하고 경각심이 들었습니다. 주변 사람들에게도 꼭 알려줘야겠다고 생각했어요.', 5, 143, true, '2025-01-12'),

('서**', '성범죄 교육', 'sexual', '성인지 감수성에 대해 다시 한번 생각해볼 수 있는 기회였습니다. 동의의 중요성, 상대방 입장에서 생각하는 법을 배웠습니다. 교육 후 많이 달라졌다는 말을 들어요.', 5, 112, true, '2025-01-11'),

('조**', '폭력범죄 교육', 'violence', '가정 내에서의 언어폭력도 폭력이라는 것을 깨달았습니다. 가족과의 관계가 조금씩 나아지고 있어요. 소통하는 방법을 배운 것 같습니다.', 5, 134, true, '2025-01-10'),

('임**', '도박중독 교육', 'gambling', '도박에서 벗어나고 싶었는데 막막했는데, 이 교육을 통해 구체적인 방법을 알게 되었습니다. 자조모임 연계도 도움이 많이 됩니다. 3개월째 단도박 중입니다.', 5, 189, true, '2025-01-09'),

('오**', '디지털범죄 교육', 'digital', '무심코 한 행동이 범죄가 될 수 있다는 것을 알게 됐습니다. 인터넷 댓글 작성할 때도 한 번 더 생각하게 되었어요. 많은 분들이 들었으면 합니다.', 4, 67, true, '2025-01-08'),

('장**', '음주운전 교육', 'drunk-driving', '솔직히 처음엔 귀찮다고 생각했는데, 막상 들어보니 정말 필요한 교육이었어요. 특히 음주 후 알코올 분해 시간에 대한 내용이 충격적이었습니다.', 5, 98, true, '2025-01-07'),

('신**', '재산범죄 교육', 'property', '순간의 잘못된 판단이 평생을 좌우할 수 있다는 것을 배웠습니다. 법적 책임에 대해서도 자세히 알게 되어서 경각심이 생겼습니다.', 4, 54, true, '2025-01-06'),

('권**', '마약범죄 교육', 'drugs', '혼자서는 절대 벗어날 수 없다고 생각했는데, 전문 상담과 교육을 통해 희망을 찾았습니다. 지금은 1년째 건강하게 지내고 있어요. 감사합니다.', 5, 234, true, '2025-01-05'),

('황**', '폭력범죄 교육', 'violence', '화가 날 때마다 교육에서 배운 기법을 적용하고 있습니다. 완벽하진 않지만 예전보다 훨씬 나아졌어요. 지속적인 상담 연계도 좋았습니다.', 5, 87, true, '2025-01-04');
