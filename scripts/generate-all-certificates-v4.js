const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_BOTTOM = 100; // 하단 여백 (짤림 방지)

// 색상 테마
const THEMES = {
  education: {
    primary: rgb(0.05, 0.25, 0.45),
    secondary: rgb(0.2, 0.4, 0.6),
    accent: rgb(0.1, 0.5, 0.7),
    border: rgb(0.15, 0.35, 0.55),
    bg: rgb(0.95, 0.97, 1),
    lightBg: rgb(0.98, 0.98, 1),
  },
  opinion: {
    primary: rgb(0.1, 0.35, 0.2),
    secondary: rgb(0.2, 0.45, 0.3),
    accent: rgb(0.15, 0.5, 0.35),
    border: rgb(0.2, 0.4, 0.25),
    bg: rgb(0.95, 0.98, 0.95),
    lightBg: rgb(0.97, 0.99, 0.97),
  },
  petition: {
    primary: rgb(0.3, 0.15, 0.4),
    secondary: rgb(0.4, 0.25, 0.5),
    accent: rgb(0.5, 0.3, 0.6),
    border: rgb(0.35, 0.2, 0.45),
    bg: rgb(0.97, 0.95, 0.98),
    lightBg: rgb(0.98, 0.97, 0.99),
  },
  assessment: {
    primary: rgb(0.5, 0.25, 0.05),
    secondary: rgb(0.6, 0.35, 0.15),
    accent: rgb(0.7, 0.4, 0.1),
    border: rgb(0.55, 0.3, 0.1),
    bg: rgb(1, 0.97, 0.94),
    lightBg: rgb(1, 0.98, 0.96),
  },
  reflection: {
    primary: rgb(0.45, 0.3, 0.15),
    secondary: rgb(0.55, 0.4, 0.25),
    accent: rgb(0.6, 0.45, 0.2),
    border: rgb(0.5, 0.35, 0.2),
    bg: rgb(0.99, 0.97, 0.94),
    lightBg: rgb(1, 0.98, 0.96),
  },
};

function centerText(page, text, y, font, size, color) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (PAGE_WIDTH - width) / 2, y, size, font, color });
}

function wrapText(text, maxChars) {
  const result = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      result.push(remaining);
      break;
    }
    let splitIndex = maxChars;
    result.push(remaining.substring(0, splitIndex));
    remaining = remaining.substring(splitIndex);
  }
  return result;
}

// 카테고리별 상세 교육 내용 (시간 제거)
const EDUCATION_DETAILS = {
  'drunk-driving': {
    category: '음주운전',
    intro: '위 사람은 본 센터에서 실시한 음주운전 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      {
        title: '1. 음주운전의 위험성과 결과 인식',
        contents: [
          '• 알코올이 인체와 운전 능력에 미치는 영향 (반응속도 저하, 판단력 흐림, 시야 협착)',
          '• 혈중알코올농도(BAC)와 사고 위험성의 과학적 상관관계 분석',
          '• 음주운전 사고 피해자 및 유가족 인터뷰 영상 시청',
          '• 실제 음주운전 사고 사례 분석 및 토론',
          '• 음주 후 판단 능력 저하 체험 (시뮬레이션)',
        ],
      },
      {
        title: '2. 법적 책임과 사회적 영향',
        contents: [
          '• 도로교통법상 음주운전 처벌 기준 상세 안내',
          '• 면허취소, 벌금, 징역 등 형사처벌의 실제 사례',
          '• 피해자에 대한 민사상 손해배상 책임',
          '• 음주운전 전과가 취업, 신용, 사회생활에 미치는 장기적 영향',
          '• 가족과 주변인에게 미치는 심리적, 경제적 피해',
        ],
      },
      {
        title: '3. 음주 거절 기술 및 대안 행동 훈련',
        contents: [
          '• 음주 권유 상황에서의 효과적인 거절 기술 역할극',
          '• 사회적 압박 상황에서 단호하게 거절하는 방법',
          '• 대리운전, 택시, 대중교통 등 대안 교통수단 활용 계획',
          '• 음주 모임 전 사전 귀가 계획 수립 훈련',
          '• 술자리 참석 자체를 피하는 생활 패턴 설계',
        ],
      },
      {
        title: '4. 재발 방지 계획 및 다짐',
        contents: [
          '• 개인별 음주운전 유발 요인 분석 및 위험 상황 파악',
          '• 구체적이고 실천 가능한 재발 방지 행동 계획 수립',
          '• 가족, 지인과 함께하는 금주운전 서약',
          '• 스트레스 해소를 위한 건강한 대안 활동 탐색',
          '• 준법 서약서 작성 및 실천 의지 다짐',
        ],
      },
    ],
  },
  'violence': {
    category: '폭력범죄',
    intro: '위 사람은 본 센터에서 실시한 폭력범죄 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      {
        title: '1. 분노의 이해와 자기 인식',
        contents: [
          '• 분노 감정의 생리적, 심리적 메커니즘 이해',
          '• 자신의 분노 유발 요인(트리거) 파악하기',
          '• 분노 강도 측정 및 신체적 경고 신호 인식',
          '• 과거 폭력 행동 패턴 분석 및 성찰',
          '• 분노 일지 작성을 통한 자기 모니터링',
        ],
      },
      {
        title: '2. 분노 조절 및 감정 관리 기법',
        contents: [
          '• 심호흡법, 점진적 근육 이완법 실습',
          '• 타임아웃 기법: 위험 상황에서 벗어나기',
          '• 인지 재구성: 상황을 다른 관점에서 해석하기',
          '• 부정적 자동사고 인식 및 논박',
          '• 스트레스 관리 및 건강한 감정 해소법',
        ],
      },
      {
        title: '3. 비폭력 의사소통과 갈등 해결',
        contents: [
          '• 나-전달법(I-message)을 활용한 감정 표현 훈련',
          '• 적극적 경청과 공감적 반응 기술',
          '• 갈등 상황에서의 협상과 타협 기술',
          '• 역할극을 통한 갈등 상황 대처 훈련',
          '• 가정, 직장, 사회에서의 건강한 관계 형성',
        ],
      },
      {
        title: '4. 피해자 공감 및 재발 방지',
        contents: [
          '• 폭력 피해자가 경험하는 신체적, 심리적 트라우마 이해',
          '• 피해자 입장에서 생각해보기 (역할 전환)',
          '• 진정한 책임 인정과 사과의 의미',
          '• 위험 상황 회피 및 대처 계획 수립',
          '• 분노 조절 지지체계 구축 (가족, 상담사 연계)',
        ],
      },
    ],
  },
  'property': {
    category: '재산범죄',
    intro: '위 사람은 본 센터에서 실시한 재산범죄 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      {
        title: '1. 재산권의 이해와 법적 책임',
        contents: [
          '• 재산권의 개념과 법적 보호의 의미',
          '• 절도, 사기, 횡령, 배임 등 재산범죄 유형별 구성요건',
          '• 각 범죄 유형별 법적 처벌 기준 및 양형 요소',
          '• 민사상 손해배상 책임과 원상회복 의무',
          '• 범죄 기록이 취업, 대출, 사회생활에 미치는 영향',
        ],
      },
      {
        title: '2. 피해자 공감 및 책임 인식',
        contents: [
          '• 재산범죄 피해자의 경제적, 심리적 피해 이해',
          '• 피해자 인터뷰 영상 시청 및 토론',
          '• 피해자 입장에서 편지 쓰기 실습',
          '• 범죄 행위의 파급 효과 (가족, 사회)',
          '• 진정한 반성과 사죄의 의미',
        ],
      },
      {
        title: '3. 경제 관리 및 건전한 소비 습관',
        contents: [
          '• 가계부 작성 및 예산 관리 기법',
          '• 충동 구매와 과소비의 심리적 원인 분석',
          '• 건전한 소비 습관 형성을 위한 전략',
          '• 부채 관리 및 재정 회복 계획',
          '• 합법적인 수입 증대 방안 탐색',
        ],
      },
      {
        title: '4. 재발 방지 및 사회 복귀 준비',
        contents: [
          '• 범행 동기 분석 및 위험 요인 파악',
          '• 유혹 상황에서의 대처 행동 훈련',
          '• 건전한 대인관계 형성 및 지지체계 구축',
          '• 직업 탐색 및 자립 계획 수립',
          '• 준법 생활 실천 서약 및 다짐',
        ],
      },
    ],
  },
  'sexual': {
    category: '성범죄',
    intro: '위 사람은 본 센터에서 실시한 성범죄 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      {
        title: '1. 성인지 감수성 및 건강한 성 의식',
        contents: [
          '• 성별 고정관념과 왜곡된 성 인식 점검',
          '• 건강한 성(sexuality)과 상호 존중의 의미',
          '• 미디어 속 성 묘사의 문제점과 영향 분석',
          '• 성적 자기결정권의 개념과 중요성',
          '• 건전한 이성 관계 형성을 위한 태도',
        ],
      },
      {
        title: '2. 동의와 경계 존중',
        contents: [
          '• 명확한 동의(consent)의 개념과 조건',
          '• 동의를 확인하는 구체적인 방법',
          '• 상대방의 경계 인식 및 존중하기',
          '• 비동의 상황 인식 (침묵, 거부, 저항)',
          '• 동의 없는 성적 행위의 법적 결과',
        ],
      },
      {
        title: '3. 피해자 영향 이해 및 공감',
        contents: [
          '• 성범죄 피해자가 경험하는 심리적 트라우마',
          '• 피해자의 일상, 관계, 삶에 미치는 장기적 영향',
          '• 2차 피해(victim blaming)의 문제점',
          '• 피해자 관점에서의 사건 재해석',
          '• 진정한 반성과 책임의 의미',
        ],
      },
      {
        title: '4. 충동 조절 및 재발 방지',
        contents: [
          '• 성적 충동의 인식 및 조절 기법',
          '• 인지 왜곡 패턴 파악 및 수정',
          '• 위험 상황 인식 및 회피 전략',
          '• 건강한 스트레스 해소 및 여가 활동',
          '• 장기적 재발 방지 계획 및 지지체계 구축',
        ],
      },
    ],
  },
  'gambling': {
    category: '도박중독',
    intro: '위 사람은 본 센터에서 실시한 도박중독 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      {
        title: '1. 도박 중독의 이해',
        contents: [
          '• 도박 중독(병적 도박)의 정의와 진단 기준',
          '• 뇌과학으로 보는 중독의 메커니즘',
          '• 도박 중독 단계별 진행 과정',
          '• 자가 진단 및 중독 수준 평가',
          '• 도박 중독과 다른 정신건강 문제의 관계',
        ],
      },
      {
        title: '2. 도박의 폐해 인식',
        contents: [
          '• 경제적 파탄 사례 분석 (부채, 파산, 범죄)',
          '• 가족 관계 파괴와 사회적 고립의 악순환',
          '• 도박으로 인한 정신건강 문제 (우울, 자살)',
          '• 도박 관련 범죄와 법적 처벌 사례',
          '• 도박 중독자 가족의 고통 이해',
        ],
      },
      {
        title: '3. 재정 관리 및 회복 계획',
        contents: [
          '• 부채 현황 파악 및 상환 계획 수립',
          '• 재정 재건을 위한 단계별 전략',
          '• 도박 자금 차단 방법 (자기 배제, 계좌 관리)',
          '• 가족과의 신뢰 회복 및 소통 방법',
          '• 전문 기관(신용회복위원회 등) 연계',
        ],
      },
      {
        title: '4. 재발 방지 및 건강한 삶',
        contents: [
          '• 도박 유혹 상황 인식 및 대처 전략',
          '• 갈망(craving) 관리 기법',
          '• 건전한 여가 활동 및 스트레스 해소법',
          '• 자조 모임(GA) 참여 및 동료 지지',
          '• 전문 상담 및 치료 프로그램 연계',
        ],
      },
    ],
  },
  'drugs': {
    category: '마약범죄',
    intro: '위 사람은 본 센터에서 실시한 마약범죄 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      {
        title: '1. 마약의 위험성과 건강 영향',
        contents: [
          '• 마약류 종류별 특성 및 작용 기전',
          '• 마약이 뇌와 신체에 미치는 영향',
          '• 중독의 신경과학적 메커니즘',
          '• 마약 관련 사망 및 건강 피해 사례',
          '• 금단 증상과 재사용 위험성',
        ],
      },
      {
        title: '2. 법적 처벌과 사회적 결과',
        contents: [
          '• 마약류 관리에 관한 법률 상세 안내',
          '• 투약, 소지, 매매, 제조별 처벌 수준',
          '• 마약 전과가 취업, 출국, 사회생활에 미치는 영향',
          '• 마약 관련 범죄의 연쇄적 결과',
          '• 가족과 주변인에게 미치는 피해',
        ],
      },
      {
        title: '3. 거절 기술 및 환경 관리',
        contents: [
          '• 마약 권유 상황에서의 거절 기술 역할극',
          '• 단호하고 명확한 거절 의사 표현법',
          '• 위험 환경 및 인간관계 정리 전략',
          '• 과거 마약 사용 환경과의 단절',
          '• 건강한 사회적 관계망 구축',
        ],
      },
      {
        title: '4. 재발 방지 및 회복 지원',
        contents: [
          '• 개인별 재발 위험 요인 분석',
          '• 갈망 관리 및 위기 대처 기술',
          '• 스트레스 대처 및 건강한 생활습관',
          '• 전문 치료 및 재활 프로그램 연계',
          '• 장기적 회복 계획 및 지지체계 구축',
        ],
      },
    ],
  },
  'digital': {
    category: '디지털범죄',
    intro: '위 사람은 본 센터에서 실시한 디지털범죄 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      {
        title: '1. 디지털 윤리와 법률 이해',
        contents: [
          '• 정보통신망 이용촉진 및 정보보호 등에 관한 법률',
          '• 개인정보보호법의 주요 내용',
          '• 사이버 범죄 유형별 구성요건 및 처벌',
          '• 디지털 공간에서의 윤리적 행동 기준',
          '• 온라인 활동의 법적 책임',
        ],
      },
      {
        title: '2. 피해자 보호와 공감',
        contents: [
          '• 사이버 범죄 피해자의 심리적 고통',
          '• 디지털 성범죄의 심각성과 피해 확산',
          '• 개인정보 유출 피해의 장기적 영향',
          '• 온라인 명예훼손, 사이버 불링의 피해',
          '• 피해자 관점에서의 범죄 재인식',
        ],
      },
      {
        title: '3. 건전한 디지털 생활',
        contents: [
          '• 인터넷/게임 과의존 자가 진단',
          '• 건강한 디지털 사용 습관 형성',
          '• SNS 및 온라인 커뮤니티 활동 윤리',
          '• 개인정보 보호 실천 방법',
          '• 디지털 리터러시 향상',
        ],
      },
      {
        title: '4. 재발 방지 및 합법적 기술 활용',
        contents: [
          '• 디지털 범죄 유발 요인 분석',
          '• 온라인 활동 자기 모니터링 방법',
          '• 합법적인 IT 기술 활용 방안',
          '• 건전한 온라인 커뮤니티 참여',
          '• 디지털 분야 긍정적 진로 탐색',
        ],
      },
    ],
  },
  'law-compliance': {
    category: '준법의식',
    intro: '위 사람은 본 센터에서 실시한 준법의식교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      {
        title: '1. 법과 사회질서의 이해',
        contents: [
          '• 법의 필요성과 사회적 기능',
          '• 법치주의와 민주주의의 관계',
          '• 시민으로서의 권리와 의무',
          '• 사회 규범과 법률의 차이',
          '• 법을 지키는 것의 개인적, 사회적 의미',
        ],
      },
      {
        title: '2. 일상생활 속 법률 이해',
        contents: [
          '• 형법, 민법, 행정법의 기초 개념',
          '• 경범죄 처벌법과 주요 경범죄 사례',
          '• 실생활에서 자주 접하는 법률 문제',
          '• 법적 분쟁 발생 시 해결 절차',
          '• 법률 정보 접근 및 활용 방법',
        ],
      },
      {
        title: '3. 사회적 책임과 공동체 의식',
        contents: [
          '• 개인 행동이 사회에 미치는 영향',
          '• 공동체 의식과 타인에 대한 배려',
          '• 사회적 약자 보호와 연대',
          '• 갈등의 합법적, 평화적 해결 방법',
          '• 시민으로서의 사회 참여 방안',
        ],
      },
      {
        title: '4. 준법 생활 실천 계획',
        contents: [
          '• 자신의 법 위반 경험 성찰',
          '• 준법 생활을 방해하는 요인 분석',
          '• 구체적인 준법 실천 계획 수립',
          '• 법을 지키는 삶의 가치 인식',
          '• 건전한 사회 구성원으로서의 다짐',
        ],
      },
    ],
  },
  'cbt': {
    category: '인지행동개선',
    intro: '위 사람은 본 센터에서 실시한 인지행동개선훈련 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      {
        title: '1. 인지 왜곡의 이해와 인식',
        contents: [
          '• 인지행동치료(CBT)의 기본 원리',
          '• 자동적 사고와 핵심 신념의 개념',
          '• 주요 인지 왜곡 유형 (흑백논리, 과잉일반화, 개인화 등)',
          '• 자신의 사고 패턴 분석하기',
          '• 인지 왜곡이 감정과 행동에 미치는 영향',
        ],
      },
      {
        title: '2. 행동 패턴 분석',
        contents: [
          '• ABC 모델: 선행사건-신념-결과의 관계',
          '• 문제 행동의 기능 분석',
          '• 행동 일지 작성 및 자기 모니터링',
          '• 반복되는 부정적 행동 패턴 인식',
          '• 행동 변화를 위한 동기 강화',
        ],
      },
      {
        title: '3. 인지 재구성',
        contents: [
          '• 부정적 자동사고 포착 기법',
          '• 사고의 증거 검토 및 논박',
          '• 합리적 대안 사고 개발',
          '• 균형 잡힌 사고 훈련',
          '• 핵심 신념 수정 작업',
        ],
      },
      {
        title: '4. 대안 행동 학습 및 실천',
        contents: [
          '• 문제 해결 기법 단계별 훈련',
          '• 상황별 대처 행동 역할극',
          '• 사회기술 훈련 (의사소통, 자기주장)',
          '• 새로운 행동 습관 형성 전략',
          '• 장기적 변화 유지를 위한 계획',
        ],
      },
    ],
  },
};

// ========== 평가서 생성 ==========
async function generateAssessmentCertificate(pdfDoc, font, logoImage, sealImage) {
  const theme = THEMES.assessment;

  // 페이지 1
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page1.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2.5 });
  page1.drawRectangle({ x: 32, y: 32, width: PAGE_WIDTH - 64, height: PAGE_HEIGHT - 64, borderColor: theme.accent, borderWidth: 0.5 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 100, logoH = (logoImage.height / logoImage.width) * logoW;
    page1.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page1, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 50;

  centerText(page1, '재범 위험 종합 관리 평가 증명서', y, font, 24, theme.primary);
  y -= 20;
  centerText(page1, 'Comprehensive Recidivism Risk Assessment Certificate', y, font, 9, theme.secondary);
  y -= 40;

  page1.drawLine({ start: { x: 60, y }, end: { x: PAGE_WIDTH - 60, y }, thickness: 2, color: theme.border });
  y -= 40;

  page1.drawText('성        명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page1.drawLine({ start: { x: 160, y: y - 3 }, end: { x: 380, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 35;

  const introLines = [
    '위 사람은 본 센터에서 실시한 재범 위험 종합 관리 평가 프로그램에',
    '참여하여 아래와 같이 평가를 완료하였음을 증명합니다.',
  ];
  for (const line of introLines) {
    page1.drawText(line, { x: 70, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 22;
  }
  y -= 25;

  // 평가 영역
  page1.drawRectangle({ x: 50, y: y - 8, width: PAGE_WIDTH - 100, height: 28, color: theme.primary });
  centerText(page1, '【 평가 영역 및 내용 】', y, font, 13, rgb(1, 1, 1));
  y -= 45;

  const assessmentAreas = [
    {
      area: '1. 심리상태 평가',
      items: [
        '• 우울 및 불안 수준 측정 (표준화된 심리검사 실시)',
        '• 충동성 및 자기조절 능력 평가',
        '• 자아존중감 및 자기효능감 측정',
        '• 스트레스 대처 능력 평가',
        '• 정신건강 위험 요인 스크리닝',
      ],
    },
    {
      area: '2. 재범위험성 평가',
      items: [
        '• 정적/동적 재범 위험 요인 분석',
        '• 범죄 유발 요인(criminogenic needs) 평가',
        '• 보호 요인(protective factors) 분석',
        '• 재범 가능성 예측 및 위험 수준 분류',
        '• 과거 범죄 이력 및 패턴 분석',
      ],
    },
    {
      area: '3. 사회적응도 평가',
      items: [
        '• 대인관계 능력 및 사회기술 평가',
        '• 가족 관계 및 사회적 지지체계 분석',
        '• 직업 능력 및 경제적 자립도 평가',
        '• 주거 안정성 및 생활환경 분석',
        '• 사회 복귀 준비도 종합 평가',
      ],
    },
  ];

  for (const area of assessmentAreas) {
    page1.drawRectangle({ x: 55, y: y - 5, width: PAGE_WIDTH - 110, height: 22, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page1.drawText(area.area, { x: 65, y: y, size: 11, font, color: theme.primary });
    y -= 28;

    for (const item of area.items) {
      page1.drawText(item, { x: 70, y, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
      y -= 16;
    }
    y -= 12;
  }

  // 페이지 2: 평가 결과
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page2.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });

  y = PAGE_HEIGHT - 60;
  centerText(page2, '【 평가 결과 】', y, font, 16, theme.primary);
  y -= 40;

  const results = [
    { category: '심리상태', result: '안정', detail: '우울/불안 수준 정상 범위, 충동성 조절 양호, 적절한 자아존중감 확인' },
    { category: '재범위험성', result: '낮음', detail: '주요 재범 위험 요인 감소, 보호 요인 강화, 범죄적 사고 패턴 개선' },
    { category: '사회적응도', result: '양호', detail: '대인관계 능력 향상, 가족 지지체계 확보, 사회 복귀 준비 완료' },
  ];

  for (const r of results) {
    page2.drawRectangle({ x: 50, y: y - 55, width: PAGE_WIDTH - 100, height: 60, color: theme.lightBg, borderColor: theme.border, borderWidth: 0.5 });

    page2.drawRectangle({ x: 50, y: y - 18, width: 100, height: 23, color: theme.accent });
    page2.drawText(r.category, { x: 60, y: y - 12, size: 11, font, color: rgb(1, 1, 1) });

    page2.drawRectangle({ x: PAGE_WIDTH - 140, y: y - 18, width: 85, height: 23, color: theme.primary });
    page2.drawText(`결과: ${r.result}`, { x: PAGE_WIDTH - 130, y: y - 12, size: 10, font, color: rgb(1, 1, 1) });

    const detailLines = wrapText(r.detail, 70);
    let dy = y - 35;
    for (const dl of detailLines) {
      page2.drawText(dl, { x: 60, y: dy, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
      dy -= 14;
    }
    y -= 70;
  }

  y -= 20;

  // 종합 소견
  page2.drawRectangle({ x: 50, y: y - 130, width: PAGE_WIDTH - 100, height: 135, color: theme.bg, borderColor: theme.primary, borderWidth: 1.5 });

  page2.drawRectangle({ x: 50, y: y - 22, width: PAGE_WIDTH - 100, height: 27, color: theme.primary });
  centerText(page2, '【 종합 소견 】', y - 14, font, 13, rgb(1, 1, 1));

  const opinion = [
    '위 대상자는 본 센터의 재범 위험 종합 관리 평가 프로그램에 성실히 참여하였으며,',
    '심리상태, 재범위험성, 사회적응도 전 영역에서 양호한 평가 결과를 보였습니다.',
    '',
    '특히 교육 참여를 통해 자신의 행동에 대한 인식이 크게 개선되었으며,',
    '재범 방지를 위한 구체적인 실천 의지와 계획을 갖추고 있습니다.',
    '',
    '이에 본 센터는 위 대상자의 재범 위험성이 낮으며,',
    '사회 복귀 준비가 양호한 것으로 평가합니다.',
  ];

  let oy = y - 45;
  for (const line of opinion) {
    if (line === '') { oy -= 8; continue; }
    page2.drawText(line, { x: 60, y: oy, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    oy -= 16;
  }

  y -= 160;

  page2.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 55;

  centerText(page2, '재범방지교육통합센터', y, font, 15, theme.primary);
  if (sealImage) page2.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });
}

// ========== 소견서 생성 ==========
async function generateOpinionCertificate(pdfDoc, font, logoImage, sealImage) {
  const theme = THEMES.opinion;

  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page1.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2.5 });
  page1.drawRectangle({ x: 32, y: 32, width: PAGE_WIDTH - 64, height: PAGE_HEIGHT - 64, borderColor: theme.accent, borderWidth: 0.5 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 95, logoH = (logoImage.height / logoImage.width) * logoW;
    page1.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page1, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 50;

  centerText(page1, '소    견    서', y, font, 32, theme.primary);
  y -= 22;
  centerText(page1, 'Professional Opinion Statement', y, font, 10, theme.secondary);
  y -= 40;

  page1.drawLine({ start: { x: 60, y }, end: { x: PAGE_WIDTH - 60, y }, thickness: 1.5, color: theme.border });
  y -= 40;

  page1.drawText('성        명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page1.drawLine({ start: { x: 160, y: y - 3 }, end: { x: 380, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 35;

  const intro = [
    '위 사람은 본 센터에서 실시한 재범방지교육 프로그램에 성실히 참여하였으며,',
    '교육 과정에서 관찰된 사항에 대하여 아래와 같이 소견을 제출합니다.',
  ];
  for (const line of intro) {
    page1.drawText(line, { x: 70, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 22;
  }
  y -= 25;

  const opinionSections = [
    {
      title: '1. 교육 참여 태도',
      content: '교육 전 과정에 빠짐없이 출석하였으며, 모든 교육 활동에 적극적이고 성실한 자세로 참여하였습니다. 특히 그룹 토론과 역할극 활동에서 주도적인 모습을 보였으며, 다른 참여자들의 이야기에도 귀 기울이는 경청의 자세가 돋보였습니다.',
    },
    {
      title: '2. 인식 변화',
      content: '교육 초기에는 자신의 행동에 대한 책임 인식이 부족하였으나, 교육이 진행됨에 따라 점차 자신의 잘못을 인정하고 진정으로 반성하는 모습을 보였습니다. 특히 피해자 공감 교육 이후 피해자의 고통에 대해 깊이 이해하게 되었으며, 진심 어린 사죄의 마음을 표현하였습니다.',
    },
    {
      title: '3. 행동 변화',
      content: '감정 조절 기법과 대처 기술을 성실히 학습하였으며, 실제 상황에서 이를 적용하려는 노력이 관찰되었습니다. 스트레스 상황에서 충동적으로 반응하던 과거와 달리, 상황을 객관적으로 인식하고 적절하게 대처하는 능력이 향상되었습니다.',
    },
    {
      title: '4. 재발 방지 계획',
      content: '교육을 통해 자신의 문제 행동 유발 요인을 명확히 인식하게 되었으며, 이를 예방하고 대처하기 위한 구체적인 계획을 수립하였습니다. 가족 및 주변의 지지체계를 구축하고, 필요시 전문 상담을 받겠다는 의지도 표명하였습니다.',
    },
  ];

  for (const section of opinionSections) {
    if (y < MARGIN_BOTTOM + 80) {
      const newPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      newPage.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
      y = PAGE_HEIGHT - 60;
    }

    page1.drawRectangle({ x: 55, y: y - 5, width: PAGE_WIDTH - 110, height: 22, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page1.drawText(section.title, { x: 65, y: y, size: 11, font, color: theme.primary });
    y -= 28;

    const contentLines = wrapText(section.content, 65);
    for (const cl of contentLines) {
      page1.drawText(cl, { x: 65, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 15;
    }
    y -= 15;
  }

  // 종합 소견
  y -= 10;
  page1.drawRectangle({ x: 50, y: y - 85, width: PAGE_WIDTH - 100, height: 90, color: theme.bg, borderColor: theme.primary, borderWidth: 1 });
  page1.drawRectangle({ x: 50, y: y - 20, width: PAGE_WIDTH - 100, height: 25, color: theme.primary });
  centerText(page1, '【 종합 소견 】', y - 12, font, 12, rgb(1, 1, 1));

  const finalOpinion = [
    '위 대상자는 재범방지교육을 통해 인식, 태도, 행동 전반에 걸쳐 의미 있는',
    '긍정적 변화를 보였습니다. 자신의 행동에 대한 진정한 반성과 함께 재범 방지를',
    '위한 구체적인 실천 의지를 갖추고 있어, 사회 복귀 준비가 양호한 것으로 판단됩니다.',
  ];

  let fy = y - 40;
  for (const line of finalOpinion) {
    page1.drawText(line, { x: 60, y: fy, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    fy -= 16;
  }

  y -= 115;

  page1.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 55;

  centerText(page1, '재범방지교육통합센터', y, font, 15, theme.primary);
  if (sealImage) page1.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });
}

// ========== 탄원서 생성 ==========
async function generatePetitionCertificate(pdfDoc, font, logoImage, sealImage, isCounselor = false) {
  const theme = THEMES.petition;

  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page1.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 65;

  if (logoImage) {
    const logoW = 85, logoH = (logoImage.height / logoImage.width) * logoW;
    page1.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  centerText(page1, isCounselor ? '심리상담사' : '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 45;

  centerText(page1, '탄    원    서', y, font, 32, theme.primary);
  y -= 20;
  centerText(page1, 'Petition Letter', y, font, 10, theme.secondary);
  y -= 35;

  page1.drawRectangle({ x: 55, y: y - 5, width: PAGE_WIDTH - 110, height: 26, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
  centerText(page1, '수신: 대한민국 법원 귀중', y, font, 12, theme.primary);
  y -= 45;

  page1.drawText('피고인 성명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page1.drawLine({ start: { x: 170, y: y - 3 }, end: { x: 400, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 40;

  const petitionContent = isCounselor ? [
    '존경하는 재판장님께',
    '',
    '본 심리상담사는 위 피고인과 여러 차례에 걸친 심층 상담을 진행하며 관찰한 진정한 반성과 변화의 모습을 바탕으로, 선처를 탄원하고자 이 글을 올립니다.',
    '',
    '상담 과정에서 피고인은 자신의 행동이 피해자와 사회에 미친 영향에 대해 깊이 인식하게 되었습니다. 초기 상담에서는 방어적인 태도를 보이기도 하였으나, 지속적인 상담을 통해 진심으로 자신의 잘못을 뉘우치고 반성하는 모습을 보여주었습니다.',
    '',
    '특히 피해자의 고통에 대해 공감하며 진심 어린 사죄의 마음을 표현하였고, 다시는 같은 잘못을 반복하지 않겠다는 강한 의지를 보였습니다. 상담을 통해 자신의 행동 패턴을 객관적으로 인식하게 되었으며, 감정 조절과 충동 억제를 위한 구체적인 기법들을 습득하였습니다.',
    '',
    '심리 평가 결과, 피고인은 재범 위험 요인이 상당 부분 감소하였으며, 건강한 사회 적응을 위한 심리적 준비가 되어 있는 것으로 판단됩니다. 가족과의 관계 회복을 위해 노력하고 있으며, 사회에 복귀하여 성실하게 살아가겠다는 구체적인 계획도 수립하였습니다.',
    '',
    '이에 전문 심리상담사로서 피고인의 진정성 있는 변화를 확인하였으며, 사회 복귀의 기회를 위한 선처를 탄원드립니다. 재판장님의 현명하신 판단을 부탁드립니다.',
  ] : [
    '존경하는 재판장님께',
    '',
    '본 재범방지교육통합센터는 위 피고인이 본 센터의 재범방지교육 프로그램에 참여하여 보여준 진정한 반성과 변화의 모습을 확인하고, 선처를 탄원하고자 이 글을 올립니다.',
    '',
    '피고인은 교육 기간 동안 모든 과정에 성실히 참여하였으며, 자신의 잘못에 대해 깊이 성찰하는 모습을 보여주었습니다. 교육 초기에는 다소 방어적인 태도를 보이기도 하였으나, 시간이 지남에 따라 점차 마음을 열고 진정으로 반성하는 자세를 갖추게 되었습니다.',
    '',
    '특히 피해자 공감 교육에서 피해자가 겪는 고통과 상처에 대해 깊이 이해하게 되었으며, 진심 어린 사죄의 마음을 표현하였습니다. 자신의 행동이 피해자뿐 아니라 가족과 사회 전체에 미친 부정적 영향을 인식하고, 이에 대한 무거운 책임감을 느끼고 있습니다.',
    '',
    '교육을 통해 감정 조절 기법, 충동 억제 방법, 갈등 해결 기술 등을 습득하였으며, 실제 상황에서 이를 적용하기 위한 구체적인 계획을 수립하였습니다. 가족과의 관계 회복을 위해 노력하고 있으며, 사회에 복귀하여 건전한 시민으로서 성실하게 살아가겠다는 강한 의지를 보여주었습니다.',
    '',
    '본 센터의 전문 상담사 및 교육진의 종합 평가 결과, 피고인은 재범 가능성이 낮으며 사회 복귀 준비가 양호한 것으로 판단됩니다.',
    '',
    '이에 본 센터는 피고인이 사회에 복귀하여 새로운 삶을 시작할 수 있도록 재판장님의 현명하신 판단과 선처를 간곡히 탄원합니다.',
  ];

  for (const line of petitionContent) {
    if (line === '') { y -= 12; continue; }
    const wrapped = wrapText(line, 52);
    for (const wl of wrapped) {
      if (y < MARGIN_BOTTOM) {
        const newPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        newPage.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 2 });
        y = PAGE_HEIGHT - 60;
      }
      page1.drawText(wl, { x: 70, y, size: 11, font, color: rgb(0.12, 0.12, 0.12) });
      y -= 20;
    }
  }

  y -= 30;

  // 마지막 페이지 찾기
  const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];

  if (y < MARGIN_BOTTOM + 100) {
    const newPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    newPage.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 2 });
    y = PAGE_HEIGHT - 100;

    newPage.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 55;

    if (isCounselor) {
      centerText(newPage, '심리상담사', y, font, 14, theme.primary);
      y -= 28;
      newPage.drawText('성명:', { x: PAGE_WIDTH / 2 - 60, y, size: 12, font, color: theme.secondary });
      newPage.drawLine({ start: { x: PAGE_WIDTH / 2 - 20, y: y - 3 }, end: { x: PAGE_WIDTH / 2 + 100, y: y - 3 }, thickness: 0.5, color: theme.secondary });
      newPage.drawText('(인)', { x: PAGE_WIDTH / 2 + 105, y, size: 11, font, color: theme.secondary });
    } else {
      centerText(newPage, '재범방지교육통합센터', y, font, 15, theme.primary);
      if (sealImage) newPage.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });
    }
  } else {
    page1.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 55;

    if (isCounselor) {
      centerText(page1, '심리상담사', y, font, 14, theme.primary);
      y -= 28;
      page1.drawText('성명:', { x: PAGE_WIDTH / 2 - 60, y, size: 12, font, color: theme.secondary });
      page1.drawLine({ start: { x: PAGE_WIDTH / 2 - 20, y: y - 3 }, end: { x: PAGE_WIDTH / 2 + 100, y: y - 3 }, thickness: 0.5, color: theme.secondary });
      page1.drawText('(인)', { x: PAGE_WIDTH / 2 + 105, y, size: 11, font, color: theme.secondary });
    } else {
      centerText(page1, '재범방지교육통합센터', y, font, 15, theme.primary);
      if (sealImage) page1.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });
    }
  }
}

// ========== 소감문 생성 ==========
async function generateReflectionCertificate(pdfDoc, font, logoImage, sealImage, type) {
  const theme = THEMES.reflection;
  const issCounseling = type === 'counseling';

  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page1.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 1.5 });
  page1.drawRectangle({ x: 35, y: 35, width: PAGE_WIDTH - 70, height: PAGE_HEIGHT - 70, borderColor: theme.accent, borderWidth: 0.5 });

  let y = PAGE_HEIGHT - 65;

  if (logoImage) {
    const logoW = 90, logoH = (logoImage.height / logoImage.width) * logoW;
    page1.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  centerText(page1, '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 45;

  const title = issCounseling ? '심리상담 소감문' : '이수 소감문';
  centerText(page1, title, y, font, 28, theme.primary);
  y -= 40;

  page1.drawLine({ start: { x: 70, y }, end: { x: PAGE_WIDTH - 70, y }, thickness: 1, color: theme.border });
  y -= 40;

  page1.drawText('성        명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page1.drawLine({ start: { x: 160, y: y - 3 }, end: { x: 380, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 35;

  const intro = issCounseling
    ? '위 사람은 본 센터에서 실시한 심리상담 프로그램에 참여하고 아래와 같이 소감문을 제출하였음을 증명합니다.'
    : '위 사람은 본 센터에서 실시한 재범방지교육 프로그램을 이수하고 아래와 같이 소감문을 제출하였음을 증명합니다.';

  const introLines = wrapText(intro, 55);
  for (const il of introLines) {
    page1.drawText(il, { x: 70, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 20;
  }
  y -= 25;

  // 소감문 내용
  page1.drawRectangle({ x: 50, y: y - 8, width: PAGE_WIDTH - 100, height: 26, color: theme.primary });
  centerText(page1, '【 소감문 내용 】', y - 2, font, 12, rgb(1, 1, 1));
  y -= 45;

  const reflectionContent = issCounseling ? [
    {
      title: '1. 상담을 통해 새롭게 알게 된 점',
      content: '심리상담을 통해 제 안에 있던 분노와 불안의 근본 원인을 알게 되었습니다. 그동안 제가 왜 그런 행동을 했는지 스스로도 이해하지 못했는데, 상담사 선생님과의 대화를 통해 어린 시절의 경험, 트라우마, 그리고 잘못된 사고 패턴이 제 행동에 영향을 미쳤다는 것을 깨달았습니다. 또한 감정을 건강하게 표현하고 조절하는 방법이 있다는 것도 배웠습니다.',
    },
    {
      title: '2. 자신의 행동에 대한 반성',
      content: '상담을 받으면서 제가 저지른 행동이 얼마나 잘못된 것인지 진심으로 깨닫게 되었습니다. 처음에는 저도 억울한 점이 있다고 생각했지만, 상담을 통해 피해자가 겪었을 고통을 생각하니 너무나 부끄럽고 죄송한 마음뿐입니다. 어떤 이유로도 제 행동은 정당화될 수 없다는 것을 이제 명확히 알게 되었습니다.',
    },
    {
      title: '3. 피해자에 대한 생각',
      content: '피해자분께 진심으로 사죄드립니다. 제 행동으로 인해 피해자분이 겪으셨을 두려움, 분노, 슬픔, 트라우마를 생각하면 가슴이 아픕니다. 제가 저지른 잘못을 되돌릴 수는 없지만, 진심으로 반성하고 다시는 이런 일이 없도록 노력하겠습니다. 피해자분의 상처가 조금이나마 치유되기를 간절히 바랍니다.',
    },
    {
      title: '4. 앞으로의 변화 다짐',
      content: '상담을 통해 배운 감정 조절 기법과 스트레스 대처법을 일상에서 꾸준히 실천하겠습니다. 화가 나거나 힘든 상황이 오더라도 충동적으로 행동하지 않고, 상담에서 배운 방법으로 대처하겠습니다. 가족에게 더 좋은 사람이 되고, 사회에 기여하는 건전한 시민으로 살아가겠습니다. 이번 경험을 평생 잊지 않고 다시는 같은 잘못을 반복하지 않을 것을 굳게 다짐합니다.',
    },
  ] : [
    {
      title: '1. 교육을 통해 배운 점',
      content: '재범방지교육을 통해 제가 저지른 행동의 심각성과 그것이 미치는 영향에 대해 깊이 생각하게 되었습니다. 법적인 처벌 외에도 피해자, 가족, 그리고 사회 전체에 얼마나 큰 피해를 주는지 알게 되었습니다. 또한 분노 조절, 충동 억제, 갈등 해결 등 실생활에서 사용할 수 있는 구체적인 기술들을 배웠습니다.',
    },
    {
      title: '2. 가장 인상 깊었던 내용',
      content: '피해자 공감 교육이 가장 인상 깊었습니다. 피해자분들의 이야기를 듣고 그분들이 겪는 고통을 조금이나마 이해하게 되었을 때, 제 잘못의 무게가 얼마나 무거운지 실감했습니다. 또한 다른 참여자들의 경험담을 들으며 저만 이런 어려움을 겪는 것이 아니라는 것도 알게 되었고, 서로 공감하며 변화의 의지를 다질 수 있었습니다.',
    },
    {
      title: '3. 자신의 변화',
      content: '교육을 받기 전에는 제 잘못을 축소하거나 다른 사람 탓을 하려는 마음이 있었습니다. 하지만 교육을 통해 변명이 아닌 진정한 책임을 져야 한다는 것을 깨달았습니다. 이제 화가 날 때 즉각적으로 반응하지 않고 심호흡을 하며 생각할 시간을 갖게 되었습니다. 가족들과의 대화도 늘었고, 관계가 조금씩 회복되고 있습니다.',
    },
    {
      title: '4. 앞으로의 다짐',
      content: '다시는 같은 잘못을 반복하지 않겠습니다. 교육에서 배운 것들을 매일 실천하며, 힘든 상황이 오더라도 올바른 방법으로 대처하겠습니다. 피해자분과 가족에게 진심으로 사죄하며, 제 남은 인생을 성실하고 바르게 살아가겠습니다. 이 다짐을 평생 잊지 않고, 사회에 기여하는 사람이 되겠습니다.',
    },
  ];

  for (const section of reflectionContent) {
    if (y < MARGIN_BOTTOM + 100) {
      const newPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      newPage.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 1.5 });
      y = PAGE_HEIGHT - 60;
    }

    page1.drawRectangle({ x: 55, y: y - 5, width: PAGE_WIDTH - 110, height: 20, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page1.drawText(section.title, { x: 62, y: y - 1, size: 10, font, color: theme.primary });
    y -= 26;

    const contentLines = wrapText(section.content, 65);
    for (const cl of contentLines) {
      if (y < MARGIN_BOTTOM) {
        const pages = pdfDoc.getPages();
        let currentPage = pages[pages.length - 1];
        if (currentPage === page1) {
          const newPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          newPage.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 1.5 });
          y = PAGE_HEIGHT - 60;
          currentPage = newPage;
        }
      }
      page1.drawText(cl, { x: 60, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 14;
    }
    y -= 18;
  }

  const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];

  if (y < MARGIN_BOTTOM + 80) {
    const newPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    newPage.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 1.5 });
    y = PAGE_HEIGHT - 100;

    newPage.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 55;

    centerText(newPage, '재범방지교육통합센터', y, font, 15, theme.primary);
    if (sealImage) newPage.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });
  } else {
    page1.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 55;

    centerText(page1, '재범방지교육통합센터', y, font, 15, theme.primary);
    if (sealImage) page1.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });
  }
}

// ========== 교육내용 증명서 생성 ==========
async function generateEducationCertificate(pdfDoc, font, logoImage, sealImage, educationType) {
  const theme = THEMES.education;
  const eduDetails = EDUCATION_DETAILS[educationType];

  // 페이지 1
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
  page.drawRectangle({ x: 30, y: 30, width: PAGE_WIDTH - 60, height: PAGE_HEIGHT - 60, borderColor: theme.accent, borderWidth: 0.5 });

  let y = PAGE_HEIGHT - 65;

  if (logoImage) {
    const logoW = 95, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  centerText(page, '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 40;

  const mainTitle = eduDetails.category === '인지행동개선' ? '인지행동개선훈련' : `${eduDetails.category} 재범방지교육`;
  centerText(page, mainTitle, y, font, 24, theme.primary);
  y -= 28;
  centerText(page, '교육내용 증명서', y, font, 18, theme.primary);
  y -= 18;
  centerText(page, 'Education Content Certificate', y, font, 9, theme.secondary);
  y -= 35;

  page.drawLine({ start: { x: 55, y }, end: { x: PAGE_WIDTH - 55, y }, thickness: 1.5, color: theme.border });
  y -= 35;

  page.drawText('성        명 :', { x: 65, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 155, y: y - 3 }, end: { x: 370, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 32;

  const introLines = wrapText(eduDetails.intro, 60);
  for (const il of introLines) {
    page.drawText(il, { x: 65, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 18;
  }
  y -= 20;

  page.drawRectangle({ x: 50, y: y - 8, width: PAGE_WIDTH - 100, height: 26, color: theme.primary });
  centerText(page, '【 교 육 내 용 】', y - 2, font, 12, rgb(1, 1, 1));
  y -= 45;

  // 모듈들
  for (let mi = 0; mi < eduDetails.modules.length; mi++) {
    const mod = eduDetails.modules[mi];

    // 모듈 하나의 예상 높이 계산
    const modHeight = 25 + mod.contents.length * 15 + 20;

    // 페이지 넘김 체크
    if (y < MARGIN_BOTTOM + modHeight) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
      y = PAGE_HEIGHT - 60;
    }

    // 모듈 제목
    page.drawRectangle({ x: 52, y: y - 5, width: PAGE_WIDTH - 104, height: 22, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(mod.title, { x: 62, y: y, size: 11, font, color: theme.primary });
    y -= 28;

    // 모듈 내용
    for (const content of mod.contents) {
      if (y < MARGIN_BOTTOM) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
        y = PAGE_HEIGHT - 60;
      }
      page.drawText(content, { x: 68, y, size: 9, font, color: rgb(0.18, 0.18, 0.18) });
      y -= 15;
    }
    y -= 18;
  }

  // 마지막 페이지에 서명
  if (y < MARGIN_BOTTOM + 120) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
    y = PAGE_HEIGHT - 100;
  }

  y -= 25;
  page.drawText('발 급 일 :              년          월          일', { x: 65, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 55;

  centerText(page, '재범방지교육통합센터', y, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });
}

// ========== 메인 ==========
async function main() {
  console.log('전체 증명서 PDF 생성 시작 (v4 - 상세 내용)...\n');

  const fontPath = path.join(__dirname, '../public/fonts/NanumGothicBold.ttf');
  const logoPath = path.join(__dirname, '../public/images/logo/logo.png');
  const sealPath = path.join(__dirname, '../public/images/seal.png');
  const outputDir = path.join(__dirname, '../public/certificates');
  const docsDir = path.join(__dirname, '../docs');

  const fontBytes = fs.readFileSync(fontPath);
  let logoBytes, sealBytes;
  try { logoBytes = fs.readFileSync(logoPath); } catch(e) {}
  try { sealBytes = fs.readFileSync(sealPath); } catch(e) {}

  const certificates = [
    { name: '재범 위험 종합 관리 평가 증명서', type: 'assessment' },
    { name: '재범방지교육통합센터 소견서', type: 'opinion' },
    { name: '재범방지교육통합센터 탄원서', type: 'petition', isCounselor: false },
    { name: '심리상담사 서명 탄원서', type: 'petition', isCounselor: true },
    { name: '심리상담 소감문', type: 'reflection', reflectionType: 'counseling' },
    { name: '이수 소감문', type: 'reflection', reflectionType: 'completion' },
    { name: '재범방지교육통합센터 교육내용 증명서', type: 'education', eduType: 'cbt' },
    { name: '재범방지교육 상세 교육과정 증명서', type: 'education', eduType: 'cbt' },
    { name: '음주운전 재범방지교육 교육내용 증명서', type: 'education', eduType: 'drunk-driving' },
    { name: '폭력범죄 재범방지교육 교육내용 증명서', type: 'education', eduType: 'violence' },
    { name: '재산범죄 재범방지교육 교육내용 증명서', type: 'education', eduType: 'property' },
    { name: '성범죄 재범방지교육 교육내용 증명서', type: 'education', eduType: 'sexual' },
    { name: '도박중독 재범방지교육 교육내용 증명서', type: 'education', eduType: 'gambling' },
    { name: '마약범죄 재범방지교육 교육내용 증명서', type: 'education', eduType: 'drugs' },
    { name: '디지털범죄 재범방지교육 교육내용 증명서', type: 'education', eduType: 'digital' },
    { name: '준법의식교육 증명서', type: 'education', eduType: 'law-compliance' },
    { name: '인지행동개선훈련 증명서', type: 'education', eduType: 'cbt' },
    { name: '인지행동개선훈련 증명서_기본', type: 'education', eduType: 'cbt' },
  ];

  for (const cert of certificates) {
    try {
      console.log(`생성 중: ${cert.name}.pdf`);

      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const font = await pdfDoc.embedFont(fontBytes);

      let logoImage, sealImage;
      if (logoBytes) try { logoImage = await pdfDoc.embedPng(logoBytes); } catch(e) {}
      if (sealBytes) try { sealImage = await pdfDoc.embedPng(sealBytes); } catch(e) {}

      switch (cert.type) {
        case 'assessment':
          await generateAssessmentCertificate(pdfDoc, font, logoImage, sealImage);
          break;
        case 'opinion':
          await generateOpinionCertificate(pdfDoc, font, logoImage, sealImage);
          break;
        case 'petition':
          await generatePetitionCertificate(pdfDoc, font, logoImage, sealImage, cert.isCounselor);
          break;
        case 'reflection':
          await generateReflectionCertificate(pdfDoc, font, logoImage, sealImage, cert.reflectionType);
          break;
        case 'education':
          await generateEducationCertificate(pdfDoc, font, logoImage, sealImage, cert.eduType);
          break;
      }

      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(path.join(outputDir, `${cert.name}.pdf`), pdfBytes);
      fs.writeFileSync(path.join(docsDir, `${cert.name}.pdf`), pdfBytes);

      const pageCount = pdfDoc.getPageCount();
      console.log(`  ✓ 완료: ${cert.name}.pdf (${pageCount}페이지)`);
    } catch (error) {
      console.error(`  ✗ 실패: ${cert.name}`, error.message);
    }
  }

  console.log('\n모든 증명서 생성 완료!');
}

main().catch(console.error);
