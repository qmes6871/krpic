const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_BOTTOM = 120;

const THEMES = {
  opinion: {
    primary: rgb(0.1, 0.35, 0.2),
    secondary: rgb(0.2, 0.45, 0.3),
    accent: rgb(0.15, 0.5, 0.35),
    border: rgb(0.2, 0.4, 0.25),
    bg: rgb(0.95, 0.98, 0.95),
  },
  petition: {
    primary: rgb(0.3, 0.15, 0.4),
    secondary: rgb(0.4, 0.25, 0.5),
    accent: rgb(0.5, 0.3, 0.6),
    border: rgb(0.35, 0.2, 0.45),
    bg: rgb(0.97, 0.95, 0.98),
  },
  reflection: {
    primary: rgb(0.45, 0.3, 0.15),
    secondary: rgb(0.55, 0.4, 0.25),
    accent: rgb(0.6, 0.45, 0.2),
    border: rgb(0.5, 0.35, 0.2),
    bg: rgb(0.99, 0.97, 0.94),
  },
  report: {
    primary: rgb(0.15, 0.2, 0.35),
    secondary: rgb(0.3, 0.35, 0.45),
    accent: rgb(0.2, 0.4, 0.6),
    border: rgb(0.25, 0.3, 0.4),
    bg: rgb(0.96, 0.97, 0.98),
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
    result.push(remaining.substring(0, maxChars));
    remaining = remaining.substring(maxChars);
  }
  return result;
}

// ========== 재범방지교육통합센터 소견서 ==========
async function generateOpinionCertificate(fontBytes, logoBytes, sealBytes) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);
  const theme = THEMES.opinion;

  let logoImage, sealImage;
  if (logoBytes) try { logoImage = await pdfDoc.embedPng(logoBytes); } catch(e) {}
  if (sealBytes) try { sealImage = await pdfDoc.embedPng(sealBytes); } catch(e) {}

  // 페이지 1
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2.5 });
  page.drawRectangle({ x: 32, y: 32, width: PAGE_WIDTH - 64, height: PAGE_HEIGHT - 64, borderColor: theme.accent, borderWidth: 0.5 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 95, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 50;

  centerText(page, '소    견    서', y, font, 32, theme.primary);
  y -= 22;
  centerText(page, 'Professional Opinion Statement', y, font, 10, theme.secondary);
  y -= 40;

  page.drawLine({ start: { x: 60, y }, end: { x: PAGE_WIDTH - 60, y }, thickness: 1.5, color: theme.border });
  y -= 40;

  page.drawText('성        명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 160, y: y - 3 }, end: { x: 380, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 35;

  const intro = [
    '위 사람은 본 센터에서 실시한 재범방지교육 프로그램에 성실히 참여하였으며,',
    '교육 과정에서 관찰된 사항에 대하여 아래와 같이 소견을 제출합니다.',
  ];
  for (const line of intro) {
    page.drawText(line, { x: 70, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 22;
  }
  y -= 20;

  const opinionSections = [
    {
      title: '1. 교육 참여 태도',
      content: '교육 전 과정에 빠짐없이 출석하였으며, 모든 교육 활동에 적극적이고 성실한 자세로 참여하였습니다. 특히 그룹 토론과 역할극 활동에서 주도적인 모습을 보였으며, 다른 참여자들의 이야기에도 귀 기울이는 경청의 자세가 돋보였습니다. 교육 시간 외에도 자발적으로 질문하고 추가 학습 자료를 요청하는 등 배움에 대한 열의를 보여주었습니다.',
    },
    {
      title: '2. 인식 변화',
      content: '교육 초기에는 자신의 행동에 대한 책임 인식이 부족하였으나, 교육이 진행됨에 따라 점차 자신의 잘못을 인정하고 진정으로 반성하는 모습을 보였습니다. 특히 피해자 공감 교육 이후 피해자의 고통에 대해 깊이 이해하게 되었으며, 진심 어린 사죄의 마음을 표현하였습니다. 자신의 행동이 피해자뿐 아니라 가족과 사회 전체에 미친 부정적 영향을 명확히 인식하게 되었습니다.',
    },
    {
      title: '3. 행동 변화',
      content: '감정 조절 기법과 대처 기술을 성실히 학습하였으며, 실제 상황에서 이를 적용하려는 노력이 관찰되었습니다. 스트레스 상황에서 충동적으로 반응하던 과거와 달리, 상황을 객관적으로 인식하고 적절하게 대처하는 능력이 향상되었습니다. 대인관계에서도 보다 건강한 의사소통 방식을 사용하려는 변화가 관찰되었으며, 갈등 상황에서 비폭력적인 해결 방법을 모색하는 태도가 형성되었습니다.',
    },
    {
      title: '4. 재발 방지 계획',
      content: '교육을 통해 자신의 문제 행동 유발 요인을 명확히 인식하게 되었으며, 이를 예방하고 대처하기 위한 구체적인 계획을 수립하였습니다. 가족 및 주변의 지지체계를 구축하고, 필요시 전문 상담을 받겠다는 의지도 표명하였습니다. 위험 상황에서의 대처 방안을 여러 가지 마련하였으며, 건강한 생활 습관과 스트레스 해소 방법을 실천할 계획입니다.',
    },
  ];

  for (const section of opinionSections) {
    // 섹션 시작 전 페이지 체크
    if (y < MARGIN_BOTTOM + 120) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
      y = PAGE_HEIGHT - 60;
    }

    page.drawRectangle({ x: 55, y: y - 5, width: PAGE_WIDTH - 110, height: 22, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(section.title, { x: 65, y: y, size: 11, font, color: theme.primary });
    y -= 28;

    const contentLines = wrapText(section.content, 62);
    for (const cl of contentLines) {
      if (y < MARGIN_BOTTOM) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
        y = PAGE_HEIGHT - 60;
      }
      page.drawText(cl, { x: 65, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 15;
    }
    y -= 18;
  }

  // 종합 소견
  if (y < MARGIN_BOTTOM + 150) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });
    y = PAGE_HEIGHT - 60;
  }

  y -= 10;
  page.drawRectangle({ x: 50, y: y - 105, width: PAGE_WIDTH - 100, height: 110, color: theme.bg, borderColor: theme.primary, borderWidth: 1 });
  page.drawRectangle({ x: 50, y: y - 20, width: PAGE_WIDTH - 100, height: 25, color: theme.primary });
  centerText(page, '【 종합 소견 】', y - 12, font, 12, rgb(1, 1, 1));

  const finalOpinion = [
    '위 대상자는 재범방지교육을 통해 인식, 태도, 행동 전반에 걸쳐 의미 있는',
    '긍정적 변화를 보였습니다. 자신의 행동에 대한 진정한 반성과 함께 재범',
    '방지를 위한 구체적인 실천 의지를 갖추고 있어, 사회 복귀 준비가 양호한',
    '것으로 판단됩니다.',
  ];

  let fy = y - 40;
  for (const line of finalOpinion) {
    page.drawText(line, { x: 60, y: fy, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    fy -= 16;
  }

  y -= 135;

  page.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 55;

  centerText(page, '재범방지교육통합센터', y, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });

  return pdfDoc.save();
}

// ========== 탄원서 ==========
async function generatePetitionCertificate(fontBytes, logoBytes, sealBytes, isCounselor = false) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);
  const theme = THEMES.petition;

  let logoImage, sealImage;
  if (logoBytes) try { logoImage = await pdfDoc.embedPng(logoBytes); } catch(e) {}
  if (sealBytes) try { sealImage = await pdfDoc.embedPng(sealBytes); } catch(e) {}

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 65;

  if (logoImage) {
    const logoW = 85, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  centerText(page, isCounselor ? '심리상담사' : '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 45;

  centerText(page, '탄    원    서', y, font, 32, theme.primary);
  y -= 20;
  centerText(page, 'Petition Letter', y, font, 10, theme.secondary);
  y -= 40;

  page.drawText('피고인 성명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 170, y: y - 3 }, end: { x: 400, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 45;

  const petitionContent = isCounselor ? [
    '존경하는 재판장님께',
    '',
    '본 심리상담사는 위 피고인과 여러 차례에 걸친 심층 상담을 진행하며 관찰한 진정한 반성과 변화의 모습을 바탕으로, 선처를 탄원하고자 이 글을 올립니다.',
    '',
    '상담 과정에서 피고인은 자신의 행동이 피해자와 사회에 미친 영향에 대해 깊이 인식하게 되었습니다. 초기 상담에서는 자기 방어적인 태도를 보이며 자신의 잘못을 축소하거나 외부 요인 탓으로 돌리려는 경향이 있었습니다. 그러나 지속적인 상담을 통해 점차 마음의 벽을 허물고, 자신의 행동이 얼마나 잘못된 것이었는지 진심으로 깨닫게 되었습니다.',
    '',
    '특히 피해자의 고통에 대해 공감하며 진심 어린 사죄의 마음을 표현하였습니다. 상담 중 피해자가 겪었을 두려움, 분노, 트라우마에 대해 이야기할 때 피고인은 눈물을 흘리며 깊은 죄책감을 표현하였습니다. 이러한 반응은 연기나 계산에서 나온 것이 아니라, 진정으로 피해자의 고통을 이해하게 된 결과라고 판단됩니다.',
    '',
    '상담을 통해 피고인은 자신의 행동 패턴을 객관적으로 인식하게 되었습니다. 어떤 상황에서 자신이 잘못된 선택을 하게 되는지, 그 근본적인 원인이 무엇인지 탐색하는 과정에서 피고인은 자신의 내면을 직면하는 용기를 보여주었습니다. 이는 진정한 변화의 첫걸음이라 할 수 있습니다.',
    '',
    '피고인은 감정 조절과 충동 억제를 위한 구체적인 기법들을 습득하였습니다. 분노가 치밀어 오를 때 사용할 수 있는 심호흡법, 상황에서 벗어나 냉정을 되찾는 타임아웃 기법, 부정적 생각을 합리적으로 재구성하는 인지 기법 등을 열심히 연습하였습니다. 상담 중 역할극을 통해 이러한 기법들을 실제로 적용해 보는 훈련도 하였습니다.',
    '',
    '심리 평가 결과, 피고인의 재범 위험 요인은 상당 부분 감소하였습니다. 충동성 조절 능력이 향상되었고, 문제 상황에서 합리적인 대안을 찾는 능력도 발전하였습니다. 또한 피고인은 건강한 사회 적응을 위한 심리적 준비가 되어 있는 것으로 판단됩니다.',
    '',
    '피고인은 가족과의 관계 회복을 위해 적극적으로 노력하고 있습니다. 그동안 소홀했던 가족에게 진심으로 사과하고, 신뢰를 회복하기 위해 매일 노력하고 있습니다. 가족들도 피고인의 변화를 인정하며, 앞으로 함께 힘이 되어주겠다고 약속하였습니다.',
    '',
    '피고인은 사회에 복귀하여 성실하게 살아가겠다는 구체적인 계획도 수립하였습니다. 정해진 직장에서 성실히 일하고, 정기적으로 상담을 받으며 자신을 관리하겠다는 의지를 보여주었습니다. 또한 자신의 경험을 바탕으로 비슷한 어려움을 겪는 사람들에게 도움이 되고 싶다는 포부도 밝혔습니다.',
    '',
    '이에 전문 심리상담사로서 피고인의 진정성 있는 변화를 확인하였으며, 피고인이 사회에 복귀하여 건전한 시민으로 새로운 삶을 살아갈 수 있도록 재판장님의 현명하신 판단과 선처를 간곡히 탄원드립니다.',
  ] : [
    '존경하는 재판장님께',
    '',
    '본 재범방지교육통합센터는 위 피고인이 본 센터의 재범방지교육 프로그램에 참여하여 보여준 진정한 반성과 변화의 모습을 확인하고, 선처를 탄원하고자 이 글을 올립니다.',
    '',
    '피고인은 교육 기간 동안 모든 과정에 성실히 참여하였습니다. 단 한 번의 지각이나 결석 없이 모든 교육에 출석하였으며, 교육 시간 동안 집중하여 강의를 듣고 적극적으로 활동에 참여하였습니다. 그룹 토론에서는 자신의 생각을 솔직하게 나누었고, 다른 참여자들의 의견에도 귀 기울이는 모습을 보여주었습니다.',
    '',
    '교육 초기에는 다소 방어적인 태도를 보이기도 하였습니다. 자신의 행동에 대해 변명하거나 상황을 탓하려는 모습이 관찰되었습니다. 그러나 시간이 지남에 따라 점차 마음을 열고 진정으로 자신의 잘못을 인정하기 시작하였습니다. 특히 피해자 공감 교육에서 피해자들의 이야기를 듣고 난 후, 피고인의 태도에 눈에 띄는 변화가 나타났습니다.',
    '',
    '피고인은 자신의 행동이 피해자에게 얼마나 큰 상처를 주었는지 깊이 인식하게 되었습니다. 피해자가 겪었을 두려움, 분노, 슬픔, 그리고 일상생활의 어려움에 대해 생각하며 진심으로 가슴 아파하는 모습을 보였습니다. 교육 중 피해자에게 전하는 편지를 쓰는 시간에 피고인은 눈물을 흘리며 진심 어린 사죄의 마음을 담았습니다.',
    '',
    '피고인은 자신의 잘못이 피해자뿐 아니라 가족과 사회 전체에 미친 부정적 영향도 명확히 인식하게 되었습니다. 가족들이 겪었을 걱정과 실망, 사회적 시선으로 인한 어려움에 대해 생각하며, 자신의 행동에 대한 무거운 책임감을 느끼게 되었습니다.',
    '',
    '교육을 통해 피고인은 분노 조절, 충동 억제, 스트레스 관리 등 다양한 기법을 습득하였습니다. 심호흡법, 근육 이완법, 인지 재구성 기법 등을 열심히 연습하였으며, 역할극을 통해 실제 상황에서 이를 적용하는 훈련도 하였습니다. 교육 후반에는 이러한 기법들을 자연스럽게 사용하는 모습이 관찰되었습니다.',
    '',
    '피고인은 재발 방지를 위한 구체적이고 실천 가능한 계획을 수립하였습니다. 위험 상황을 미리 인식하고 피하는 방법, 갈등 상황에서 비폭력적으로 대처하는 방법, 스트레스를 건강하게 해소하는 방법 등을 계획하였습니다. 또한 정기적으로 상담을 받고, 가족과 소통하며 지지체계를 유지하겠다는 의지도 보여주었습니다.',
    '',
    '피고인은 가족과의 관계 회복을 위해 적극적으로 노력하고 있습니다. 교육 기간 동안 가족에게 진심으로 사과하고, 앞으로 더 좋은 가족 구성원이 되겠다고 약속하였습니다. 가족들도 피고인의 변화를 인정하며 지지를 표명하였습니다.',
    '',
    '본 센터의 전문 상담사 및 교육진의 종합 평가 결과, 피고인은 재범 가능성이 낮으며 사회 복귀 준비가 양호한 것으로 판단됩니다. 피고인의 진정한 반성과 변화 의지, 구체적인 재발 방지 계획, 가족의 지지 등을 종합적으로 고려할 때, 피고인이 사회에 복귀하여 건전한 시민으로 새로운 삶을 살아갈 수 있을 것으로 기대됩니다.',
    '',
    '이에 본 센터는 피고인이 사회에 복귀하여 새로운 삶을 시작할 수 있도록 재판장님의 현명하신 판단과 선처를 간곡히 탄원합니다. 피고인에게 다시 한번 기회를 주시어 스스로 변화할 수 있도록 선처해 주시기를 부탁드립니다.',
  ];

  for (const line of petitionContent) {
    if (line === '') { y -= 12; continue; }
    const wrapped = wrapText(line, 52);
    for (const wl of wrapped) {
      if (y < MARGIN_BOTTOM) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        page.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 2 });
        y = PAGE_HEIGHT - 60;
      }
      page.drawText(wl, { x: 70, y, size: 11, font, color: rgb(0.12, 0.12, 0.12) });
      y -= 20;
    }
  }

  // 서명 부분
  if (y < MARGIN_BOTTOM + 80) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 2 });
    y = PAGE_HEIGHT - 100;
  }

  y -= 30;
  page.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 55;

  if (isCounselor) {
    centerText(page, '심리상담사', y, font, 14, theme.primary);
    y -= 28;
    page.drawText('성명:', { x: PAGE_WIDTH / 2 - 60, y, size: 12, font, color: theme.secondary });
    page.drawLine({ start: { x: PAGE_WIDTH / 2 - 20, y: y - 3 }, end: { x: PAGE_WIDTH / 2 + 100, y: y - 3 }, thickness: 0.5, color: theme.secondary });
    page.drawText('(인)', { x: PAGE_WIDTH / 2 + 105, y, size: 11, font, color: theme.secondary });
  } else {
    centerText(page, '재범방지교육통합센터', y, font, 15, theme.primary);
    if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });
  }

  return pdfDoc.save();
}

// ========== 소감문 ==========
async function generateReflectionCertificate(fontBytes, logoBytes, sealBytes, type) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);
  const theme = THEMES.reflection;
  const isCounseling = type === 'counseling';

  let logoImage, sealImage;
  if (logoBytes) try { logoImage = await pdfDoc.embedPng(logoBytes); } catch(e) {}
  if (sealBytes) try { sealImage = await pdfDoc.embedPng(sealBytes); } catch(e) {}

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 1.5 });
  page.drawRectangle({ x: 35, y: 35, width: PAGE_WIDTH - 70, height: PAGE_HEIGHT - 70, borderColor: theme.accent, borderWidth: 0.5 });

  let y = PAGE_HEIGHT - 65;

  if (logoImage) {
    const logoW = 90, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  centerText(page, '재범방지교육통합센터', y, font, 11, theme.secondary);
  y -= 45;

  const title = isCounseling ? '심리상담 소감문' : '이수 소감문';
  centerText(page, title, y, font, 28, theme.primary);
  y -= 40;

  page.drawLine({ start: { x: 70, y }, end: { x: PAGE_WIDTH - 70, y }, thickness: 1, color: theme.border });
  y -= 40;

  page.drawText('성        명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 160, y: y - 3 }, end: { x: 380, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 35;

  const intro = isCounseling
    ? '위 사람은 본 센터에서 실시한 심리상담 프로그램에 참여하고 아래와 같이 소감문을 제출하였음을 증명합니다.'
    : '위 사람은 본 센터에서 실시한 재범방지교육 프로그램을 이수하고 아래와 같이 소감문을 제출하였음을 증명합니다.';

  const introLines = wrapText(intro, 55);
  for (const il of introLines) {
    page.drawText(il, { x: 70, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 20;
  }
  y -= 20;

  page.drawRectangle({ x: 50, y: y - 8, width: PAGE_WIDTH - 100, height: 26, color: theme.primary });
  centerText(page, '【 소감문 내용 】', y - 2, font, 12, rgb(1, 1, 1));
  y -= 45;

  const reflectionContent = isCounseling ? [
    {
      title: '1. 상담을 통해 새롭게 알게 된 점',
      content: '심리상담을 받기 전까지 저는 제 안에 있는 분노와 불안의 근본 원인을 제대로 알지 못했습니다. 왜 저런 행동을 했는지, 왜 그 순간 감정을 조절하지 못했는지 스스로도 이해할 수 없었습니다. 하지만 상담사 선생님과의 깊은 대화를 통해 제 행동의 뿌리를 찾을 수 있었습니다. 어린 시절의 경험들, 해결되지 않은 상처들, 그리고 오랫동안 쌓여온 잘못된 사고 패턴들이 제 행동에 영향을 미쳤다는 것을 알게 되었습니다. 또한 감정을 건강하게 표현하고 조절하는 방법이 있다는 것도 처음 배웠습니다. 화가 나거나 힘들 때 그것을 파괴적인 방식이 아닌 건강한 방식으로 해소할 수 있다는 것이 저에게는 큰 발견이었습니다.',
    },
    {
      title: '2. 자신의 행동에 대한 반성',
      content: '상담을 받으면서 제가 저지른 행동이 얼마나 잘못된 것인지 진심으로 깨닫게 되었습니다. 처음에는 저도 억울한 점이 있다고 생각했고, 상황이 저를 그렇게 만들었다고 변명하고 싶었습니다. 하지만 상담을 통해 그런 생각들이 얼마나 이기적이고 무책임한 것인지 알게 되었습니다. 어떤 상황이었든, 어떤 이유가 있었든 제 행동은 정당화될 수 없습니다. 피해자분이 겪으셨을 고통을 생각하면 너무나 부끄럽고 죄송스럽습니다. 제가 한 행동 하나하나가 얼마나 큰 상처를 남겼을지, 그 분의 일상이 어떻게 무너졌을지 생각하면 가슴이 무겁습니다.',
    },
    {
      title: '3. 피해자에 대한 생각',
      content: '피해자분께 진심으로 사죄드립니다. 저로 인해 겪으셨을 두려움, 분노, 슬픔, 그리고 일상의 평화가 깨진 고통을 생각하면 정말 죄송한 마음뿐입니다. 밤마다 악몽을 꾸셨을 수도 있고, 사람들을 믿기 어려워지셨을 수도 있습니다. 제가 저지른 잘못 하나로 그분의 인생이 얼마나 힘들어졌을지 감히 다 헤아릴 수 없습니다. 제가 저지른 잘못을 되돌릴 수는 없지만, 진심으로 반성하고 다시는 이런 일이 없도록 노력하겠습니다. 피해자분의 상처가 시간이 지나 조금이나마 치유되기를 간절히 바랍니다. 말로는 부족하지만, 진심으로 사죄드립니다.',
    },
    {
      title: '4. 앞으로의 변화 다짐',
      content: '상담을 통해 배운 감정 조절 기법과 스트레스 대처법을 일상에서 꾸준히 실천하겠습니다. 화가 나거나 힘든 상황이 오더라도 충동적으로 행동하지 않고, 상담에서 배운 심호흡, 타임아웃, 인지 재구성 방법으로 대처하겠습니다. 위험한 상황을 미리 인식하고 피하는 연습도 계속하겠습니다. 가족에게 더 좋은 아들/딸, 남편/아내, 아버지/어머니가 되겠습니다. 그동안 가족에게 끼친 걱정과 상처에 대해서도 진심으로 사과하고, 신뢰를 회복하기 위해 매일 노력하겠습니다. 사회에 기여하는 건전한 시민으로 살아가겠습니다. 이번 경험을 평생 잊지 않고, 다시는 같은 잘못을 반복하지 않을 것을 굳게 다짐합니다.',
    },
  ] : [
    {
      title: '1. 교육을 통해 배운 점',
      content: '재범방지교육을 받기 전까지 저는 제 행동의 심각성을 제대로 인식하지 못하고 있었습니다. 어딘가에서는 억울하다는 생각도 있었고, 상황이 나를 그렇게 만들었다고 변명하기도 했습니다. 하지만 교육을 통해 이런 생각들이 얼마나 잘못된 것인지 깨닫게 되었습니다. 제가 저지른 행동이 법적으로 어떤 의미인지, 피해자에게 어떤 영향을 미쳤는지, 가족과 사회에 어떤 피해를 주었는지 명확히 알게 되었습니다. 또한 분노 조절, 충동 억제, 갈등 해결 등 실생활에서 사용할 수 있는 구체적인 기술들도 배웠습니다. 화가 날 때 심호흡을 하고, 상황에서 잠시 벗어나 생각을 정리하는 방법, 상대방의 입장에서 생각해보는 방법 등이 정말 유용했습니다.',
    },
    {
      title: '2. 가장 인상 깊었던 내용',
      content: '피해자 공감 교육이 가장 인상 깊었습니다. 교육 중에 실제 범죄 피해자분들의 이야기를 듣게 되었습니다. 그분들이 사건 이후 어떤 두려움 속에 살아가는지, 일상이 어떻게 무너졌는지, 가족들은 어떤 고통을 겪는지 직접 들을 수 있었습니다. 그 이야기를 들으면서 저도 모르게 눈물이 났습니다. 제 잘못의 무게가 얼마나 무거운지, 피해자분이 얼마나 큰 고통 속에 있을지 그제서야 실감이 났습니다. 또한 다른 참여자들의 경험담을 들으며 저만 이런 어려움을 겪는 것이 아니라는 것도 알게 되었습니다. 서로의 이야기를 나누고 공감하며 함께 변화의 의지를 다질 수 있었습니다.',
    },
    {
      title: '3. 자신의 변화',
      content: '교육을 받기 전에는 제 잘못을 축소하거나 다른 사람 탓을 하려는 마음이 있었습니다. 하지만 교육을 통해 변명이 아닌 진정한 책임을 져야 한다는 것을 깨달았습니다. 이제 화가 날 때 즉각적으로 반응하지 않고 심호흡을 하며 생각할 시간을 갖습니다. 상대방이 왜 그런 말이나 행동을 했는지 그 사람 입장에서 생각해보려고 노력합니다. 가족들과의 대화도 많이 늘었습니다. 그동안 제가 가족들에게 얼마나 무심했는지, 얼마나 많은 걱정을 끼쳤는지 알게 되었고, 이제는 적극적으로 소통하려고 합니다. 조금씩이지만 관계가 회복되고 있는 것 같아 감사합니다.',
    },
    {
      title: '4. 앞으로의 다짐',
      content: '다시는 같은 잘못을 반복하지 않겠습니다. 이 다짐을 평생 가슴에 새기고 살겠습니다. 교육에서 배운 감정 조절 기법, 스트레스 대처법, 갈등 해결 기술을 매일 실천하겠습니다. 힘든 상황이 오더라도 올바른 방법으로 대처하겠습니다. 위험한 상황을 미리 인식하고 피하는 습관을 들이겠습니다. 피해자분과 가족에게 진심으로 사죄하며, 제 남은 인생을 성실하고 바르게 살아가겠습니다. 이번 교육은 저에게 다시 태어날 수 있는 기회를 준 것 같습니다. 이 기회를 절대 헛되이 하지 않겠습니다. 사회에 도움이 되는 사람, 가족에게 자랑스러운 사람이 되겠습니다. 감사합니다.',
    },
  ];

  for (const section of reflectionContent) {
    // 섹션 시작 전 페이지 체크
    if (y < MARGIN_BOTTOM + 100) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 1.5 });
      y = PAGE_HEIGHT - 60;
    }

    page.drawRectangle({ x: 55, y: y - 5, width: PAGE_WIDTH - 110, height: 20, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(section.title, { x: 62, y: y - 1, size: 10, font, color: theme.primary });
    y -= 26;

    const contentLines = wrapText(section.content, 62);
    for (const cl of contentLines) {
      if (y < MARGIN_BOTTOM) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        page.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 1.5 });
        y = PAGE_HEIGHT - 60;
      }
      page.drawText(cl, { x: 60, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 14;
    }
    y -= 20;
  }

  // 서명 부분
  if (y < MARGIN_BOTTOM + 80) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: theme.border, borderWidth: 1.5 });
    y = PAGE_HEIGHT - 100;
  }

  y -= 20;
  page.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 55;

  centerText(page, '재범방지교육통합센터', y, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });

  return pdfDoc.save();
}

// ========== 실천일지 ==========
async function generatePracticeDiary(fontBytes, logoBytes, sealBytes) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);
  const theme = THEMES.report;

  let logoImage, sealImage;
  if (logoBytes) try { logoImage = await pdfDoc.embedPng(logoBytes); } catch(e) {}
  if (sealBytes) try { sealImage = await pdfDoc.embedPng(sealBytes); } catch(e) {}

  // 페이지 1
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 100, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 50;

  centerText(page, '재범 위험 관리 실천일지', y, font, 28, theme.primary);
  y -= 25;
  centerText(page, 'Recidivism Risk Management Practice Journal', y, font, 10, theme.secondary);
  y -= 40;

  page.drawLine({ start: { x: 60, y }, end: { x: PAGE_WIDTH - 60, y }, thickness: 1.5, color: theme.border });
  y -= 40;

  page.drawText('성        명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 155, y: y - 3 }, end: { x: 350, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 35;

  const intro = [
    '위 사람은 본 센터에서 제공하는 재범 위험 관리 프로그램에 참여하여',
    '아래와 같이 실천일지를 성실히 작성하고 자기 관리를 실천하였음을 증명합니다.',
  ];
  for (const line of intro) {
    page.drawText(line, { x: 70, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 22;
  }
  y -= 25;

  // 프로그램 개요
  page.drawRectangle({ x: 50, y: y - 10, width: PAGE_WIDTH - 100, height: 30, color: theme.primary });
  centerText(page, '【 프로그램 개요 】', y - 2, font, 13, rgb(1, 1, 1));
  y -= 50;

  const overview = [
    { label: '프로그램명', value: '재범 위험 관리 실천 프로그램' },
    { label: '실천 방법', value: '일일 자기점검, 위험상황 기록, 대처행동 실천, 정기 성찰' },
    { label: '목표', value: '재범 위험 요인 인식 및 자기 관리 능력 향상' },
  ];

  for (const item of overview) {
    page.drawRectangle({ x: 55, y: y - 5, width: 90, height: 22, color: theme.bg, borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(item.label, { x: 62, y: y, size: 10, font, color: theme.primary });
    page.drawText(item.value, { x: 155, y: y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
    y -= 28;
  }
  y -= 20;

  // 실천 항목
  page.drawRectangle({ x: 50, y: y - 10, width: PAGE_WIDTH - 100, height: 30, color: theme.accent });
  centerText(page, '【 실천 항목 】', y - 2, font, 13, rgb(1, 1, 1));
  y -= 55;

  const practiceItems = [
    { title: '1. 일일 자기 점검', desc: '매일 아침/저녁 자신의 감정, 생각, 행동을 점검하고 위험 신호를 조기에 인식합니다.' },
    { title: '2. 위험 상황 기록', desc: '재범 유발 가능성이 있는 상황(스트레스, 갈등, 유혹 등)을 인식하고 기록합니다.' },
    { title: '3. 대처 행동 실천', desc: '교육에서 배운 대처 전략을 실제 상황에 적용하고 그 효과를 평가합니다.' },
    { title: '4. 정기 성찰 보고', desc: '실천 내용을 돌아보고, 잘한 점과 개선할 점을 정리합니다.' },
  ];

  for (const item of practiceItems) {
    page.drawRectangle({ x: 55, y: y - 38, width: PAGE_WIDTH - 110, height: 42, color: rgb(0.98, 0.98, 0.99), borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(item.title, { x: 65, y: y - 8, size: 11, font, color: theme.primary });
    const descLines = wrapText(item.desc, 65);
    let dy = y - 24;
    for (const dl of descLines) {
      page.drawText(dl, { x: 70, y: dy, size: 9, font, color: rgb(0.25, 0.25, 0.25) });
      dy -= 13;
    }
    y -= 48;
  }

  // 페이지 2: 실천 기록 예시
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 1.5 });

  y = PAGE_HEIGHT - 60;
  centerText(page, '【 실천 기록 】', y, font, 16, theme.primary);
  y -= 40;

  const records = [
    {
      situation: '스트레스 상황 발생',
      emotion: '짜증, 답답함',
      thought: '화를 내고 싶은 충동',
      action: '심호흡 5회 실시, 잠시 자리를 피해 마음 진정',
      result: '충동적 반응을 피하고 차분하게 대응할 수 있었음'
    },
    {
      situation: '대인관계 갈등',
      emotion: '분노, 억울함',
      thought: '상대방에게 화를 내고 싶음',
      action: '상대방 입장에서 생각해보기, 대화로 해결 시도',
      result: '감정을 조절하고 건설적인 대화를 나눔'
    },
    {
      situation: '과거 행동에 대한 후회',
      emotion: '우울함, 죄책감',
      thought: '자책하는 생각이 반복됨',
      action: '긍정적 자기대화, 가족과 대화 나눔',
      result: '기분이 나아지고 앞으로의 다짐을 새롭게 함'
    },
    {
      situation: '유혹 상황',
      emotion: '갈등, 불안',
      thought: '유혹에 빠지고 싶은 마음',
      action: '위험 상황 회피, 지지체계에 연락',
      result: '유혹을 이겨내고 올바른 선택을 함'
    },
  ];

  for (const record of records) {
    if (y < MARGIN_BOTTOM + 100) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 1.5 });
      y = PAGE_HEIGHT - 60;
    }

    page.drawRectangle({ x: 45, y: y - 90, width: PAGE_WIDTH - 90, height: 95, color: rgb(0.98, 0.98, 0.99), borderColor: theme.border, borderWidth: 0.5 });

    page.drawRectangle({ x: 45, y: y - 18, width: PAGE_WIDTH - 90, height: 23, color: theme.accent });
    page.drawText(`상황: ${record.situation}`, { x: 55, y: y - 12, size: 10, font, color: rgb(1, 1, 1) });

    page.drawText(`감정: ${record.emotion}`, { x: 55, y: y - 35, size: 9, font, color: theme.secondary });
    page.drawText(`생각: ${record.thought}`, { x: 55, y: y - 50, size: 9, font, color: theme.secondary });
    page.drawText(`대처: ${record.action}`, { x: 55, y: y - 65, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(`결과: ${record.result}`, { x: 55, y: y - 80, size: 9, font, color: theme.primary });

    y -= 105;
  }

  // 페이지 3: 종합 평가
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 1.5 });

  y = PAGE_HEIGHT - 60;
  centerText(page, '【 종합 평가 】', y, font, 16, theme.primary);
  y -= 45;

  page.drawRectangle({ x: 45, y: y - 180, width: PAGE_WIDTH - 90, height: 185, color: theme.bg, borderColor: theme.primary, borderWidth: 1 });

  const evaluation = [
    '• 위험 상황 인식: 스트레스, 갈등, 유혹 등 재범 위험 상황을 적절히 인식함',
    '',
    '• 대처 행동 실천: 교육에서 배운 감정 조절 기법, 대처 전략을 실제 상황에 적용함',
    '',
    '• 자기 모니터링: 일일 자기점검을 통해 자신의 감정과 행동을 지속적으로 관찰함',
    '',
    '• 지지체계 활용: 가족, 상담사 등 지지체계와 정기적으로 소통하며 도움을 요청함',
    '',
    '• 종합 의견: 자기 관리 능력이 향상되었으며, 재범 위험 관리 역량이 양호함',
  ];

  let ey = y - 20;
  for (const e of evaluation) {
    if (e === '') { ey -= 8; continue; }
    page.drawText(e, { x: 55, y: ey, size: 10, font, color: rgb(0.15, 0.15, 0.15) });
    ey -= 18;
  }

  y -= 210;

  page.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 55;

  centerText(page, '재범방지교육통합센터', y, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });

  return pdfDoc.save();
}

// ========== 변화 기록 보고서 ==========
async function generateChangeReport(fontBytes, logoBytes, sealBytes) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);
  const theme = THEMES.report;

  let logoImage, sealImage;
  if (logoBytes) try { logoImage = await pdfDoc.embedPng(logoBytes); } catch(e) {}
  if (sealBytes) try { sealImage = await pdfDoc.embedPng(sealBytes); } catch(e) {}

  // 페이지 1
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 70;

  if (logoImage) {
    const logoW = 100, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 15;
  }

  centerText(page, '재범방지교육통합센터', y, font, 12, theme.secondary);
  y -= 50;

  centerText(page, '이수자 변화 기록 보고서', y, font, 28, theme.primary);
  y -= 25;
  centerText(page, 'Trainee Progress & Change Report', y, font, 10, theme.secondary);
  y -= 40;

  page.drawLine({ start: { x: 60, y }, end: { x: PAGE_WIDTH - 60, y }, thickness: 1.5, color: theme.border });
  y -= 40;

  page.drawText('성        명 :', { x: 70, y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 155, y: y - 3 }, end: { x: 350, y: y - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 40;

  const intro = [
    '위 사람의 재범방지교육 이수 과정에서 관찰된 인식, 태도, 행동의',
    '변화 사항을 아래와 같이 기록하여 보고합니다.',
  ];
  for (const line of intro) {
    page.drawText(line, { x: 70, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 22;
  }
  y -= 25;

  // 변화 단계 요약
  page.drawRectangle({ x: 50, y: y - 10, width: PAGE_WIDTH - 100, height: 30, color: theme.primary });
  centerText(page, '【 변화 단계 요약 】', y - 2, font, 13, rgb(1, 1, 1));
  y -= 55;

  const phases = [
    { phase: '교육 전', status: '문제 인식 부족' },
    { phase: '교육 초기', status: '저항/방어적 태도' },
    { phase: '교육 중기', status: '점진적 인식 변화' },
    { phase: '교육 후기', status: '적극적 참여/반성' },
    { phase: '교육 완료', status: '변화 확립' },
  ];

  const phaseWidth = (PAGE_WIDTH - 120) / 5;
  for (let i = 0; i < phases.length; i++) {
    const px = 55 + i * phaseWidth;
    const colors = [rgb(0.7, 0.3, 0.3), rgb(0.7, 0.5, 0.3), rgb(0.5, 0.6, 0.3), rgb(0.3, 0.6, 0.4), rgb(0.2, 0.5, 0.6)];
    page.drawRectangle({ x: px, y: y - 35, width: phaseWidth - 5, height: 50, color: colors[i], borderColor: theme.border, borderWidth: 0.5 });
    page.drawText(phases[i].phase, { x: px + 5, y: y - 8, size: 9, font, color: rgb(1, 1, 1) });
    const statusLines = wrapText(phases[i].status, 10);
    let sy = y - 22;
    for (const sl of statusLines) {
      page.drawText(sl, { x: px + 5, y: sy, size: 8, font, color: rgb(1, 1, 1) });
      sy -= 11;
    }
    if (i < phases.length - 1) {
      page.drawText('→', { x: px + phaseWidth - 8, y: y - 15, size: 14, font, color: theme.primary });
    }
  }
  y -= 70;

  // 페이지 2: 상세 변화 기록
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 1.5 });

  y = PAGE_HEIGHT - 55;
  centerText(page, '【 단계별 상세 변화 기록 】', y, font, 15, theme.primary);
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
      phase: '2. 교육 초기',
      observations: [
        '• 교육 참여에 대한 소극적이고 방어적인 태도',
        '• 교육 내용에 대한 저항감 표현',
        '• 그러나 출석은 성실히 이행함',
        '• 점차 다른 참여자들의 경험에 관심을 보이기 시작',
      ],
    },
    {
      phase: '3. 교육 중기',
      observations: [
        '• 자신의 행동이 미친 영향에 대해 생각하기 시작',
        '• 피해자 관점 교육 후 눈에 띄는 태도 변화',
        '• 그룹 토론에 적극적으로 참여',
        '• 자신의 경험을 솔직하게 나누기 시작',
        '• 감정 조절 기법 학습에 높은 관심 표현',
      ],
    },
    {
      phase: '4. 교육 후기',
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
    const boxHeight = 28 + change.observations.length * 16;

    if (y < MARGIN_BOTTOM + boxHeight) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 1.5 });
      y = PAGE_HEIGHT - 60;
    }

    page.drawRectangle({ x: 45, y: y - boxHeight, width: PAGE_WIDTH - 90, height: boxHeight, color: rgb(0.98, 0.98, 0.99), borderColor: theme.border, borderWidth: 0.5 });
    page.drawRectangle({ x: 45, y: y - 20, width: PAGE_WIDTH - 90, height: 22, color: theme.primary });
    page.drawText(change.phase, { x: 55, y: y - 14, size: 11, font, color: rgb(1, 1, 1) });

    let obsY = y - 38;
    for (const obs of change.observations) {
      page.drawText(obs, { x: 55, y: obsY, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
      obsY -= 16;
    }
    y -= boxHeight + 12;
  }

  // 페이지 3: 영역별 변화 및 종합 평가
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 1.5 });

  y = PAGE_HEIGHT - 55;
  centerText(page, '【 영역별 변화 평가 】', y, font, 15, theme.primary);
  y -= 35;

  const domains = [
    { domain: '인지적 변화', before: '범죄 행위 합리화, 책임 전가', after: '자신의 행동에 대한 정확한 인식, 책임 수용', score: '매우 양호' },
    { domain: '정서적 변화', before: '피해자에 대한 무관심', after: '진정한 공감과 죄책감, 사죄의 마음', score: '양호' },
    { domain: '행동적 변화', before: '충동적 반응, 미흡한 자기 조절', after: '감정 조절 능력 향상, 대안 행동 실천', score: '매우 양호' },
    { domain: '사회적 변화', before: '대인관계 갈등, 고립', after: '가족/사회와의 관계 회복 노력, 지지체계 구축', score: '양호' },
  ];

  for (const d of domains) {
    page.drawRectangle({ x: 45, y: y - 65, width: PAGE_WIDTH - 90, height: 68, color: rgb(0.98, 0.98, 0.99), borderColor: theme.border, borderWidth: 0.5 });

    page.drawRectangle({ x: 45, y: y - 18, width: 100, height: 21, color: theme.accent });
    page.drawText(d.domain, { x: 55, y: y - 12, size: 10, font, color: rgb(1, 1, 1) });

    page.drawRectangle({ x: PAGE_WIDTH - 135, y: y - 18, width: 85, height: 21, color: theme.primary });
    page.drawText(`평가: ${d.score}`, { x: PAGE_WIDTH - 125, y: y - 12, size: 9, font, color: rgb(1, 1, 1) });

    page.drawText(`교육 전: ${d.before}`, { x: 55, y: y - 35, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(`교육 후: ${d.after}`, { x: 55, y: y - 52, size: 9, font, color: rgb(0.15, 0.15, 0.15) });

    y -= 75;
  }

  y -= 10;

  // 종합 평가
  page.drawRectangle({ x: 45, y: y - 120, width: PAGE_WIDTH - 90, height: 125, color: theme.bg, borderColor: theme.primary, borderWidth: 1.5 });

  page.drawRectangle({ x: 45, y: y - 22, width: PAGE_WIDTH - 90, height: 25, color: theme.primary });
  centerText(page, '【 종합 평가 및 소견 】', y - 14, font, 13, rgb(1, 1, 1));

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

  let evalY = y - 42;
  for (const line of finalEval) {
    if (line === '') { evalY -= 6; continue; }
    page.drawText(line, { x: 55, y: evalY, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    evalY -= 14;
  }

  y -= 150;

  page.drawText('발 급 일 :              년          월          일', { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  y -= 55;

  centerText(page, '재범방지교육통합센터', y, font, 15, theme.primary);
  if (sealImage) page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: y - 30, width: 65, height: 65 });

  return pdfDoc.save();
}

// ========== 메인 ==========
async function main() {
  console.log('수정된 증명서 PDF 생성 시작 (v5)...\n');

  const fontPath = path.join(__dirname, '../public/fonts/NanumGothicBold.ttf');
  const logoPath = path.join(__dirname, '../public/images/logo/logo.png');
  const sealPath = path.join(__dirname, '../public/images/seal.png');
  const outputDir = path.join(__dirname, '../public/certificates');
  const docsDir = path.join(__dirname, '../docs');

  const fontBytes = fs.readFileSync(fontPath);
  let logoBytes, sealBytes;
  try { logoBytes = fs.readFileSync(logoPath); } catch(e) {}
  try { sealBytes = fs.readFileSync(sealPath); } catch(e) {}

  const tasks = [
    { name: '재범방지교육통합센터 소견서', fn: () => generateOpinionCertificate(fontBytes, logoBytes, sealBytes) },
    { name: '재범방지교육통합센터 탄원서', fn: () => generatePetitionCertificate(fontBytes, logoBytes, sealBytes, false) },
    { name: '심리상담사 서명 탄원서', fn: () => generatePetitionCertificate(fontBytes, logoBytes, sealBytes, true) },
    { name: '심리상담 소감문', fn: () => generateReflectionCertificate(fontBytes, logoBytes, sealBytes, 'counseling') },
    { name: '이수 소감문', fn: () => generateReflectionCertificate(fontBytes, logoBytes, sealBytes, 'completion') },
    { name: '재범 위험 관리 실천일지', fn: () => generatePracticeDiary(fontBytes, logoBytes, sealBytes) },
    { name: '재범방지교육 이수자 변화 기록 보고서', fn: () => generateChangeReport(fontBytes, logoBytes, sealBytes) },
  ];

  for (const task of tasks) {
    try {
      console.log(`생성 중: ${task.name}.pdf`);
      const pdfBytes = await task.fn();
      fs.writeFileSync(path.join(outputDir, `${task.name}.pdf`), pdfBytes);
      fs.writeFileSync(path.join(docsDir, `${task.name}.pdf`), pdfBytes);
      console.log(`  ✓ 완료: ${task.name}.pdf`);
    } catch (error) {
      console.error(`  ✗ 실패: ${task.name}`, error.message);
    }
  }

  console.log('\n모든 증명서 수정 완료!');
}

main().catch(console.error);
