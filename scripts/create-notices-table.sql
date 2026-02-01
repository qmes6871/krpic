-- 공지사항 테이블 생성
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

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read notices" ON notices
  FOR SELECT USING (true);

-- 인증된 사용자만 생성/수정/삭제 가능 (관리자 체크는 앱 레벨에서)
CREATE POLICY "Authenticated users can insert notices" ON notices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update notices" ON notices
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete notices" ON notices
  FOR DELETE TO authenticated USING (true);

-- 기존 공지사항 데이터 마이그레이션
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

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_notice_views(notice_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE notices SET views = views + 1 WHERE id = notice_id;
END;
$$ LANGUAGE plpgsql;
