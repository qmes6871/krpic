const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

// A4 사이즈
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

// 디자인별 색상 테마
const THEMES = {
  // 교육내용 증명서 - 파란색 계열
  education: {
    primary: rgb(0.05, 0.25, 0.45),
    secondary: rgb(0.2, 0.4, 0.6),
    accent: rgb(0.1, 0.5, 0.7),
    border: rgb(0.15, 0.35, 0.55),
    bg: rgb(0.95, 0.97, 1),
  },
  // 소견서 - 녹색 계열
  opinion: {
    primary: rgb(0.1, 0.35, 0.2),
    secondary: rgb(0.2, 0.45, 0.3),
    accent: rgb(0.15, 0.5, 0.35),
    border: rgb(0.2, 0.4, 0.25),
    bg: rgb(0.95, 0.98, 0.95),
  },
  // 탄원서 - 보라색 계열
  petition: {
    primary: rgb(0.3, 0.15, 0.4),
    secondary: rgb(0.4, 0.25, 0.5),
    accent: rgb(0.5, 0.3, 0.6),
    border: rgb(0.35, 0.2, 0.45),
    bg: rgb(0.97, 0.95, 0.98),
  },
  // 평가서 - 주황색 계열
  assessment: {
    primary: rgb(0.5, 0.25, 0.05),
    secondary: rgb(0.6, 0.35, 0.15),
    accent: rgb(0.7, 0.4, 0.1),
    border: rgb(0.55, 0.3, 0.1),
    bg: rgb(1, 0.97, 0.94),
  },
  // 실천일지/보고서 - 회색 계열
  report: {
    primary: rgb(0.2, 0.2, 0.25),
    secondary: rgb(0.35, 0.35, 0.4),
    accent: rgb(0.4, 0.4, 0.45),
    border: rgb(0.3, 0.3, 0.35),
    bg: rgb(0.96, 0.96, 0.97),
  },
  // 소감문 - 따뜻한 베이지 계열
  reflection: {
    primary: rgb(0.45, 0.3, 0.15),
    secondary: rgb(0.55, 0.4, 0.25),
    accent: rgb(0.6, 0.45, 0.2),
    border: rgb(0.5, 0.35, 0.2),
    bg: rgb(0.99, 0.97, 0.94),
  },
};

// 카테고리별 상세 교육 내용
const EDUCATION_DETAILS = {
  'drunk-driving': {
    category: '음주운전',
    modules: [
      {
        title: '1. 음주운전의 위험성 인식',
        duration: '2시간',
        contents: [
          '• 알코올이 운전 능력에 미치는 영향 (반응속도, 판단력, 시야)',
          '• 음주운전 사고 사례 분석 및 피해자 영상 시청',
          '• 혈중알코올농도와 사고 위험성의 상관관계',
        ],
      },
      {
        title: '2. 법적 책임과 처벌',
        duration: '2시간',
        contents: [
          '• 도로교통법상 음주운전 처벌 기준 (면허취소, 벌금, 징역)',
          '• 음주운전 전과가 미치는 사회적 영향 (취업, 신용 등)',
          '• 피해자에 대한 민형사상 책임',
        ],
      },
      {
        title: '3. 음주 거절 및 대안 훈련',
        duration: '2시간',
        contents: [
          '• 음주 권유 거절 기술 역할극',
          '• 대리운전, 택시, 대중교통 등 대안 교통수단 계획 수립',
          '• 음주 상황 예방을 위한 사전 계획 세우기',
        ],
      },
      {
        title: '4. 재발 방지 계획 수립',
        duration: '2시간',
        contents: [
          '• 개인별 위험 상황 분석 및 대처 방안 수립',
          '• 가족/지인과의 약속 및 지지체계 구축',
          '• 준법 서약서 작성 및 실천 다짐',
        ],
      },
    ],
  },
  'violence': {
    category: '폭력범죄',
    modules: [
      {
        title: '1. 분노 이해와 인식',
        duration: '2시간',
        contents: [
          '• 분노의 생리적/심리적 메커니즘 이해',
          '• 자신의 분노 유발 요인 파악하기',
          '• 분노 강도 측정 및 경고 신호 인식',
        ],
      },
      {
        title: '2. 분노 조절 기법',
        duration: '2시간',
        contents: [
          '• 호흡법, 근육 이완법, 타임아웃 기법',
          '• 인지 재구성: 상황을 다르게 해석하기',
          '• 스트레스 관리 및 건강한 해소법',
        ],
      },
      {
        title: '3. 비폭력 의사소통',
        duration: '2시간',
        contents: [
          '• 나-전달법(I-message)을 활용한 감정 표현',
          '• 적극적 경청과 공감 훈련',
          '• 갈등 상황 역할극 및 피드백',
        ],
      },
      {
        title: '4. 피해자 공감 및 재발 방지',
        duration: '2시간',
        contents: [
          '• 폭력 피해자의 심리적 트라우마 이해',
          '• 책임 인정과 진정한 사과의 의미',
          '• 위험 상황 대처 계획 및 지지체계 구축',
        ],
      },
    ],
  },
  'property': {
    category: '재산범죄',
    modules: [
      {
        title: '1. 재산권과 법적 책임',
        duration: '2시간',
        contents: [
          '• 절도, 사기, 횡령 등 재산범죄 유형별 법적 처벌',
          '• 민사상 손해배상 책임과 신용 영향',
          '• 범죄 기록이 미치는 장기적 영향 (취업, 대출 등)',
        ],
      },
      {
        title: '2. 피해자 공감 훈련',
        duration: '2시간',
        contents: [
          '• 피해자 입장에서 생각해보기 (영상, 사례)',
          '• 경제적 피해를 넘어선 심리적 피해 이해',
          '• 피해자에게 편지 쓰기 실습',
        ],
      },
      {
        title: '3. 경제 관리 훈련',
        duration: '2시간',
        contents: [
          '• 가계부 작성 및 예산 관리 기법',
          '• 충동 구매 및 과소비 예방 전략',
          '• 합법적인 수입 증대 방안 탐색',
        ],
      },
      {
        title: '4. 재발 방지 계획',
        duration: '2시간',
        contents: [
          '• 범행 동기 분석 및 대안 행동 탐색',
          '• 유혹 상황 대처 훈련',
          '• 사회 복귀 및 준법 생활 계획 수립',
        ],
      },
    ],
  },
  'sexual': {
    category: '성범죄',
    modules: [
      {
        title: '1. 성인지 감수성 교육',
        duration: '2시간',
        contents: [
          '• 성별 고정관념과 왜곡된 성 인식 점검',
          '• 건강한 성 의식과 존중의 의미',
          '• 미디어 속 성 묘사의 문제점 분석',
        ],
      },
      {
        title: '2. 동의와 경계 이해',
        duration: '2시간',
        contents: [
          '• 명확한 동의의 개념과 중요성',
          '• 상대방의 경계 존중하기',
          '• 동의 없는 행동의 법적 결과',
        ],
      },
      {
        title: '3. 피해자 영향 이해',
        duration: '2시간',
        contents: [
          '• 성범죄 피해자의 심리적 트라우마',
          '• 피해자 2차 가해 방지',
          '• 진정한 반성과 책임의 의미',
        ],
      },
      {
        title: '4. 충동 조절 및 재발 방지',
        duration: '2시간',
        contents: [
          '• 성적 충동 인식 및 조절 기법',
          '• 위험 상황 회피 전략',
          '• 건강한 관계 형성 훈련',
        ],
      },
    ],
  },
  'gambling': {
    category: '도박중독',
    modules: [
      {
        title: '1. 도박 중독의 이해',
        duration: '2시간',
        contents: [
          '• 도박 중독의 정의와 진단 기준',
          '• 뇌과학으로 보는 중독 메커니즘',
          '• 자가 진단 및 중독 수준 평가',
        ],
      },
      {
        title: '2. 도박의 폐해 인식',
        duration: '2시간',
        contents: [
          '• 경제적 파탄 사례 분석',
          '• 가족 관계 파괴와 사회적 고립',
          '• 도박 관련 범죄와 법적 처벌',
        ],
      },
      {
        title: '3. 재정 관리 및 회복',
        duration: '2시간',
        contents: [
          '• 부채 관리 및 재정 재건 계획',
          '• 도박 자금 차단 방법 (자기 배제 등)',
          '• 가족과의 신뢰 회복 방안',
        ],
      },
      {
        title: '4. 재발 방지 훈련',
        duration: '2시간',
        contents: [
          '• 도박 유혹 상황 인식 및 대처',
          '• 건전한 여가 활동 계획',
          '• 자조 모임 및 전문 상담 연계',
        ],
      },
    ],
  },
  'drugs': {
    category: '마약범죄',
    modules: [
      {
        title: '1. 마약의 위험성',
        duration: '2시간',
        contents: [
          '• 마약 종류별 신체적/정신적 영향',
          '• 뇌 손상 및 중독 메커니즘',
          '• 마약 관련 사망 및 건강 피해 사례',
        ],
      },
      {
        title: '2. 법적 처벌과 사회적 영향',
        duration: '2시간',
        contents: [
          '• 마약류 관리에 관한 법률 이해',
          '• 투약/소지/매매별 처벌 수준',
          '• 전과 기록이 미치는 장기적 영향',
        ],
      },
      {
        title: '3. 거절 기술 훈련',
        duration: '2시간',
        contents: [
          '• 마약 권유 상황 역할극',
          '• 단호한 거절 기술 습득',
          '• 위험 환경 및 인간관계 정리',
        ],
      },
      {
        title: '4. 재발 방지 계획',
        duration: '2시간',
        contents: [
          '• 개인별 재발 위험 요인 분석',
          '• 스트레스 대처 및 건강한 생활습관',
          '• 전문 치료 및 재활 프로그램 연계',
        ],
      },
    ],
  },
  'digital': {
    category: '디지털범죄',
    modules: [
      {
        title: '1. 디지털 윤리와 법률',
        duration: '2시간',
        contents: [
          '• 정보통신망법, 개인정보보호법 이해',
          '• 사이버 범죄 유형별 처벌 기준',
          '• 디지털 공간에서의 윤리적 행동',
        ],
      },
      {
        title: '2. 피해자 보호와 공감',
        duration: '2시간',
        contents: [
          '• 사이버 범죄 피해자의 심리적 고통',
          '• 디지털 성범죄의 심각성',
          '• 피해 확산 방지의 중요성',
        ],
      },
      {
        title: '3. 건전한 인터넷 사용',
        duration: '2시간',
        contents: [
          '• 인터넷 중독 자가 진단',
          '• 건강한 디지털 생활 습관',
          '• SNS 및 온라인 커뮤니티 윤리',
        ],
      },
      {
        title: '4. 재발 방지 계획',
        duration: '2시간',
        contents: [
          '• 디지털 범죄 유발 요인 분석',
          '• 온라인 활동 자기 모니터링',
          '• 합법적인 IT 기술 활용 방안',
        ],
      },
    ],
  },
  'law-compliance': {
    category: '준법의식',
    modules: [
      {
        title: '1. 법과 사회질서',
        duration: '2시간',
        contents: [
          '• 법의 필요성과 사회적 기능',
          '• 시민으로서의 권리와 의무',
          '• 법치주의와 민주주의의 관계',
        ],
      },
      {
        title: '2. 일상 속 법률 이해',
        duration: '2시간',
        contents: [
          '• 형법, 민법, 행정법의 기초',
          '• 경범죄와 처벌 기준',
          '• 실생활 법률 사례 분석',
        ],
      },
      {
        title: '3. 사회적 책임 인식',
        duration: '2시간',
        contents: [
          '• 개인 행동이 사회에 미치는 영향',
          '• 공동체 의식과 배려',
          '• 갈등의 합법적 해결 방법',
        ],
      },
      {
        title: '4. 준법 생활 계획',
        duration: '2시간',
        contents: [
          '• 자신의 법 위반 경험 성찰',
          '• 준법 생활 실천 계획 수립',
          '• 사회 구성원으로서의 다짐',
        ],
      },
    ],
  },
  'cbt': {
    category: '인지행동개선',
    modules: [
      {
        title: '1. 인지 왜곡 이해',
        duration: '2시간',
        contents: [
          '• 자동적 사고와 인지 왜곡의 개념',
          '• 흑백논리, 과잉일반화, 개인화 등 왜곡 유형',
          '• 자신의 사고 패턴 분석하기',
        ],
      },
      {
        title: '2. 행동 패턴 분석',
        duration: '2시간',
        contents: [
          '• 문제 행동의 선행사건-행동-결과 분석',
          '• 행동 일지 작성 실습',
          '• 반복되는 부정적 패턴 인식',
        ],
      },
      {
        title: '3. 인지 재구성',
        duration: '2시간',
        contents: [
          '• 부정적 자동사고 논박하기',
          '• 합리적 대안 사고 개발',
          '• 균형 잡힌 사고 훈련',
        ],
      },
      {
        title: '4. 대안 행동 학습',
        duration: '2시간',
        contents: [
          '• 문제 해결 기법 훈련',
          '• 상황별 대처 행동 역할극',
          '• 새로운 행동 습관 형성 계획',
        ],
      },
    ],
  },
};

// 증명서 목록 (20개)
const certificates = [
  // === 평가/증명서 유형 ===
  {
    id: 'risk-assessment',
    fileName: '재범 위험 종합 관리 평가 증명서.pdf',
    title: '재범 위험 종합 관리 평가 증명서',
    type: 'assessment',
    content: '위 사람은 본 센터에서 실시한 재범 위험 종합 관리 평가 프로그램에 참여하여 아래와 같이 평가를 완료하였음을 증명합니다.',
    assessmentItems: [
      { category: '심리상태 평가', items: ['우울/불안 수준', '충동성 평가', '자아존중감 측정'] },
      { category: '재범위험성 평가', items: ['범죄 유발 요인 분석', '보호 요인 평가', '재범 가능성 예측'] },
      { category: '사회적응도 평가', items: ['대인관계 능력', '스트레스 대처', '사회적 지지체계'] },
    ],
  },

  // === 소견서 유형 ===
  {
    id: 'center-opinion',
    fileName: '재범방지교육통합센터 소견서.pdf',
    title: '소 견 서',
    type: 'opinion',
    content: '위 사람은 본 센터에서 실시한 재범방지교육 프로그램에 성실히 참여하였으며, 교육 과정에서 관찰된 사항에 대하여 아래와 같이 소견을 제출합니다.',
    opinionSections: [
      { label: '교육 참여도', content: '교육 전 과정에 성실히 참여하였으며, 적극적인 자세로 모든 활동에 임하였습니다.' },
      { label: '변화 관찰', content: '자신의 행동에 대한 깊은 반성과 함께 피해자에 대한 진정한 공감 능력을 보였습니다.' },
      { label: '개선 의지', content: '재범 방지를 위한 구체적인 계획을 수립하고 실천 의지를 표명하였습니다.' },
      { label: '종합 소견', content: '교육을 통해 의미 있는 인식 변화가 관찰되었으며, 사회 복귀 준비가 양호한 것으로 판단됩니다.' },
    ],
  },

  // === 탄원서 유형 ===
  {
    id: 'petition',
    fileName: '재범방지교육통합센터 탄원서.pdf',
    title: '탄 원 서',
    type: 'petition',
    courtAddress: '수신: 대한민국 법원 귀중',
    petitionContent: [
      '존경하는 재판장님께',
      '',
      '본 재범방지교육통합센터는 위 피고인이 본 센터의 재범방지교육 프로그램에 참여하여 보여준 진정한 반성과 변화의 모습을 확인하고, 선처를 탄원하고자 이 글을 올립니다.',
      '',
      '피고인은 교육 기간 동안 자신의 잘못에 대해 깊이 성찰하였으며, 피해자에 대한 진심 어린 사죄의 마음을 표현하였습니다. 또한 재범 방지를 위한 구체적인 실천 계획을 수립하고, 이를 실행에 옮기기 위한 노력을 기울이고 있습니다.',
      '',
      '교육 참여 과정에서 피고인은 성실한 태도와 적극적인 변화 의지를 보여주었으며, 전문 상담사의 소견에 따르면 재범 가능성이 낮은 것으로 평가됩니다.',
      '',
      '이에 본 센터는 피고인이 사회에 복귀하여 건전한 시민으로서 새로운 삶을 살아갈 수 있도록 재판장님의 현명하신 판단과 선처를 간곡히 탄원합니다.',
    ],
  },
  {
    id: 'counselor-petition',
    fileName: '심리상담사 서명 탄원서.pdf',
    title: '심리상담사 탄원서',
    type: 'petition',
    courtAddress: '수신: 대한민국 법원 귀중',
    petitionContent: [
      '존경하는 재판장님께',
      '',
      '본 심리상담사는 위 피고인과 심층 상담을 진행하며 관찰한 진정한 반성과 변화의 모습을 바탕으로, 선처를 탄원하고자 합니다.',
      '',
      '상담 과정에서 피고인은 자신의 행동이 피해자와 사회에 미친 영향에 대해 깊이 인식하게 되었으며, 진심으로 뉘우치는 모습을 보였습니다. 특히 피해자의 고통에 대한 공감 능력이 향상되었고, 자신의 잘못에 대한 책임을 회피하지 않으려는 성숙한 태도가 관찰되었습니다.',
      '',
      '심리 평가 결과, 피고인은 재범 위험 요인이 감소하였으며 사회 적응을 위한 심리적 준비가 되어 있는 것으로 판단됩니다.',
      '',
      '이에 전문 심리상담사로서 피고인의 사회 복귀 기회를 위한 선처를 탄원드리며, 재판장님의 현명한 판단을 부탁드립니다.',
    ],
    counselorSignature: true,
  },

  // === 실천일지/보고서 유형 ===
  {
    id: 'risk-management-diary',
    fileName: '재범 위험 관리 실천일지.pdf',
    title: '재범 위험 관리 실천일지',
    type: 'report',
    content: '위 사람은 본 센터에서 제공한 재범 위험 관리 프로그램에 따라 아래와 같이 실천일지를 성실히 작성하였음을 증명합니다.',
    diaryItems: [
      { title: '일일 자기 점검', desc: '매일 자신의 감정, 생각, 행동을 기록하고 위험 신호를 모니터링합니다.' },
      { title: '위험 상황 기록', desc: '재범 유발 가능성이 있는 상황을 인식하고 기록합니다.' },
      { title: '대처 행동 기록', desc: '위험 상황에서 사용한 대처 전략과 그 효과를 기록합니다.' },
      { title: '주간 성찰', desc: '한 주간의 실천 내용을 돌아보고 개선점을 도출합니다.' },
    ],
  },
  {
    id: 'change-report',
    fileName: '재범방지교육 이수자 변화 기록 보고서.pdf',
    title: '이수자 변화 기록 보고서',
    type: 'report',
    content: '위 사람의 재범방지교육 이수 과정에서 관찰된 변화 사항을 아래와 같이 보고합니다.',
    changeRecords: [
      { phase: '교육 초기', observation: '범죄 행위에 대한 인식이 부족하고, 책임을 외부로 돌리는 경향이 관찰됨' },
      { phase: '교육 중기', observation: '점진적으로 자신의 행동에 대한 책임을 인식하기 시작하고, 피해자 입장을 이해하려는 노력이 보임' },
      { phase: '교육 후기', observation: '진정한 반성과 함께 재범 방지를 위한 구체적인 계획을 수립하고 실천 의지를 보임' },
      { phase: '교육 완료', observation: '인식, 태도, 행동 측면에서 긍정적인 변화가 관찰되며, 사회 복귀 준비가 양호함' },
    ],
  },

  // === 소감문 유형 ===
  {
    id: 'counseling-reflection',
    fileName: '심리상담 소감문.pdf',
    title: '심리상담 소감문',
    type: 'reflection',
    content: '위 사람은 본 센터에서 실시한 심리상담 프로그램에 참여하고 아래와 같이 소감문을 제출하였음을 증명합니다.',
    reflectionGuide: [
      '상담을 통해 새롭게 알게 된 점',
      '자신의 행동에 대한 반성',
      '피해자에 대한 생각',
      '앞으로의 변화 다짐',
    ],
  },
  {
    id: 'completion-reflections',
    fileName: '이수 소감문.pdf',
    title: '이수 소감문',
    type: 'reflection',
    content: '위 사람은 재범방지교육 프로그램을 이수하고 아래와 같이 소감문을 제출하였음을 증명합니다.',
    reflectionGuide: [
      '교육을 통해 배운 점',
      '가장 인상 깊었던 내용',
      '자신의 변화',
      '앞으로의 다짐',
    ],
  },

  // === 교육내용 증명서 (상세) ===
  {
    id: 'center-education',
    fileName: '재범방지교육통합센터 교육내용 증명서.pdf',
    title: '교육내용 증명서',
    type: 'education',
    educationType: 'cbt',
  },
  {
    id: 'detailed-course-certificate',
    fileName: '재범방지교육 상세 교육과정 증명서.pdf',
    title: '상세 교육과정 증명서',
    type: 'education',
    educationType: 'cbt',
  },
  {
    id: 'drunk-driving-certificate',
    fileName: '음주운전 재범방지교육 교육내용 증명서.pdf',
    title: '음주운전 재범방지교육',
    subtitle: '교육내용 증명서',
    type: 'education',
    educationType: 'drunk-driving',
  },
  {
    id: 'violence-certificate',
    fileName: '폭력범죄 재범방지교육 교육내용 증명서.pdf',
    title: '폭력범죄 재범방지교육',
    subtitle: '교육내용 증명서',
    type: 'education',
    educationType: 'violence',
  },
  {
    id: 'property-certificate',
    fileName: '재산범죄 재범방지교육 교육내용 증명서.pdf',
    title: '재산범죄 재범방지교육',
    subtitle: '교육내용 증명서',
    type: 'education',
    educationType: 'property',
  },
  {
    id: 'sexual-certificate',
    fileName: '성범죄 재범방지교육 교육내용 증명서.pdf',
    title: '성범죄 재범방지교육',
    subtitle: '교육내용 증명서',
    type: 'education',
    educationType: 'sexual',
  },
  {
    id: 'gambling-certificate',
    fileName: '도박중독 재범방지교육 교육내용 증명서.pdf',
    title: '도박중독 재범방지교육',
    subtitle: '교육내용 증명서',
    type: 'education',
    educationType: 'gambling',
  },
  {
    id: 'drugs-certificate',
    fileName: '마약범죄 재범방지교육 교육내용 증명서.pdf',
    title: '마약범죄 재범방지교육',
    subtitle: '교육내용 증명서',
    type: 'education',
    educationType: 'drugs',
  },
  {
    id: 'digital-certificate',
    fileName: '디지털범죄 재범방지교육 교육내용 증명서.pdf',
    title: '디지털범죄 재범방지교육',
    subtitle: '교육내용 증명서',
    type: 'education',
    educationType: 'digital',
  },
  {
    id: 'law-compliance-certificate',
    fileName: '준법의식교육 증명서.pdf',
    title: '준법의식교육',
    subtitle: '교육내용 증명서',
    type: 'education',
    educationType: 'law-compliance',
  },
  {
    id: 'cbt-certificate',
    fileName: '인지행동개선훈련 증명서.pdf',
    title: '인지행동개선훈련',
    subtitle: '교육내용 증명서',
    type: 'education',
    educationType: 'cbt',
  },
  {
    id: 'default-certificate',
    fileName: '인지행동개선훈련 증명서_기본.pdf',
    title: '인지행동개선훈련',
    subtitle: '교육내용 증명서',
    type: 'education',
    educationType: 'cbt',
  },
];

// 텍스트 중앙 정렬 헬퍼
function centerText(page, text, y, font, size, color) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: (PAGE_WIDTH - width) / 2,
    y,
    size,
    font,
    color,
  });
}

// 교육내용 증명서 생성
async function generateEducationCertificate(pdfDoc, cert, font, logoImage, sealImage) {
  const theme = THEMES.education;
  const eduDetails = EDUCATION_DETAILS[cert.educationType];

  // 여러 페이지 생성
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // 테두리
  page1.drawRectangle({
    x: 25, y: 25,
    width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50,
    borderColor: theme.border, borderWidth: 2,
  });
  page1.drawRectangle({
    x: 30, y: 30,
    width: PAGE_WIDTH - 60, height: PAGE_HEIGHT - 60,
    borderColor: theme.border, borderWidth: 0.5,
  });

  let y = PAGE_HEIGHT - 70;

  // 로고
  if (logoImage) {
    const logoW = 100;
    const logoH = (logoImage.height / logoImage.width) * logoW;
    page1.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  // 기관명
  centerText(page1, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 40;

  // 제목
  centerText(page1, cert.title, y, font, 28, theme.primary);
  y -= 25;

  if (cert.subtitle) {
    centerText(page1, cert.subtitle, y, font, 20, theme.primary);
    y -= 30;
  }

  // 구분선
  page1.drawLine({ start: { x: 60, y }, end: { x: PAGE_WIDTH - 60, y }, thickness: 1.5, color: theme.border });
  y -= 35;

  // 이름 입력란
  page1.drawText('성        명 :', { x: 70, y, size: 14, font, color: rgb(0.1, 0.1, 0.1) });
  page1.drawLine({ start: { x: 160, y: y - 3 }, end: { x: 350, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 35;

  // 본문
  const introText = `위 사람은 본 센터에서 실시한 ${eduDetails.category} 재범방지교육을 아래와 같이 이수하였음을 증명합니다.`;
  page1.drawText(introText, { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 40;

  // 교육 내용 헤더
  page1.drawRectangle({
    x: 50, y: y - 20,
    width: PAGE_WIDTH - 100, height: 30,
    color: theme.primary,
  });
  centerText(page1, '【 교 육 내 용 】', y - 8, font, 14, rgb(1, 1, 1));
  y -= 55;

  // 교육 모듈 (2개씩 페이지1에)
  for (let i = 0; i < Math.min(2, eduDetails.modules.length); i++) {
    const mod = eduDetails.modules[i];

    // 모듈 제목 배경
    page1.drawRectangle({
      x: 55, y: y - 5,
      width: PAGE_WIDTH - 110, height: 22,
      color: theme.bg,
    });

    page1.drawText(mod.title, { x: 65, y: y, size: 12, font, color: theme.primary });
    page1.drawText(`(${mod.duration})`, { x: PAGE_WIDTH - 120, y: y, size: 10, font, color: theme.secondary });
    y -= 25;

    for (const content of mod.contents) {
      page1.drawText(content, { x: 75, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
      y -= 18;
    }
    y -= 15;
  }

  // 페이지 2 (나머지 모듈)
  if (eduDetails.modules.length > 2) {
    const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    // 테두리
    page2.drawRectangle({
      x: 25, y: 25,
      width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50,
      borderColor: theme.border, borderWidth: 2,
    });

    y = PAGE_HEIGHT - 70;

    for (let i = 2; i < eduDetails.modules.length; i++) {
      const mod = eduDetails.modules[i];

      page2.drawRectangle({
        x: 55, y: y - 5,
        width: PAGE_WIDTH - 110, height: 22,
        color: theme.bg,
      });

      page2.drawText(mod.title, { x: 65, y: y, size: 12, font, color: theme.primary });
      page2.drawText(`(${mod.duration})`, { x: PAGE_WIDTH - 120, y: y, size: 10, font, color: theme.secondary });
      y -= 25;

      for (const content of mod.contents) {
        page2.drawText(content, { x: 75, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
        y -= 18;
      }
      y -= 15;
    }

    // 총 교육시간
    y -= 20;
    page2.drawRectangle({
      x: 50, y: y - 10,
      width: PAGE_WIDTH - 100, height: 35,
      color: theme.bg,
      borderColor: theme.border,
      borderWidth: 1,
    });
    centerText(page2, '총 교육시간: 8시간', y, font, 14, theme.primary);
    y -= 50;

    // 날짜
    page2.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 60;

    // 기관 및 직인
    centerText(page2, '재범방지교육통합센터', y, font, 16, theme.primary);
    if (sealImage) {
      page2.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 60, y: y - 30, width: 70, height: 70 });
    }
    y -= 30;
    centerText(page2, '센 터 장', y, font, 12, theme.secondary);
  }
}

// 소견서 생성
async function generateOpinionCertificate(pdfDoc, cert, font, logoImage, sealImage) {
  const theme = THEMES.opinion;
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // 테두리 (이중)
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2.5 });
  page.drawRectangle({ x: 32, y: 32, width: PAGE_WIDTH - 64, height: PAGE_HEIGHT - 64, borderColor: theme.border, borderWidth: 0.5 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 90;
    const logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 50;

  centerText(page, cert.title, y, font, 36, theme.primary);
  y -= 20;
  centerText(page, 'Professional Opinion Statement', y, font, 10, theme.secondary);
  y -= 40;

  page.drawLine({ start: { x: 70, y }, end: { x: PAGE_WIDTH - 70, y }, thickness: 1.5, color: theme.border });
  y -= 40;

  // 이름
  page.drawText('성        명 :', { x: 80, y, size: 14, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 170, y: y - 3 }, end: { x: 380, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 40;

  // 본문
  const lines = cert.content.match(/.{1,45}/g) || [cert.content];
  for (const line of lines) {
    page.drawText(line, { x: 80, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 22;
  }
  y -= 20;

  // 소견 섹션들
  for (const section of cert.opinionSections) {
    // 라벨 배경
    page.drawRectangle({ x: 60, y: y - 8, width: 100, height: 24, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(section.label, { x: 70, y: y - 2, size: 11, font, color: theme.primary });
    y -= 25;

    const contentLines = section.content.match(/.{1,50}/g) || [section.content];
    for (const line of contentLines) {
      page.drawText(line, { x: 80, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
      y -= 18;
    }
    y -= 15;
  }

  y -= 20;
  page.drawText('발 급 일 :              년          월          일', { x: 80, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 60;

  centerText(page, '재범방지교육통합센터', y, font, 16, theme.primary);
  if (sealImage) {
    page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 60, y: y - 30, width: 70, height: 70 });
  }
  y -= 30;
  centerText(page, '센 터 장', y, font, 12, theme.secondary);
}

// 탄원서 생성
async function generatePetitionCertificate(pdfDoc, cert, font, logoImage, sealImage) {
  const theme = THEMES.petition;
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // 테두리
  page.drawRectangle({ x: 30, y: 30, width: PAGE_WIDTH - 60, height: PAGE_HEIGHT - 60, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 80;
    const logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page, cert.counselorSignature ? '심리상담사' : '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 45;

  centerText(page, cert.title, y, font, 34, theme.primary);
  y -= 20;
  centerText(page, 'Petition Letter', y, font, 10, theme.secondary);
  y -= 35;

  // 수신
  page.drawRectangle({ x: 60, y: y - 5, width: PAGE_WIDTH - 120, height: 28, color: theme.bg });
  centerText(page, cert.courtAddress, y, font, 12, theme.primary);
  y -= 45;

  // 이름
  page.drawText('피고인 성명 :', { x: 80, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 180, y: y - 3 }, end: { x: 400, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 40;

  // 탄원 내용
  for (const line of cert.petitionContent) {
    if (line === '') {
      y -= 15;
      continue;
    }
    const wrappedLines = line.match(/.{1,42}/g) || [line];
    for (const wl of wrappedLines) {
      page.drawText(wl, { x: 80, y, size: 12, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 22;
    }
  }

  y -= 30;
  page.drawText('발 급 일 :              년          월          일', { x: 80, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 60;

  if (cert.counselorSignature) {
    centerText(page, '심리상담사', y, font, 14, theme.primary);
    y -= 25;
    page.drawText('성명:', { x: PAGE_WIDTH / 2 - 50, y, size: 12, font, color: theme.secondary });
    page.drawLine({ start: { x: PAGE_WIDTH / 2, y: y - 3 }, end: { x: PAGE_WIDTH / 2 + 100, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  } else {
    centerText(page, '재범방지교육통합센터', y, font, 16, theme.primary);
    if (sealImage) {
      page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 60, y: y - 30, width: 70, height: 70 });
    }
    y -= 30;
    centerText(page, '센 터 장', y, font, 12, theme.secondary);
  }
}

// 평가서 생성
async function generateAssessmentCertificate(pdfDoc, cert, font, logoImage, sealImage) {
  const theme = THEMES.assessment;
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2.5 });
  page.drawRectangle({ x: 32, y: 32, width: PAGE_WIDTH - 64, height: PAGE_HEIGHT - 64, borderColor: theme.accent, borderWidth: 0.5 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 100;
    const logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 50;

  centerText(page, cert.title, y, font, 24, theme.primary);
  y -= 20;
  centerText(page, 'Comprehensive Risk Assessment Certificate', y, font, 9, theme.secondary);
  y -= 40;

  page.drawLine({ start: { x: 60, y }, end: { x: PAGE_WIDTH - 60, y }, thickness: 2, color: theme.border });
  y -= 40;

  page.drawText('성        명 :', { x: 80, y, size: 14, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 170, y: y - 3 }, end: { x: 380, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 35;

  const lines = cert.content.match(/.{1,45}/g) || [cert.content];
  for (const line of lines) {
    page.drawText(line, { x: 80, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 20;
  }
  y -= 25;

  // 평가 항목
  for (const assessment of cert.assessmentItems) {
    page.drawRectangle({ x: 55, y: y - 5, width: PAGE_WIDTH - 110, height: 24, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(`▶ ${assessment.category}`, { x: 65, y: y, size: 12, font, color: theme.primary });
    y -= 28;

    for (const item of assessment.items) {
      page.drawText(`   • ${item}`, { x: 80, y, size: 10, font, color: rgb(0.25, 0.25, 0.25) });
      y -= 18;
    }
    y -= 10;
  }

  y -= 20;
  page.drawRectangle({ x: 60, y: y - 8, width: PAGE_WIDTH - 120, height: 30, color: theme.bg, borderColor: theme.accent, borderWidth: 1 });
  centerText(page, '종합 평가 결과: 재범 위험 관리 역량 양호', y, font, 12, theme.primary);
  y -= 50;

  page.drawText('발 급 일 :              년          월          일', { x: 80, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 60;

  centerText(page, '재범방지교육통합센터', y, font, 16, theme.primary);
  if (sealImage) {
    page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 60, y: y - 30, width: 70, height: 70 });
  }
  y -= 30;
  centerText(page, '센 터 장', y, font, 12, theme.secondary);
}

// 보고서/실천일지 생성
async function generateReportCertificate(pdfDoc, cert, font, logoImage, sealImage) {
  const theme = THEMES.report;
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  page.drawRectangle({ x: 30, y: 30, width: PAGE_WIDTH - 60, height: PAGE_HEIGHT - 60, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 90;
    const logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 50;

  centerText(page, cert.title, y, font, 26, theme.primary);
  y -= 40;

  page.drawLine({ start: { x: 70, y }, end: { x: PAGE_WIDTH - 70, y }, thickness: 1.5, color: theme.border });
  y -= 40;

  page.drawText('성        명 :', { x: 80, y, size: 14, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 170, y: y - 3 }, end: { x: 380, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 35;

  const lines = cert.content.match(/.{1,45}/g) || [cert.content];
  for (const line of lines) {
    page.drawText(line, { x: 80, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 20;
  }
  y -= 25;

  // 실천일지 항목
  if (cert.diaryItems) {
    for (const item of cert.diaryItems) {
      page.drawRectangle({ x: 55, y: y - 8, width: PAGE_WIDTH - 110, height: 50, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
      page.drawText(`■ ${item.title}`, { x: 65, y: y, size: 11, font, color: theme.primary });
      y -= 20;
      const descLines = item.desc.match(/.{1,50}/g) || [item.desc];
      for (const dl of descLines) {
        page.drawText(`  ${dl}`, { x: 70, y, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
        y -= 15;
      }
      y -= 20;
    }
  }

  // 변화 기록
  if (cert.changeRecords) {
    for (const record of cert.changeRecords) {
      page.drawRectangle({ x: 55, y: y - 8, width: PAGE_WIDTH - 110, height: 45, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
      page.drawText(`【${record.phase}】`, { x: 65, y: y, size: 11, font, color: theme.primary });
      y -= 20;
      const obsLines = record.observation.match(/.{1,48}/g) || [record.observation];
      for (const ol of obsLines) {
        page.drawText(ol, { x: 70, y, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
        y -= 14;
      }
      y -= 18;
    }
  }

  y -= 15;
  page.drawText('발 급 일 :              년          월          일', { x: 80, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 60;

  centerText(page, '재범방지교육통합센터', y, font, 16, theme.primary);
  if (sealImage) {
    page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 60, y: y - 30, width: 70, height: 70 });
  }
  y -= 30;
  centerText(page, '센 터 장', y, font, 12, theme.secondary);
}

// 소감문 생성
async function generateReflectionCertificate(pdfDoc, cert, font, logoImage, sealImage) {
  const theme = THEMES.reflection;
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // 테두리 (부드러운 이중선)
  page.drawRectangle({ x: 30, y: 30, width: PAGE_WIDTH - 60, height: PAGE_HEIGHT - 60, borderColor: theme.border, borderWidth: 1.5 });
  page.drawRectangle({ x: 38, y: 38, width: PAGE_WIDTH - 76, height: PAGE_HEIGHT - 76, borderColor: theme.accent, borderWidth: 0.5 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 90;
    const logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 50;

  centerText(page, cert.title, y, font, 28, theme.primary);
  y -= 40;

  page.drawLine({ start: { x: 80, y }, end: { x: PAGE_WIDTH - 80, y }, thickness: 1, color: theme.border });
  y -= 40;

  page.drawText('성        명 :', { x: 80, y, size: 14, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 170, y: y - 3 }, end: { x: 380, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 35;

  const lines = cert.content.match(/.{1,45}/g) || [cert.content];
  for (const line of lines) {
    page.drawText(line, { x: 80, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 20;
  }
  y -= 30;

  // 소감문 작성 가이드
  centerText(page, '【 작 성 내 용 】', y, font, 13, theme.primary);
  y -= 30;

  for (let i = 0; i < cert.reflectionGuide.length; i++) {
    page.drawRectangle({ x: 60, y: y - 8, width: PAGE_WIDTH - 120, height: 55, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(`${i + 1}. ${cert.reflectionGuide[i]}`, { x: 70, y: y, size: 11, font, color: theme.primary });
    y -= 60;
  }

  y -= 10;
  page.drawText('발 급 일 :              년          월          일', { x: 80, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 60;

  centerText(page, '재범방지교육통합센터', y, font, 16, theme.primary);
  if (sealImage) {
    page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 60, y: y - 30, width: 70, height: 70 });
  }
  y -= 30;
  centerText(page, '센 터 장', y, font, 12, theme.secondary);
}

async function main() {
  console.log('증명서 PDF 생성 시작 (v2 - 개별 디자인)...\n');

  const fontPath = path.join(__dirname, '../public/fonts/NanumGothicBold.ttf');
  const logoPath = path.join(__dirname, '../public/images/logo/logo.png');
  const sealPath = path.join(__dirname, '../public/images/seal.png');
  const outputDir = path.join(__dirname, '../public/certificates');
  const docsDir = path.join(__dirname, '../docs');

  const fontBytes = fs.readFileSync(fontPath);

  let logoBytes, sealBytes;
  try { logoBytes = fs.readFileSync(logoPath); } catch (e) { console.log('로고 없음'); }
  try { sealBytes = fs.readFileSync(sealPath); } catch (e) { console.log('직인 없음'); }

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  for (const cert of certificates) {
    try {
      console.log(`생성 중: ${cert.fileName}`);

      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const font = await pdfDoc.embedFont(fontBytes);

      let logoImage, sealImage;
      if (logoBytes) {
        try { logoImage = await pdfDoc.embedPng(logoBytes); } catch (e) {}
      }
      if (sealBytes) {
        try { sealImage = await pdfDoc.embedPng(sealBytes); } catch (e) {}
      }

      switch (cert.type) {
        case 'education':
          await generateEducationCertificate(pdfDoc, cert, font, logoImage, sealImage);
          break;
        case 'opinion':
          await generateOpinionCertificate(pdfDoc, cert, font, logoImage, sealImage);
          break;
        case 'petition':
          await generatePetitionCertificate(pdfDoc, cert, font, logoImage, sealImage);
          break;
        case 'assessment':
          await generateAssessmentCertificate(pdfDoc, cert, font, logoImage, sealImage);
          break;
        case 'report':
          await generateReportCertificate(pdfDoc, cert, font, logoImage, sealImage);
          break;
        case 'reflection':
          await generateReflectionCertificate(pdfDoc, cert, font, logoImage, sealImage);
          break;
      }

      const pdfBytes = await pdfDoc.save();

      // certificates 폴더에 저장
      fs.writeFileSync(path.join(outputDir, cert.fileName), pdfBytes);
      // docs 폴더에도 저장
      fs.writeFileSync(path.join(docsDir, cert.fileName), pdfBytes);

      console.log(`  ✓ 완료: ${cert.fileName}`);
    } catch (error) {
      console.error(`  ✗ 실패: ${cert.fileName}`, error.message);
    }
  }

  console.log('\n모든 증명서 생성 완료!');
  console.log(`출력 경로: ${outputDir}`);
  console.log(`복사 경로: ${docsDir}`);
}

main().catch(console.error);
