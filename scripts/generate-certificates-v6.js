// 증명서 PDF 생성 v6 - 이름/날짜 위치 고정, 날짜 형식 단순화
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_BOTTOM = 120;

// 고정된 이름/날짜 위치 (PDF 좌표계 - 좌하단 기준)
const NAME_Y = 580;  // 상단에서 약 262pt
const DATE_Y = 170;  // 하단에서 약 170pt
const NAME_X = 155;  // 라벨 뒤
const DATE_X = 155;  // 라벨 뒤

// 테마 색상
const THEMES = {
  education: {
    primary: rgb(0.18, 0.30, 0.45),
    secondary: rgb(0.4, 0.5, 0.6),
    border: rgb(0.25, 0.40, 0.55),
    accent: rgb(0.85, 0.75, 0.55),
    bg: rgb(0.96, 0.97, 0.98),
  },
  opinion: {
    primary: rgb(0.2, 0.35, 0.25),
    secondary: rgb(0.35, 0.5, 0.4),
    border: rgb(0.25, 0.45, 0.3),
    accent: rgb(0.6, 0.75, 0.55),
    bg: rgb(0.96, 0.98, 0.96),
  },
  petition: {
    primary: rgb(0.35, 0.25, 0.2),
    secondary: rgb(0.5, 0.4, 0.35),
    border: rgb(0.45, 0.35, 0.25),
    accent: rgb(0.75, 0.6, 0.5),
    bg: rgb(0.98, 0.97, 0.96),
  },
  reflection: {
    primary: rgb(0.3, 0.25, 0.4),
    secondary: rgb(0.45, 0.4, 0.55),
    border: rgb(0.4, 0.35, 0.5),
    accent: rgb(0.7, 0.6, 0.8),
    bg: rgb(0.97, 0.96, 0.98),
  },
  report: {
    primary: rgb(0.25, 0.3, 0.35),
    secondary: rgb(0.4, 0.45, 0.5),
    border: rgb(0.35, 0.4, 0.45),
    accent: rgb(0.6, 0.7, 0.75),
    bg: rgb(0.96, 0.97, 0.98),
  },
  assessment: {
    primary: rgb(0.22, 0.28, 0.38),
    secondary: rgb(0.38, 0.45, 0.55),
    border: rgb(0.3, 0.38, 0.48),
    accent: rgb(0.7, 0.65, 0.55),
    bg: rgb(0.96, 0.97, 0.98),
  },
};

// 교육 내용 상세
const EDUCATION_DETAILS = {
  'drunk-driving': {
    title: '음주운전 재범방지교육',
    intro: '위 사람은 본 센터에서 실시한 음주운전 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      { title: '1. 음주운전의 위험성 인식', contents: ['• 음주가 운전 능력에 미치는 영향 (반응속도, 판단력, 시야)', '• 음주운전 사고 사례 분석 및 피해자 증언', '• 혈중알코올농도와 사고 위험도의 상관관계'] },
      { title: '2. 법적 책임과 사회적 영향', contents: ['• 음주운전 관련 법규 및 처벌 기준', '• 전과 기록이 취업, 신용, 사회생활에 미치는 영향', '• 가족과 주변인에게 미치는 심리적 영향'] },
      { title: '3. 음주 행동 분석 및 자기 점검', contents: ['• 개인별 음주 패턴 및 유발 요인 분석', '• 음주 욕구 발생 시 대처 전략', '• 건강한 스트레스 해소 방법'] },
      { title: '4. 재발 방지 실천 계획', contents: ['• 대리운전, 대중교통 등 대안 교통수단 활용법', '• 음주 상황 회피 및 거절 기술', '• 장기적인 변화 유지 계획 수립'] },
    ],
  },
  'violence': {
    title: '폭력범죄 재범방지교육',
    intro: '위 사람은 본 센터에서 실시한 폭력범죄 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      { title: '1. 분노의 이해와 관리', contents: ['• 분노 감정의 생리적, 심리적 메커니즘', '• 개인별 분노 유발 상황 파악', '• 분노 조절 기법 (호흡법, 타임아웃 등)'] },
      { title: '2. 비폭력적 갈등 해결', contents: ['• 효과적인 의사소통 기술', '• 갈등 상황에서의 협상 및 타협 방법', '• 역할극을 통한 실습'] },
      { title: '3. 피해자 공감 교육', contents: ['• 폭력이 피해자에게 미치는 신체적, 정신적 영향', '• 피해자 입장에서 생각해보기', '• 책임 인식 및 진정한 사과의 의미'] },
      { title: '4. 건강한 관계 형성', contents: ['• 가정, 직장, 사회에서의 건강한 관계 유지', '• 스트레스 관리 및 자기 돌봄', '• 지지 체계 구축 및 활용'] },
    ],
  },
  'property': {
    title: '재산범죄 재범방지교육',
    intro: '위 사람은 본 센터에서 실시한 재산범죄 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      { title: '1. 재산범죄의 본질 이해', contents: ['• 절도, 사기, 횡령 등 재산범죄의 유형과 특성', '• 범죄 행위의 심리적 동기 분석', '• 합리화와 인지 왜곡 인식'] },
      { title: '2. 피해자 영향 인식', contents: ['• 재산범죄가 피해자에게 미치는 경제적, 심리적 영향', '• 피해자 입장에서 생각해보기', '• 배상 및 회복적 정의'] },
      { title: '3. 경제 윤리와 가치관', contents: ['• 건전한 경제 관념과 소비 습관', '• 정직한 삶의 가치', '• 단기적 이익 vs 장기적 결과'] },
      { title: '4. 재발 방지 전략', contents: ['• 유혹 상황 인식 및 회피 전략', '• 건전한 수입원 확보 방안', '• 지속적인 자기 점검 계획'] },
    ],
  },
  'sexual': {
    title: '성범죄 재범방지교육',
    intro: '위 사람은 본 센터에서 실시한 성범죄 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      { title: '1. 성인지 감수성 향상', contents: ['• 성적 동의의 개념과 중요성', '• 권력 관계와 성적 자기결정권', '• 성별 고정관념 인식과 극복'] },
      { title: '2. 피해자 영향 이해', contents: ['• 성범죄가 피해자에게 미치는 심리적 외상', '• 피해자의 일상, 관계, 삶에 미치는 장기적 영향', '• 공감 능력 향상 훈련'] },
      { title: '3. 인지 왜곡 교정', contents: ['• 성범죄 관련 인지 왜곡 패턴 인식', '• 건강한 성적 태도와 관계', '• 자기 합리화 극복'] },
      { title: '4. 재발 방지 계획', contents: ['• 위험 상황 인식 및 회피 전략', '• 충동 조절 기법', '• 장기적 재발 방지 계획 및 지지체계 구축'] },
    ],
  },
  'gambling': {
    title: '도박중독 재범방지교육',
    intro: '위 사람은 본 센터에서 실시한 도박중독 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      { title: '1. 도박중독의 이해', contents: ['• 도박중독의 정의와 진행 단계', '• 도박이 뇌에 미치는 영향', '• 중독의 심리적, 사회적 요인'] },
      { title: '2. 도박의 영향 인식', contents: ['• 재정적 파탄과 법적 문제', '• 가족관계 및 사회적 관계 손상', '• 정신건강 문제와의 연관성'] },
      { title: '3. 회복을 위한 전략', contents: ['• 도박 욕구 인식 및 대처 기술', '• 재정 관리 및 채무 해결', '• 건전한 여가 활동 개발'] },
      { title: '4. 지속적 회복 계획', contents: ['• 자조 모임 및 지지 그룹 활용', '• 재발 경고 신호 인식', '• 장기적 회복 계획 수립'] },
    ],
  },
  'drugs': {
    title: '마약범죄 재범방지교육',
    intro: '위 사람은 본 센터에서 실시한 마약범죄 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      { title: '1. 약물의 이해', contents: ['• 마약류의 종류와 특성', '• 약물이 뇌와 신체에 미치는 영향', '• 약물 의존의 메커니즘'] },
      { title: '2. 약물 사용의 영향', contents: ['• 건강상 위험과 부작용', '• 법적 처벌과 사회적 결과', '• 가족 및 대인관계에 미치는 영향'] },
      { title: '3. 회복 과정', contents: ['• 금단 증상 이해 및 대처', '• 갈망 관리 기술', '• 스트레스 및 감정 관리'] },
      { title: '4. 재발 방지', contents: ['• 고위험 상황 인식 및 회피', '• 건강한 생활습관 구축', '• 장기적 회복 계획 및 지지체계 구축'] },
    ],
  },
  'digital': {
    title: '디지털범죄 재범방지교육',
    intro: '위 사람은 본 센터에서 실시한 디지털범죄 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      { title: '1. 디지털 범죄의 이해', contents: ['• 사이버 범죄의 유형과 특성', '• 디지털 증거와 추적 가능성', '• 관련 법규 및 처벌'] },
      { title: '2. 피해자 영향 인식', contents: ['• 개인정보 유출 피해의 심각성', '• 온라인 범죄가 피해자에게 미치는 영향', '• 디지털 피해의 확산성과 영속성'] },
      { title: '3. 디지털 윤리', contents: ['• 온라인 공간에서의 책임 있는 행동', '• 개인정보 보호의 중요성', '• 건전한 디지털 시민의식'] },
      { title: '4. 재발 방지', contents: ['• 유혹 상황 인식 및 자기 통제', '• 건전한 디지털 활용 습관', '• 기술의 긍정적 활용 방안'] },
    ],
  },
  'law-compliance': {
    title: '준법의식교육',
    intro: '위 사람은 본 센터에서 실시한 준법의식교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      { title: '1. 법의 이해와 존중', contents: ['• 법의 기능과 필요성', '• 시민으로서의 권리와 의무', '• 법 준수가 사회에 미치는 영향'] },
      { title: '2. 준법정신 함양', contents: ['• 자기 행동에 대한 책임 인식', '• 규범 준수의 내면화', '• 윤리적 의사결정'] },
      { title: '3. 사회적 책임', contents: ['• 공동체 구성원으로서의 역할', '• 타인 존중과 배려', '• 사회 기여 의식'] },
      { title: '4. 건강한 시민 생활', contents: ['• 일상에서의 준법 실천', '• 갈등 상황에서의 합법적 해결', '• 지속적인 자기 발전 계획'] },
    ],
  },
  'cbt': {
    title: '인지행동개선훈련',
    intro: '위 사람은 본 센터에서 실시한 인지행동개선훈련 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      { title: '1. 인지행동의 이해', contents: ['• 생각, 감정, 행동의 상호관계', '• 인지 왜곡 패턴 인식', '• 자동적 사고의 이해'] },
      { title: '2. 인지 재구조화', contents: ['• 부정적 사고 패턴 파악', '• 합리적 사고로의 전환', '• 균형 잡힌 관점 형성'] },
      { title: '3. 행동 변화 기술', contents: ['• 문제 해결 기술 훈련', '• 의사소통 및 자기주장 훈련', '• 스트레스 관리 기법'] },
      { title: '4. 유지 및 발전', contents: ['• 변화 유지를 위한 전략', '• 재발 방지 계획', '• 지속적 자기 모니터링'] },
    ],
  },
  'detailed-course': {
    title: '재범방지교육 상세 교육과정',
    intro: '위 사람은 본 센터에서 실시한 재범방지교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.',
    modules: [
      { title: '1. 자기조절 역량', contents: ['• 감정 인식 및 조절 훈련', '• 충동 통제 기법 습득', '• 스트레스 관리 및 해소 방법'] },
      { title: '2. 대인관계 역량', contents: ['• 효과적인 의사소통 기술', '• 갈등 해결 및 협상 능력', '• 공감 능력 향상 훈련'] },
      { title: '3. 문제해결 역량', contents: ['• 합리적 의사결정 과정', '• 행동 결과 예측 능력', '• 대안 탐색 및 선택'] },
      { title: '4. 사회적응 역량', contents: ['• 법과 규범의 이해', '• 사회적 책임 인식', '• 건전한 가치관 형성'] },
    ],
  },
};

function wrapText(text, maxLen) {
  const words = text.split('');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + w).length <= maxLen) cur += w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function centerText(page, text, y, font, size, color) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (PAGE_WIDTH - w) / 2, y, size, font, color });
}

// 복합 교육내용 증명서 생성 (인지행동개선훈련 + 준법의식교육)
async function generateCombinedEducationCertificate(pdfDoc, font, logoImage, sealImage) {
  const theme = THEMES.education;
  const eduTypes = ['cbt', 'law-compliance'];

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 70;

  // 로고
  if (logoImage) {
    const logoW = 80, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  centerText(page, '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 45;

  centerText(page, '교육내용 증명서', y, font, 26, theme.primary);
  y -= 25;

  centerText(page, '인지행동개선훈련 · 준법의식교육', y, font, 13, theme.secondary);
  y -= 40;

  // 구분선
  page.drawLine({ start: { x: 55, y }, end: { x: PAGE_WIDTH - 55, y }, thickness: 1.5, color: theme.border });
  y -= 30;

  // 성명 라벨과 밑줄 (고정 위치)
  const nameLineY = NAME_Y;
  page.drawText('성        명 :', { x: 65, y: nameLineY, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: NAME_X, y: nameLineY - 3 }, end: { x: 370, y: nameLineY - 3 }, thickness: 0.5, color: theme.secondary });

  y = nameLineY - 32;

  // 인트로
  const introText = '위 사람은 본 센터에서 실시한 인지행동개선훈련 및 준법의식교육 프로그램을 성실히 이수하였으며, 아래와 같이 교육 내용을 증명합니다.';
  const introLines = wrapText(introText, 60);
  for (const il of introLines) {
    page.drawText(il, { x: 65, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 18;
  }
  y -= 10;

  // 각 교육 타입별로 내용 출력
  for (let ei = 0; ei < eduTypes.length; ei++) {
    const eduType = eduTypes[ei];
    const eduDetails = EDUCATION_DETAILS[eduType];
    if (!eduDetails) continue;

    // 교육 제목 헤더
    if (y < MARGIN_BOTTOM + 150) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
      y = PAGE_HEIGHT - 60;
    }

    page.drawRectangle({ x: 50, y: y - 8, width: PAGE_WIDTH - 100, height: 26, color: theme.primary });
    centerText(page, `【 ${eduDetails.title} 】`, y - 2, font, 12, rgb(1, 1, 1));
    y -= 45;

    // 모듈들
    for (let mi = 0; mi < eduDetails.modules.length; mi++) {
      const mod = eduDetails.modules[mi];
      const modHeight = 25 + mod.contents.length * 15 + 15;

      if (y < MARGIN_BOTTOM + modHeight) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
        y = PAGE_HEIGHT - 60;
      }

      page.drawRectangle({ x: 52, y: y - 5, width: PAGE_WIDTH - 104, height: 22, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
      page.drawText(mod.title, { x: 62, y, size: 11, font, color: theme.primary });
      y -= 28;

      for (const content of mod.contents) {
        if (y < MARGIN_BOTTOM) {
          page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
          y = PAGE_HEIGHT - 60;
        }
        page.drawText(content, { x: 68, y, size: 9, font, color: rgb(0.18, 0.18, 0.18) });
        y -= 15;
      }
      y -= 12;
    }

    // 교육 사이에 간격 추가
    if (ei < eduTypes.length - 1) {
      y -= 15;
    }
  }

  // 하단 서명 영역
  if (y < MARGIN_BOTTOM + 100) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
    y = PAGE_HEIGHT - 100;
  }

  // 발급일 (고정 위치, 단순 밑줄 형식)
  page.drawText('발 급 일 :', { x: 65, y: DATE_Y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: DATE_X, y: DATE_Y - 3 }, end: { x: 370, y: DATE_Y - 3 }, thickness: 0.5, color: theme.secondary });

  const signY = DATE_Y - 50;
  centerText(page, '재범방지교육통합센터', signY, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: signY - 30, width: 65, height: 65 });
}

// 교육내용 증명서 생성
async function generateEducationCertificate(pdfDoc, font, logoImage, sealImage, educationType) {
  const theme = THEMES.education;
  const eduDetails = EDUCATION_DETAILS[educationType];
  if (!eduDetails) return;

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 70;

  // 로고
  if (logoImage) {
    const logoW = 80, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  centerText(page, '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 45;

  centerText(page, '교육내용 증명서', y, font, 26, theme.primary);
  y -= 25;

  centerText(page, eduDetails.title, y, font, 13, theme.secondary);
  y -= 40;

  // 구분선
  page.drawLine({ start: { x: 55, y }, end: { x: PAGE_WIDTH - 55, y }, thickness: 1.5, color: theme.border });
  y -= 30;

  // 성명 라벨과 밑줄 (고정 위치)
  const nameLineY = NAME_Y;
  page.drawText('성        명 :', { x: 65, y: nameLineY, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: NAME_X, y: nameLineY - 3 }, end: { x: 370, y: nameLineY - 3 }, thickness: 0.5, color: theme.secondary });

  y = nameLineY - 32;

  // 인트로
  const introLines = wrapText(eduDetails.intro, 60);
  for (const il of introLines) {
    page.drawText(il, { x: 65, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 18;
  }
  y -= 15;

  // 교육 내용 제목
  page.drawRectangle({ x: 50, y: y - 8, width: PAGE_WIDTH - 100, height: 26, color: theme.primary });
  centerText(page, '【 교 육 내 용 】', y - 2, font, 12, rgb(1, 1, 1));
  y -= 45;

  // 모듈들
  for (let mi = 0; mi < eduDetails.modules.length; mi++) {
    const mod = eduDetails.modules[mi];
    const modHeight = 25 + mod.contents.length * 15 + 15;

    if (y < MARGIN_BOTTOM + modHeight) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
      y = PAGE_HEIGHT - 60;
    }

    page.drawRectangle({ x: 52, y: y - 5, width: PAGE_WIDTH - 104, height: 22, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(mod.title, { x: 62, y, size: 11, font, color: theme.primary });
    y -= 28;

    for (const content of mod.contents) {
      if (y < MARGIN_BOTTOM) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
        y = PAGE_HEIGHT - 60;
      }
      page.drawText(content, { x: 68, y, size: 9, font, color: rgb(0.18, 0.18, 0.18) });
      y -= 15;
    }
    y -= 12;
  }

  // 하단 서명 영역
  if (y < MARGIN_BOTTOM + 100) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
    y = PAGE_HEIGHT - 100;
  }

  // 발급일 (고정 위치, 단순 밑줄 형식)
  page.drawText('발 급 일 :', { x: 65, y: DATE_Y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: DATE_X, y: DATE_Y - 3 }, end: { x: 370, y: DATE_Y - 3 }, thickness: 0.5, color: theme.secondary });

  const signY = DATE_Y - 50;
  centerText(page, '재범방지교육통합센터', signY, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: signY - 30, width: 65, height: 65 });
}

// 소견서 생성
async function generateOpinionCertificate(pdfDoc, font, logoImage, sealImage) {
  const theme = THEMES.opinion;

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2.5 });
  page.drawRectangle({ x: 32, y: 32, width: PAGE_WIDTH - 64, height: PAGE_HEIGHT - 64, borderColor: theme.accent, borderWidth: 0.5 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 95, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 55;

  centerText(page, '소  견  서', y, font, 32, theme.primary);
  y -= 50;

  page.drawLine({ start: { x: 60, y }, end: { x: PAGE_WIDTH - 60, y }, thickness: 1, color: theme.border });
  y -= 35;

  // 성명 (고정 위치)
  page.drawText('성        명 :', { x: 70, y: NAME_Y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: NAME_X, y: NAME_Y - 3 }, end: { x: 380, y: NAME_Y - 3 }, thickness: 0.5, color: theme.secondary });

  y = NAME_Y - 45;

  const opinionContent = [
    '위 사람은 본 센터에서 실시한 재범방지교육 프로그램에 성실히 참여하였으며,',
    '아래와 같이 소견을 제출합니다.',
    '',
    '【 교육 참여 태도 】',
    '교육 과정 전반에 걸쳐 적극적인 태도로 참여하였으며, 교육 내용을 성실히 이해하고',
    '습득하려는 노력을 보였습니다. 질의응답 및 토론 과정에서도 진지한 자세를 유지했습니다.',
    '',
    '【 변화 및 성장 】',
    '교육 초기와 비교하여 자신의 행위에 대한 책임 인식이 크게 향상되었습니다.',
    '피해자의 입장에서 생각하는 공감 능력이 발달하였으며, 재범 방지에 대한',
    '구체적인 실천 의지를 보여주었습니다.',
    '',
    '【 종합 평가 】',
    '본 교육 프로그램을 통해 건전한 사회 구성원으로 복귀하기 위한 기본적인',
    '소양을 갖추었다고 판단되며, 향후 사회 적응에 긍정적인 영향을 미칠 것으로',
    '기대됩니다.',
  ];

  for (const line of opinionContent) {
    page.drawText(line, { x: 60, y, size: 10.5, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 20;
  }

  // 발급일 (고정 위치)
  page.drawText('발 급 일 :', { x: 70, y: DATE_Y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: DATE_X, y: DATE_Y - 3 }, end: { x: 370, y: DATE_Y - 3 }, thickness: 0.5, color: theme.secondary });

  const signY = DATE_Y - 50;
  centerText(page, '재범방지교육통합센터', signY, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: signY - 30, width: 65, height: 65 });
}

// 탄원서 생성
async function generatePetitionCertificate(pdfDoc, font, logoImage, sealImage, isCounselor = false) {
  const theme = THEMES.petition;

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 65;

  if (logoImage && !isCounselor) {
    const logoW = 75, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  centerText(page, isCounselor ? '심리상담사' : '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 50;

  centerText(page, '탄  원  서', y, font, 30, theme.primary);
  y -= 45;

  page.drawLine({ start: { x: 55, y }, end: { x: PAGE_WIDTH - 55, y }, thickness: 1, color: theme.border });
  y -= 30;

  // 피고인 성명 (고정 위치)
  page.drawText('피고인 성명 :', { x: 70, y: NAME_Y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: NAME_X + 15, y: NAME_Y - 3 }, end: { x: 390, y: NAME_Y - 3 }, thickness: 0.5, color: theme.secondary });

  y = NAME_Y - 40;

  const petitionContent = isCounselor ? [
    '존경하는 재판장님께',
    '',
    '본 상담사는 위 피고인과의 심층 심리상담을 통해 그의 진심 어린 반성과 변화를',
    '직접 확인하였기에, 선처를 탄원하고자 이 글을 올립니다.',
    '',
    '【 상담 과정에서 확인된 변화 】',
    '• 자신의 행위가 피해자에게 끼친 영향에 대한 깊은 이해',
    '• 진심 어린 반성과 사죄의 마음',
    '• 재발 방지를 위한 구체적인 계획 수립',
    '• 긍정적인 삶의 변화에 대한 강한 의지',
    '',
    '【 심리적 상태 평가 】',
    '피고인은 현재 심리적으로 안정된 상태이며, 건강한 사회인으로 복귀하기 위한',
    '심리적 준비가 충분히 되어 있다고 판단됩니다.',
    '',
    '이에 전문 심리상담사로서 피고인의 진정성 있는 변화를 확인하였으며,',
    '사회 복귀의 기회를 위한 선처를 간곡히 탄원드립니다.',
  ] : [
    '존경하는 재판장님께',
    '',
    '본 재범방지교육통합센터는 위 피고인이 본 센터의 재범방지교육 프로그램에',
    '참여하여 보여준 진정한 반성과 변화의 모습을 확인하고, 선처를 탄원드립니다.',
    '',
    '【 교육 참여 및 태도 】',
    '• 교육 프로그램에 성실히 참여하며 적극적인 자세를 보임',
    '• 자신의 잘못에 대한 진심 어린 반성의 태도',
    '• 교육 내용을 깊이 이해하고 실천하려는 의지 표명',
    '',
    '【 변화 및 개선 사항 】',
    '• 피해자에 대한 공감 능력 향상',
    '• 재범 방지를 위한 구체적인 실천 계획 수립',
    '• 건전한 사회 구성원으로의 복귀 의지',
    '',
    '본 센터의 전문 상담사 및 교육진의 종합 평가 결과, 피고인은 재범 가능성이',
    '낮으며 사회 복귀 준비가 양호한 것으로 판단됩니다.',
    '',
    '이에 피고인이 사회에 복귀하여 새로운 삶을 시작할 수 있도록',
    '재판장님의 현명하신 판단과 선처를 간곡히 탄원합니다.',
  ];

  for (const line of petitionContent) {
    page.drawText(line, { x: 55, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 19;
  }

  // 발급일
  page.drawText('발 급 일 :', { x: 70, y: DATE_Y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: DATE_X, y: DATE_Y - 3 }, end: { x: 370, y: DATE_Y - 3 }, thickness: 0.5, color: theme.secondary });

  const signY = DATE_Y - 50;
  if (isCounselor) {
    centerText(page, '심리상담사', signY, font, 14, theme.primary);
    page.drawText('성명:', { x: PAGE_WIDTH / 2 - 60, y: signY - 28, size: 12, font, color: theme.secondary });
    page.drawLine({ start: { x: PAGE_WIDTH / 2 - 20, y: signY - 31 }, end: { x: PAGE_WIDTH / 2 + 100, y: signY - 31 }, thickness: 0.5, color: theme.secondary });
    page.drawText('(인)', { x: PAGE_WIDTH / 2 + 105, y: signY - 28, size: 11, font, color: theme.secondary });
  } else {
    centerText(page, '재범방지교육통합센터', signY, font, 15, theme.primary);
    if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: signY - 30, width: 65, height: 65 });
  }
}

// 소감문 생성
async function generateReflectionCertificate(pdfDoc, font, logoImage, sealImage, type) {
  const theme = THEMES.reflection;
  const isCounseling = type === 'counseling';

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 30, y: 30, width: PAGE_WIDTH - 60, height: PAGE_HEIGHT - 60, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 65;

  if (logoImage) {
    const logoW = 70, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  centerText(page, '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 50;

  centerText(page, isCounseling ? '심리상담 소감문' : '이수 소감문', y, font, 28, theme.primary);
  y -= 40;

  page.drawLine({ start: { x: 55, y }, end: { x: PAGE_WIDTH - 55, y }, thickness: 1, color: theme.border });
  y -= 30;

  // 성명 (고정 위치)
  page.drawText('성        명 :', { x: 70, y: NAME_Y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: NAME_X, y: NAME_Y - 3 }, end: { x: 380, y: NAME_Y - 3 }, thickness: 0.5, color: theme.secondary });

  y = NAME_Y - 35;

  const introText = isCounseling
    ? '위 사람은 본 센터에서 실시한 심리상담 프로그램에 참여하고 아래와 같이 소감문을 제출하였음을 증명합니다.'
    : '위 사람은 본 센터에서 실시한 재범방지교육 프로그램을 이수하고 아래와 같이 소감문을 제출하였음을 증명합니다.';

  const introLines = wrapText(introText, 58);
  for (const line of introLines) {
    page.drawText(line, { x: 60, y, size: 10, font, color: rgb(0.12, 0.12, 0.12) });
    y -= 18;
  }
  y -= 15;

  const sections = isCounseling ? [
    { title: '1. 상담을 받게 된 계기', content: '이번 사건을 계기로 스스로를 되돌아보는 시간이 필요하다고 느꼈습니다. 단순히 법적 처벌을 받는 것을 넘어, 왜 이런 행동을 하게 되었는지, 어떻게 하면 다시는 같은 실수를 반복하지 않을 수 있을지 전문가의 도움을 받고 싶었습니다.' },
    { title: '2. 상담 과정에서 느낀 점', content: '처음에는 막연한 두려움이 있었지만, 상담사 선생님의 따뜻한 격려와 전문적인 조언 덕분에 마음을 열고 솔직하게 이야기할 수 있었습니다. 제 내면의 감정과 생각을 정리하는 데 큰 도움이 되었습니다.' },
    { title: '3. 배우고 깨달은 점', content: '저의 행동이 피해자분께 얼마나 큰 상처를 주었는지 깊이 이해하게 되었습니다. 또한 제가 가진 부정적인 사고 패턴과 감정 조절의 문제점을 인식하고, 이를 개선하기 위한 구체적인 방법들을 배웠습니다.' },
    { title: '4. 앞으로의 다짐', content: '상담을 통해 배운 것들을 실생활에서 꾸준히 실천하겠습니다. 어려운 상황에서도 건강한 방식으로 대처하고, 다시는 같은 실수를 반복하지 않도록 항상 경계하며 살아가겠습니다.' },
  ] : [
    { title: '1. 교육을 받게 된 계기와 처음 마음', content: '이번 사건으로 인해 교육을 받게 되었습니다. 처음에는 형식적인 절차라고 생각했지만, 교육이 진행될수록 제 자신을 돌아보는 소중한 시간이 되었습니다.' },
    { title: '2. 가장 인상 깊었던 내용', content: '피해자 공감 교육이 가장 인상 깊었습니다. 피해자분들의 이야기를 듣고 그분들이 겪는 고통을 조금이나마 이해하게 되었을 때, 제 잘못의 무게가 얼마나 무거운지 실감했습니다.' },
    { title: '3. 나의 변화', content: '교육 전과 후의 저는 많이 달라졌습니다. 이전에는 제 행동의 결과를 가볍게 생각했지만, 이제는 모든 행동에 책임이 따른다는 것을 깊이 인식하게 되었습니다.' },
    { title: '4. 앞으로의 다짐', content: '다시는 같은 실수를 반복하지 않겠습니다. 교육에서 배운 내용들을 실생활에서 실천하고, 건전한 사회 구성원으로서 책임감 있게 살아가겠습니다.' },
  ];

  for (const section of sections) {
    if (y < MARGIN_BOTTOM + 80) {
      const newPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      newPage.drawRectangle({ x: 30, y: 30, width: PAGE_WIDTH - 60, height: PAGE_HEIGHT - 60, borderColor: theme.border, borderWidth: 2 });
      y = PAGE_HEIGHT - 60;
    }

    page.drawRectangle({ x: 52, y: y - 2, width: PAGE_WIDTH - 104, height: 18, color: theme.bg });
    page.drawText(section.title, { x: 58, y, size: 10, font, color: theme.primary });
    y -= 22;

    const contentLines = wrapText(section.content, 62);
    for (const line of contentLines) {
      page.drawText(line, { x: 58, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 15;
    }
    y -= 12;
  }

  // 발급일
  page.drawText('발 급 일 :', { x: 70, y: DATE_Y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: DATE_X, y: DATE_Y - 3 }, end: { x: 370, y: DATE_Y - 3 }, thickness: 0.5, color: theme.secondary });

  const signY = DATE_Y - 50;
  centerText(page, '재범방지교육통합센터', signY, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: signY - 30, width: 65, height: 65 });
}

// 평가 증명서 생성
async function generateAssessmentCertificate(pdfDoc, font, logoImage, sealImage) {
  const theme = THEMES.assessment;

  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page1.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 85, logoH = (logoImage.height / logoImage.width) * logoW;
    page1.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page1, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 55;

  centerText(page1, '재범 위험 종합 관리 평가 증명서', y, font, 22, theme.primary);
  y -= 45;

  page1.drawLine({ start: { x: 55, y }, end: { x: PAGE_WIDTH - 55, y }, thickness: 1.5, color: theme.border });
  y -= 35;

  // 성명 (고정 위치)
  page1.drawText('성        명 :', { x: 70, y: NAME_Y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page1.drawLine({ start: { x: NAME_X, y: NAME_Y - 3 }, end: { x: 380, y: NAME_Y - 3 }, thickness: 0.5, color: theme.secondary });

  y = NAME_Y - 40;

  const introLines = [
    '위 사람은 본 센터에서 실시한 재범 위험 종합 관리 평가 프로그램에',
    '참여하였으며, 아래와 같이 평가 결과를 증명합니다.',
  ];
  for (const line of introLines) {
    page1.drawText(line, { x: 60, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 20;
  }
  y -= 20;

  const assessmentItems = [
    { category: '자기 인식', items: ['자신의 행위에 대한 책임 인식 정도', '문제 행동의 원인 이해', '변화 필요성 인식'] },
    { category: '피해자 공감', items: ['피해자 입장 이해', '공감 능력', '진심 어린 반성 태도'] },
    { category: '재발 방지 계획', items: ['구체적 실천 계획 수립', '위험 상황 인식 및 대처 능력', '지지 체계 구축'] },
    { category: '사회 적응력', items: ['대인관계 기술', '스트레스 관리 능력', '긍정적 생활 태도'] },
  ];

  for (const section of assessmentItems) {
    page1.drawRectangle({ x: 50, y: y - 5, width: PAGE_WIDTH - 100, height: 22, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page1.drawText(`【 ${section.category} 】`, { x: 58, y, size: 11, font, color: theme.primary });
    y -= 28;

    for (const item of section.items) {
      page1.drawText(`• ${item}`, { x: 65, y, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
      y -= 16;
    }
    y -= 10;
  }

  // 2페이지: 종합 평가
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page2.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });

  y = PAGE_HEIGHT - 80;
  centerText(page2, '【 종 합 평 가 】', y, font, 16, theme.primary);
  y -= 50;

  const evalContent = [
    '위 대상자는 본 센터의 재범 위험 종합 관리 평가 프로그램에 성실히 참여하였으며,',
    '각 평가 영역에서 긍정적인 변화를 보였습니다.',
    '',
    '특히 자신의 행위에 대한 깊은 반성과 피해자에 대한 공감 능력이 크게 향상되었으며,',
    '재발 방지를 위한 구체적인 실천 계획을 수립하였습니다.',
    '',
    '이에 본 센터는 위 대상자의 재범 위험성이 낮으며,',
    '사회 복귀 후 건전한 시민으로서 생활할 준비가 되어 있다고 평가합니다.',
  ];

  for (const line of evalContent) {
    page2.drawText(line, { x: 55, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 22;
  }

  // 발급일
  page2.drawText('발 급 일 :', { x: 70, y: DATE_Y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  page2.drawLine({ start: { x: DATE_X, y: DATE_Y - 3 }, end: { x: 370, y: DATE_Y - 3 }, thickness: 0.5, color: theme.secondary });

  const signY = DATE_Y - 50;
  centerText(page2, '재범방지교육통합센터', signY, font, 15, theme.primary);
  if (sealImage) page2.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: signY - 30, width: 65, height: 65 });
}

// 실천일지 생성
async function generatePracticeDiary(pdfDoc, font, logoImage, sealImage) {
  const theme = THEMES.report;

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 65;

  if (logoImage) {
    const logoW = 70, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 10;
  }

  centerText(page, '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 45;

  centerText(page, '재범 위험 관리 실천일지', y, font, 22, theme.primary);
  y -= 35;

  page.drawLine({ start: { x: 50, y }, end: { x: PAGE_WIDTH - 50, y }, thickness: 1, color: theme.border });
  y -= 25;

  // 성명 (고정 위치)
  page.drawText('성        명 :', { x: 65, y: NAME_Y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: NAME_X, y: NAME_Y - 3 }, end: { x: 360, y: NAME_Y - 3 }, thickness: 0.5, color: theme.secondary });

  y = NAME_Y - 30;

  page.drawText('위 사람은 재범방지교육 과정에서 아래와 같이 실천하였음을 확인합니다.', { x: 55, y, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
  y -= 30;

  const practices = [
    { situation: '스트레스 상황 발생 시', action: '심호흡 및 잠시 자리 피하기로 감정 조절', result: '충동적 반응 억제 성공' },
    { situation: '갈등 상황 직면 시', action: '상대방 입장에서 생각해보고 대화로 해결', result: '원만한 관계 유지' },
    { situation: '부정적 감정 발생 시', action: '일기 작성 및 운동으로 해소', result: '건강한 감정 처리' },
    { situation: '유혹 상황 노출 시', action: '해당 상황 즉시 회피 및 지지자에게 연락', result: '재발 위험 방지' },
  ];

  // 테이블 헤더
  page.drawRectangle({ x: 45, y: y - 5, width: PAGE_WIDTH - 90, height: 22, color: theme.primary });
  page.drawText('상황', { x: 65, y, size: 10, font, color: rgb(1, 1, 1) });
  page.drawText('실천 내용', { x: 200, y, size: 10, font, color: rgb(1, 1, 1) });
  page.drawText('결과', { x: 420, y, size: 10, font, color: rgb(1, 1, 1) });
  y -= 28;

  for (const p of practices) {
    page.drawRectangle({ x: 45, y: y - 12, width: PAGE_WIDTH - 90, height: 35, borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(p.situation, { x: 50, y, size: 8, font, color: rgb(0.15, 0.15, 0.15) });

    const actionLines = wrapText(p.action, 28);
    let actionY = y;
    for (const line of actionLines) {
      page.drawText(line, { x: 175, y: actionY, size: 8, font, color: rgb(0.15, 0.15, 0.15) });
      actionY -= 12;
    }

    page.drawText(p.result, { x: 395, y, size: 8, font, color: rgb(0.15, 0.15, 0.15) });
    y -= 38;
  }

  y -= 20;
  page.drawText('【 종합 소견 】', { x: 55, y, size: 11, font, color: theme.primary });
  y -= 22;

  const summary = '위 대상자는 재범방지교육 프로그램에서 습득한 내용을 일상생활에서 꾸준히 실천하였으며, 위험 상황에서 적절한 대처 능력을 보여주었습니다. 지속적인 자기 관리와 실천 의지가 확인됩니다.';
  const summaryLines = wrapText(summary, 65);
  for (const line of summaryLines) {
    page.drawText(line, { x: 55, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
    y -= 16;
  }

  // 발급일
  page.drawText('발 급 일 :', { x: 65, y: DATE_Y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: DATE_X, y: DATE_Y - 3 }, end: { x: 360, y: DATE_Y - 3 }, thickness: 0.5, color: theme.secondary });

  const signY = DATE_Y - 50;
  centerText(page, '재범방지교육통합센터', signY, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: signY - 30, width: 65, height: 65 });
}

// 변화 기록 보고서 생성
async function generateChangeReport(pdfDoc, font, logoImage, sealImage) {
  const theme = THEMES.report;

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 65;

  if (logoImage) {
    const logoW = 70, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 10;
  }

  centerText(page, '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 45;

  centerText(page, '이수자 변화 기록 보고서', y, font, 22, theme.primary);
  y -= 35;

  page.drawLine({ start: { x: 50, y }, end: { x: PAGE_WIDTH - 50, y }, thickness: 1, color: theme.border });
  y -= 25;

  // 성명 (고정 위치)
  page.drawText('성        명 :', { x: 65, y: NAME_Y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: NAME_X, y: NAME_Y - 3 }, end: { x: 360, y: NAME_Y - 3 }, thickness: 0.5, color: theme.secondary });

  y = NAME_Y - 35;

  const sections = [
    { title: '교육 초기 상태', content: '• 자신의 행위에 대한 책임 인식 부족\n• 피해자 관점에서의 이해 미흡\n• 재발 방지에 대한 구체적 계획 부재' },
    { title: '교육 중 변화 과정', content: '• 자기 성찰을 통한 문제 인식 시작\n• 피해자 공감 교육을 통한 인식 변화\n• 건강한 대처 방법 학습 및 연습' },
    { title: '교육 후 변화 결과', content: '• 자신의 행위에 대한 깊은 반성과 책임 인식\n• 피해자에 대한 진심 어린 공감과 사과의 마음\n• 구체적인 재발 방지 실천 계획 수립' },
  ];

  for (const section of sections) {
    page.drawRectangle({ x: 48, y: y - 3, width: PAGE_WIDTH - 96, height: 20, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(`【 ${section.title} 】`, { x: 55, y, size: 10, font, color: theme.primary });
    y -= 25;

    const lines = section.content.split('\n');
    for (const line of lines) {
      page.drawText(line, { x: 55, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 16;
    }
    y -= 12;
  }

  // 종합 평가
  page.drawText('【 종합 평가 】', { x: 55, y, size: 11, font, color: theme.primary });
  y -= 22;

  const evaluation = '위 대상자는 본 센터의 재범방지교육 프로그램을 성실히 이수하였으며, 교육 과정을 통해 뚜렷한 긍정적 변화를 보였습니다. 향후 건전한 사회 구성원으로서 생활할 것으로 기대됩니다.';
  const evalLines = wrapText(evaluation, 65);
  for (const line of evalLines) {
    page.drawText(line, { x: 55, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
    y -= 16;
  }

  // 발급일
  page.drawText('발 급 일 :', { x: 65, y: DATE_Y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: DATE_X, y: DATE_Y - 3 }, end: { x: 360, y: DATE_Y - 3 }, thickness: 0.5, color: theme.secondary });

  const signY = DATE_Y - 50;
  centerText(page, '재범방지교육통합센터', signY, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: signY - 30, width: 65, height: 65 });
}

// 메인 함수
async function main() {
  console.log('증명서 PDF 생성 v6 - 이름/날짜 위치 고정...\n');

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
    // 공통 증명서
    { name: '재범 위험 종합 관리 평가 증명서', type: 'assessment' },
    { name: '재범방지교육통합센터 소견서', type: 'opinion' },
    { name: '재범방지교육통합센터 탄원서', type: 'petition', isCounselor: false },
    { name: '심리상담사 서명 탄원서', type: 'petition', isCounselor: true },
    { name: '심리상담 소감문', type: 'reflection', reflectionType: 'counseling' },
    { name: '이수 소감문', type: 'reflection', reflectionType: 'completion' },
    { name: '재범 위험 관리 실천일지', type: 'diary' },
    { name: '재범방지교육 이수자 변화 기록 보고서', type: 'report' },
    // 교육내용 증명서
    { name: '재범방지교육통합센터 교육내용 증명서', type: 'combined-education' },
    { name: '재범방지교육 상세 교육과정 증명서', type: 'education', eduType: 'detailed-course' },
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
      case 'diary':
        await generatePracticeDiary(pdfDoc, font, logoImage, sealImage);
        break;
      case 'report':
        await generateChangeReport(pdfDoc, font, logoImage, sealImage);
        break;
      case 'combined-education':
        await generateCombinedEducationCertificate(pdfDoc, font, logoImage, sealImage);
        break;
      case 'education':
        await generateEducationCertificate(pdfDoc, font, logoImage, sealImage, cert.eduType);
        break;
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(path.join(outputDir, `${cert.name}.pdf`), pdfBytes);
    fs.writeFileSync(path.join(docsDir, `${cert.name}.pdf`), pdfBytes);
    console.log(`  ✓ 완료: ${cert.name}.pdf`);
  }

  console.log('\n모든 증명서 생성 완료!');
  console.log(`\n이름 위치: x=${NAME_X}, y=${NAME_Y} (PDF 좌표)`);
  console.log(`날짜 위치: x=${DATE_X}, y=${DATE_Y} (PDF 좌표)`);
  console.log(`\ncertificateTemplates.ts 업데이트 필요:`);
  console.log(`  namePosition: { x: ${NAME_X}, y: ${Math.round(PAGE_HEIGHT - NAME_Y)}, fontSize: 14 }`);
  console.log(`  datePosition: { x: ${DATE_X}, y: ${Math.round(PAGE_HEIGHT - DATE_Y)}, fontSize: 12 }`);
}

main().catch(console.error);
