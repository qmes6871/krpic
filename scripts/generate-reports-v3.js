const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const THEME = {
  primary: rgb(0.15, 0.2, 0.35),
  secondary: rgb(0.3, 0.35, 0.45),
  accent: rgb(0.2, 0.4, 0.6),
  border: rgb(0.25, 0.3, 0.4),
  bg: rgb(0.96, 0.97, 0.98),
  lightBg: rgb(0.98, 0.98, 0.99),
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
    let splitIndex = remaining.lastIndexOf(' ', maxChars);
    if (splitIndex === -1 || splitIndex < maxChars / 2) {
      splitIndex = maxChars;
    }
    result.push(remaining.substring(0, splitIndex));
    remaining = remaining.substring(splitIndex).trim();
  }
  return result;
}

// ========== 재범 위험 관리 실천일지 ==========
async function generatePracticeDiary(fontBytes, logoBytes, sealBytes) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);

  let logoImage, sealImage;
  if (logoBytes) try { logoImage = await pdfDoc.embedPng(logoBytes); } catch(e) {}
  if (sealBytes) try { sealImage = await pdfDoc.embedPng(sealBytes); } catch(e) {}

  // ===== 페이지 1: 표지 및 개요 =====
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // 테두리
  page1.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: THEME.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 100;
    const logoH = (logoImage.height / logoImage.width) * logoW;
    page1.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page1, '재범방지교육통합센터', y, font, 12, THEME.secondary);
  y -= 50;

  centerText(page1, '재범 위험 관리 실천일지', y, font, 28, THEME.primary);
  y -= 25;
  centerText(page1, 'Recidivism Risk Management Practice Journal', y, font, 10, THEME.secondary);
  y -= 40;

  page1.drawLine({ start: { x: 60, y }, end: { x: PAGE_WIDTH - 60, y }, thickness: 1.5, color: THEME.border });
  y -= 40;

  // 수강생 정보
  page1.drawText('성        명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page1.drawLine({ start: { x: 155, y: y - 3 }, end: { x: 350, y: y - 3 }, thickness: 0.5, color: THEME.secondary });
  y -= 35;

  // 안내문
  const intro = [
    '위 사람은 본 센터에서 제공하는 재범 위험 관리 프로그램에 참여하여',
    '아래와 같이 실천일지를 성실히 작성하고 자기 관리를 실천하였음을 증명합니다.',
  ];
  for (const line of intro) {
    page1.drawText(line, { x: 70, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 22;
  }
  y -= 25;

  // 프로그램 개요
  page1.drawRectangle({ x: 50, y: y - 10, width: PAGE_WIDTH - 100, height: 30, color: THEME.primary });
  centerText(page1, '【 프로그램 개요 】', y - 2, font, 13, rgb(1, 1, 1));
  y -= 50;

  const overview = [
    { label: '프로그램명', value: '재범 위험 관리 실천 프로그램' },
    { label: '실천 기간', value: '교육 수료일로부터 4주간' },
    { label: '실천 방법', value: '일일 자기점검, 주간 성찰, 위험상황 대처 기록' },
    { label: '목표', value: '재범 위험 요인 인식 및 자기 관리 능력 향상' },
  ];

  for (const item of overview) {
    page1.drawRectangle({ x: 55, y: y - 5, width: 100, height: 22, color: THEME.bg, borderColor: THEME.border, borderWidth: 0.5 });
    page1.drawText(item.label, { x: 65, y: y, size: 10, font, color: THEME.primary });
    page1.drawText(item.value, { x: 165, y: y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
    y -= 28;
  }
  y -= 25;

  // 실천 항목 안내
  page1.drawRectangle({ x: 50, y: y - 10, width: PAGE_WIDTH - 100, height: 30, color: THEME.accent });
  centerText(page1, '【 실천 항목 】', y - 2, font, 13, rgb(1, 1, 1));
  y -= 55;

  const practiceItems = [
    { title: '1. 일일 자기 점검', desc: '매일 아침/저녁 자신의 감정, 생각, 행동을 점검하고 위험 신호를 조기에 인식합니다.' },
    { title: '2. 위험 상황 기록', desc: '재범 유발 가능성이 있는 상황(스트레스, 갈등, 유혹 등)을 인식하고 기록합니다.' },
    { title: '3. 대처 행동 실천', desc: '교육에서 배운 대처 전략을 실제 상황에 적용하고 그 효과를 평가합니다.' },
    { title: '4. 주간 성찰 보고', desc: '한 주간의 실천 내용을 돌아보고, 잘한 점과 개선할 점을 정리합니다.' },
  ];

  for (const item of practiceItems) {
    page1.drawRectangle({ x: 55, y: y - 30, width: PAGE_WIDTH - 110, height: 48, color: THEME.lightBg, borderColor: THEME.border, borderWidth: 0.5 });
    page1.drawText(item.title, { x: 65, y: y - 5, size: 11, font, color: THEME.primary });
    const descLines = wrapText(item.desc, 55);
    let descY = y - 22;
    for (const dl of descLines) {
      page1.drawText(dl, { x: 70, y: descY, size: 9, font, color: rgb(0.25, 0.25, 0.25) });
      descY -= 14;
    }
    y -= 55;
  }

  // ===== 페이지 2: 1주차 실천 기록 =====
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page2.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: THEME.border, borderWidth: 1.5 });

  y = PAGE_HEIGHT - 60;
  centerText(page2, '【 1주차 실천 기록 】', y, font, 16, THEME.primary);
  y -= 40;

  const week1Records = [
    {
      day: '1일차',
      emotion: '불안함, 걱정됨',
      situation: '가족과의 대화 중 과거 사건 언급',
      thought: '또 잘못을 저지르면 어쩌나 하는 두려움',
      action: '심호흡 5회, 교육에서 배운 긍정적 자기 대화 실천',
      result: '감정이 진정되고 대화를 이어갈 수 있었음'
    },
    {
      day: '2일차',
      emotion: '답답함, 짜증',
      situation: '직장에서 상사의 지적',
      thought: '화가 나지만 참아야 한다는 생각',
      action: '자리를 피해 잠시 휴식, 상황을 객관적으로 재해석',
      result: '충동적인 반응을 피하고 차분하게 대응함'
    },
    {
      day: '3일차',
      emotion: '평온함',
      situation: '특별한 위험 상황 없음',
      thought: '하루하루 잘 해나가고 있다는 생각',
      action: '운동 30분, 가족과 저녁 식사',
      result: '긍정적인 하루를 보냄'
    },
    {
      day: '4일차',
      emotion: '우울함',
      situation: '혼자 있는 시간이 길어짐',
      thought: '외로움과 후회가 밀려옴',
      action: '친구에게 전화, 산책하며 기분 전환',
      result: '대화 후 기분이 나아짐'
    },
    {
      day: '5일차',
      emotion: '긴장됨',
      situation: '법원 출석 일정 통보',
      thought: '불안하지만 준비를 잘 해야겠다는 다짐',
      action: '준비 서류 점검, 마음 다잡기',
      result: '할 수 있는 것에 집중하니 마음이 편해짐'
    },
  ];

  for (const record of week1Records) {
    page2.drawRectangle({ x: 45, y: y - 95, width: PAGE_WIDTH - 90, height: 100, color: THEME.lightBg, borderColor: THEME.border, borderWidth: 0.5 });

    page2.drawRectangle({ x: 45, y: y - 18, width: 60, height: 23, color: THEME.primary });
    page2.drawText(record.day, { x: 55, y: y - 12, size: 11, font, color: rgb(1, 1, 1) });

    const fields = [
      { label: '감정 상태', value: record.emotion },
      { label: '상황', value: record.situation },
      { label: '생각', value: record.thought },
      { label: '대처 행동', value: record.action },
      { label: '결과', value: record.result },
    ];

    let fieldY = y - 12;
    let fieldX = 115;
    for (let i = 0; i < fields.length; i++) {
      if (i === 2) { fieldY = y - 45; fieldX = 55; }
      if (i === 3) { fieldY = y - 62; fieldX = 55; }
      if (i === 4) { fieldY = y - 79; fieldX = 55; }

      page2.drawText(`${fields[i].label}:`, { x: fieldX, y: fieldY, size: 8, font, color: THEME.secondary });
      page2.drawText(fields[i].value, { x: fieldX + 55, y: fieldY, size: 8, font, color: rgb(0.2, 0.2, 0.2) });

      if (i < 2) fieldX += 170;
    }
    y -= 105;
  }

  // ===== 페이지 3: 2주차 및 성찰 =====
  const page3 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page3.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: THEME.border, borderWidth: 1.5 });

  y = PAGE_HEIGHT - 60;
  centerText(page3, '【 2주차 ~ 4주차 실천 요약 】', y, font, 16, THEME.primary);
  y -= 35;

  const weeklySummary = [
    {
      week: '2주차',
      summary: '일상생활에서 감정 조절 능력이 향상되었습니다. 스트레스 상황에서 심호흡과 자기 대화를 통해 충동적 반응을 억제할 수 있게 되었습니다. 가족과의 관계도 점진적으로 회복되고 있습니다.',
      improvement: '위험 상황 인식 능력 향상, 대처 행동의 자연스러운 적용'
    },
    {
      week: '3주차',
      summary: '위험 상황이 발생했을 때 미리 회피하거나 대비하는 습관이 형성되었습니다. 부정적인 감정이 들 때 혼자 해결하려 하지 않고 지지체계(가족, 상담사)에게 도움을 요청하는 것이 익숙해졌습니다.',
      improvement: '예방적 행동 패턴 형성, 사회적 지지체계 활용 능력 향상'
    },
    {
      week: '4주차',
      summary: '4주간의 실천을 통해 자기 관리 능력에 자신감이 생겼습니다. 앞으로도 이 습관을 유지하여 건강한 사회 구성원으로 살아가겠다는 다짐을 하였습니다. 재범 방지에 대한 확고한 의지를 갖게 되었습니다.',
      improvement: '자기 효능감 향상, 재범 방지 의지 확립'
    },
  ];

  for (const week of weeklySummary) {
    page3.drawRectangle({ x: 45, y: y - 85, width: PAGE_WIDTH - 90, height: 90, color: THEME.lightBg, borderColor: THEME.border, borderWidth: 0.5 });

    page3.drawRectangle({ x: 45, y: y - 18, width: 55, height: 23, color: THEME.accent });
    page3.drawText(week.week, { x: 52, y: y - 12, size: 10, font, color: rgb(1, 1, 1) });

    page3.drawText('실천 요약:', { x: 110, y: y - 12, size: 9, font, color: THEME.secondary });
    const summaryLines = wrapText(week.summary, 60);
    let sumY = y - 28;
    for (const sl of summaryLines) {
      page3.drawText(sl, { x: 55, y: sumY, size: 8, font, color: rgb(0.2, 0.2, 0.2) });
      sumY -= 13;
    }

    page3.drawText(`▶ 변화/개선: ${week.improvement}`, { x: 55, y: y - 72, size: 8, font, color: THEME.primary });
    y -= 95;
  }

  y -= 20;

  // 종합 평가
  page3.drawRectangle({ x: 45, y: y - 120, width: PAGE_WIDTH - 90, height: 125, color: THEME.bg, borderColor: THEME.primary, borderWidth: 1 });

  page3.drawRectangle({ x: 45, y: y - 18, width: PAGE_WIDTH - 90, height: 23, color: THEME.primary });
  centerText(page3, '【 종합 평가 】', y - 12, font, 12, rgb(1, 1, 1));

  const evaluation = [
    '• 실천 일수: 28일 / 28일 (100% 이행)',
    '• 위험 상황 인식: 총 12회 인식 및 적절히 대처',
    '• 대처 행동 실천: 모든 상황에서 교육 내용 적용',
    '• 지지체계 활용: 가족, 상담사와 정기적 소통 유지',
    '• 종합 의견: 자기 관리 능력이 우수하며, 재범 위험 관리 역량이 양호함',
  ];

  let evalY = y - 40;
  for (const e of evaluation) {
    page3.drawText(e, { x: 60, y: evalY, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
    evalY -= 18;
  }

  y -= 150;

  // 발급일 및 서명
  page3.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 50;

  centerText(page3, '재범방지교육통합센터', y, font, 15, THEME.primary);
  if (sealImage) {
    page3.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 28, width: 65, height: 65 });
  }
  y -= 25;
  centerText(page3, '센 터 장', y, font, 11, THEME.secondary);

  return pdfDoc.save();
}

// ========== 이수자 변화 기록 보고서 ==========
async function generateChangeReport(fontBytes, logoBytes, sealBytes) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);

  let logoImage, sealImage;
  if (logoBytes) try { logoImage = await pdfDoc.embedPng(logoBytes); } catch(e) {}
  if (sealBytes) try { sealImage = await pdfDoc.embedPng(sealBytes); } catch(e) {}

  // ===== 페이지 1: 표지 =====
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page1.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: THEME.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 100;
    const logoH = (logoImage.height / logoImage.width) * logoW;
    page1.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page1, '재범방지교육통합센터', y, font, 12, THEME.secondary);
  y -= 50;

  centerText(page1, '이수자 변화 기록 보고서', y, font, 28, THEME.primary);
  y -= 25;
  centerText(page1, 'Trainee Progress & Change Report', y, font, 10, THEME.secondary);
  y -= 40;

  page1.drawLine({ start: { x: 60, y }, end: { x: PAGE_WIDTH - 60, y }, thickness: 1.5, color: THEME.border });
  y -= 40;

  // 기본 정보
  page1.drawText('성        명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page1.drawLine({ start: { x: 155, y: y - 3 }, end: { x: 350, y: y - 3 }, thickness: 0.5, color: THEME.secondary });
  y -= 30;

  page1.drawText('교육 기간 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page1.drawLine({ start: { x: 155, y: y - 3 }, end: { x: 350, y: y - 3 }, thickness: 0.5, color: THEME.secondary });
  y -= 40;

  const intro = [
    '위 사람의 재범방지교육 이수 과정에서 관찰된 인식, 태도, 행동의',
    '변화 사항을 아래와 같이 기록하여 보고합니다.',
  ];
  for (const line of intro) {
    page1.drawText(line, { x: 70, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 22;
  }
  y -= 30;

  // 변화 단계 요약
  page1.drawRectangle({ x: 50, y: y - 10, width: PAGE_WIDTH - 100, height: 30, color: THEME.primary });
  centerText(page1, '【 변화 단계 요약 】', y - 2, font, 13, rgb(1, 1, 1));
  y -= 55;

  const phases = [
    { phase: '교육 전', status: '문제 인식 부족', color: rgb(0.7, 0.3, 0.3) },
    { phase: '교육 초기', status: '저항/방어적 태도', color: rgb(0.7, 0.5, 0.3) },
    { phase: '교육 중기', status: '점진적 인식 변화', color: rgb(0.5, 0.6, 0.3) },
    { phase: '교육 후기', status: '적극적 참여/반성', color: rgb(0.3, 0.6, 0.4) },
    { phase: '교육 완료', status: '변화 확립/실천 의지', color: rgb(0.2, 0.5, 0.6) },
  ];

  const phaseWidth = (PAGE_WIDTH - 120) / 5;
  for (let i = 0; i < phases.length; i++) {
    const px = 55 + i * phaseWidth;
    page1.drawRectangle({ x: px, y: y - 35, width: phaseWidth - 5, height: 50, color: phases[i].color, borderColor: THEME.border, borderWidth: 0.5 });
    page1.drawText(phases[i].phase, { x: px + 5, y: y - 8, size: 9, font, color: rgb(1, 1, 1) });
    const statusLines = wrapText(phases[i].status, 10);
    let sy = y - 22;
    for (const sl of statusLines) {
      page1.drawText(sl, { x: px + 5, y: sy, size: 8, font, color: rgb(1, 1, 1) });
      sy -= 11;
    }

    if (i < phases.length - 1) {
      page1.drawText('→', { x: px + phaseWidth - 8, y: y - 15, size: 14, font, color: THEME.primary });
    }
  }
  y -= 70;

  // 상세 기록 안내
  page1.drawRectangle({ x: 50, y: y - 10, width: PAGE_WIDTH - 100, height: 30, color: THEME.accent });
  centerText(page1, '【 상세 기록 (다음 페이지) 】', y - 2, font, 13, rgb(1, 1, 1));

  // ===== 페이지 2: 상세 변화 기록 =====
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page2.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: THEME.border, borderWidth: 1.5 });

  y = PAGE_HEIGHT - 55;
  centerText(page2, '【 단계별 상세 변화 기록 】', y, font, 15, THEME.primary);
  y -= 35;

  const detailedChanges = [
    {
      phase: '1. 교육 전 상태',
      observations: [
        '• 자신의 행동에 대한 책임 인식 부족',
        '• 범죄 행위를 외부 요인(환경, 타인)의 탓으로 돌리는 경향',
        '• 피해자에 대한 공감 능력 미흡',
        '• 재범 가능성에 대한 자각 부재',
      ],
    },
    {
      phase: '2. 교육 초기 (1~2회차)',
      observations: [
        '• 교육 참여에 대한 소극적이고 방어적인 태도',
        '• 교육 내용에 대한 저항감 표현',
        '• 그러나 출석은 성실히 이행함',
        '• 점차 다른 참여자들의 경험에 관심을 보이기 시작',
      ],
    },
    {
      phase: '3. 교육 중기 (3~5회차)',
      observations: [
        '• 자신의 행동이 미친 영향에 대해 생각하기 시작',
        '• 피해자 관점 교육 후 눈에 띄는 태도 변화',
        '• 그룹 토론에 적극적으로 참여',
        '• 자신의 경험을 솔직하게 나누기 시작',
        '• 감정 조절 기법 학습에 높은 관심 표현',
      ],
    },
    {
      phase: '4. 교육 후기 (6~8회차)',
      observations: [
        '• 자신의 잘못에 대한 진정한 반성 표현',
        '• 피해자에 대한 깊은 공감과 사죄의 마음',
        '• 재범 방지를 위한 구체적인 계획 수립',
        '• 가족/지인과의 관계 회복 노력',
        '• 스트레스 상황 대처 능력 향상',
        '• 긍정적인 미래 계획 수립',
      ],
    },
  ];

  for (const change of detailedChanges) {
    const boxHeight = 25 + change.observations.length * 16;
    page2.drawRectangle({ x: 45, y: y - boxHeight, width: PAGE_WIDTH - 90, height: boxHeight, color: THEME.lightBg, borderColor: THEME.border, borderWidth: 0.5 });

    page2.drawRectangle({ x: 45, y: y - 20, width: PAGE_WIDTH - 90, height: 22, color: THEME.primary });
    page2.drawText(change.phase, { x: 55, y: y - 14, size: 11, font, color: rgb(1, 1, 1) });

    let obsY = y - 38;
    for (const obs of change.observations) {
      page2.drawText(obs, { x: 55, y: obsY, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
      obsY -= 16;
    }
    y -= boxHeight + 12;
  }

  // ===== 페이지 3: 영역별 변화 및 종합 평가 =====
  const page3 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page3.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: THEME.border, borderWidth: 1.5 });

  y = PAGE_HEIGHT - 55;
  centerText(page3, '【 영역별 변화 평가 】', y, font, 15, THEME.primary);
  y -= 35;

  const domains = [
    {
      domain: '인지적 변화',
      before: '범죄 행위 합리화, 책임 전가',
      after: '자신의 행동에 대한 정확한 인식, 책임 수용',
      score: '매우 양호',
    },
    {
      domain: '정서적 변화',
      before: '피해자에 대한 무관심',
      after: '진정한 공감과 죄책감, 사죄의 마음',
      score: '양호',
    },
    {
      domain: '행동적 변화',
      before: '충동적 반응, 미흡한 자기 조절',
      after: '감정 조절 능력 향상, 대안 행동 실천',
      score: '매우 양호',
    },
    {
      domain: '사회적 변화',
      before: '대인관계 갈등, 고립',
      after: '가족/사회와의 관계 회복 노력, 지지체계 구축',
      score: '양호',
    },
  ];

  for (const d of domains) {
    page3.drawRectangle({ x: 45, y: y - 65, width: PAGE_WIDTH - 90, height: 68, color: THEME.lightBg, borderColor: THEME.border, borderWidth: 0.5 });

    page3.drawRectangle({ x: 45, y: y - 18, width: 100, height: 21, color: THEME.accent });
    page3.drawText(d.domain, { x: 55, y: y - 12, size: 10, font, color: rgb(1, 1, 1) });

    page3.drawRectangle({ x: PAGE_WIDTH - 135, y: y - 18, width: 85, height: 21, color: THEME.primary });
    page3.drawText(`평가: ${d.score}`, { x: PAGE_WIDTH - 125, y: y - 12, size: 9, font, color: rgb(1, 1, 1) });

    page3.drawText(`교육 전: ${d.before}`, { x: 55, y: y - 35, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
    page3.drawText(`교육 후: ${d.after}`, { x: 55, y: y - 52, size: 9, font, color: rgb(0.15, 0.15, 0.15) });

    y -= 75;
  }

  y -= 15;

  // 종합 평가
  page3.drawRectangle({ x: 45, y: y - 140, width: PAGE_WIDTH - 90, height: 145, color: THEME.bg, borderColor: THEME.primary, borderWidth: 1.5 });

  page3.drawRectangle({ x: 45, y: y - 22, width: PAGE_WIDTH - 90, height: 25, color: THEME.primary });
  centerText(page3, '【 종합 평가 및 소견 】', y - 14, font, 13, rgb(1, 1, 1));

  const finalEval = [
    '위 이수자는 재범방지교육 전 과정에 성실히 참여하였으며, 교육 기간 동안',
    '인지, 정서, 행동, 사회적 영역에서 유의미한 긍정적 변화를 보였습니다.',
    '',
    '특히 자신의 행동에 대한 진정한 반성과 피해자에 대한 공감 능력이',
    '크게 향상되었으며, 재범 방지를 위한 구체적인 실천 계획을 수립하였습니다.',
    '',
    '이에 본 센터는 위 이수자의 사회 복귀 준비가 양호하며,',
    '재범 위험성이 낮은 것으로 평가합니다.',
  ];

  let evalY = y - 45;
  for (const line of finalEval) {
    if (line === '') { evalY -= 8; continue; }
    page3.drawText(line, { x: 60, y: evalY, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    evalY -= 16;
  }

  y -= 170;

  // 발급일 및 서명
  page3.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 50;

  centerText(page3, '재범방지교육통합센터', y, font, 15, THEME.primary);
  if (sealImage) {
    page3.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 28, width: 65, height: 65 });
  }
  y -= 25;
  centerText(page3, '센 터 장', y, font, 11, THEME.secondary);

  return pdfDoc.save();
}

async function main() {
  console.log('상세 보고서 PDF 생성 시작...\n');

  const fontPath = path.join(__dirname, '../public/fonts/NanumGothicBold.ttf');
  const logoPath = path.join(__dirname, '../public/images/logo/logo.png');
  const sealPath = path.join(__dirname, '../public/images/seal.png');
  const outputDir = path.join(__dirname, '../public/certificates');
  const docsDir = path.join(__dirname, '../docs');

  const fontBytes = fs.readFileSync(fontPath);
  let logoBytes, sealBytes;
  try { logoBytes = fs.readFileSync(logoPath); } catch(e) {}
  try { sealBytes = fs.readFileSync(sealPath); } catch(e) {}

  // 실천일지 생성
  console.log('생성 중: 재범 위험 관리 실천일지.pdf');
  const diaryBytes = await generatePracticeDiary(fontBytes, logoBytes, sealBytes);
  fs.writeFileSync(path.join(outputDir, '재범 위험 관리 실천일지.pdf'), diaryBytes);
  fs.writeFileSync(path.join(docsDir, '재범 위험 관리 실천일지.pdf'), diaryBytes);
  console.log('  ✓ 완료: 재범 위험 관리 실천일지.pdf (3페이지)');

  // 변화 기록 보고서 생성
  console.log('생성 중: 재범방지교육 이수자 변화 기록 보고서.pdf');
  const reportBytes = await generateChangeReport(fontBytes, logoBytes, sealBytes);
  fs.writeFileSync(path.join(outputDir, '재범방지교육 이수자 변화 기록 보고서.pdf'), reportBytes);
  fs.writeFileSync(path.join(docsDir, '재범방지교육 이수자 변화 기록 보고서.pdf'), reportBytes);
  console.log('  ✓ 완료: 재범방지교육 이수자 변화 기록 보고서.pdf (3페이지)');

  console.log('\n모든 보고서 생성 완료!');
}

main().catch(console.error);
