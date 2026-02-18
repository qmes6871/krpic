// 심리상담사 서명 탄원서 PDF 생성 - 1페이지 버전
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

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

async function generateCounselorPetition() {
  console.log('심리상담사 서명 탄원서 PDF 생성 중 (1페이지 버전)...\n');

  const fontPath = path.join(__dirname, '../public/fonts/NanumGothicBold.ttf');
  const sealPath = path.join(__dirname, '../other/김태훈 심리상담사 직인.png');
  const outputDir = path.join(__dirname, '../public/certificates');
  const docsDir = path.join(__dirname, '../docs');

  const fontBytes = fs.readFileSync(fontPath);
  let sealBytes;
  try { sealBytes = fs.readFileSync(sealPath); } catch(e) { console.log('직인 이미지를 찾을 수 없습니다:', sealPath); }

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);

  let sealImage;
  if (sealBytes) {
    try { sealImage = await pdfDoc.embedPng(sealBytes); } catch(e) {
      console.log('PNG 임베드 실패, JPG로 시도...');
      try { sealImage = await pdfDoc.embedJpg(sealBytes); } catch(e2) {
        console.log('이미지 임베드 실패:', e2.message);
      }
    }
  }

  const theme = {
    primary: rgb(0.35, 0.25, 0.2),
    secondary: rgb(0.5, 0.4, 0.35),
    border: rgb(0.45, 0.35, 0.25),
  };

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 25, y: 25, width: PAGE_WIDTH - 50, height: PAGE_HEIGHT - 50, borderColor: theme.border, borderWidth: 2 });

  let y = PAGE_HEIGHT - 50;

  // 제목
  centerText(page, '심리상담사', y, font, 10, theme.secondary);
  y -= 35;

  centerText(page, '탄  원  서', y, font, 24, theme.primary);
  y -= 30;

  page.drawLine({ start: { x: 45, y }, end: { x: PAGE_WIDTH - 45, y }, thickness: 1, color: theme.border });
  y -= 22;

  // 피고인 성명 (고정 위치: y = 705)
  const nameY = y;
  page.drawText('피고인 성명 :', { x: 50, y: nameY, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 140, y: nameY - 3 }, end: { x: 350, y: nameY - 3 }, thickness: 0.5, color: theme.secondary });
  y -= 50; // 상단 여백 추가

  // 탄원서 내용
  const petitionParagraphs = [
    '저는 피고인과 일정 기간 심리상담을 진행해 온 상담사입니다. 전문 상담 자격을 갖춘 상담사로서, 피고인의 심리 상태와 상담 과정에서 확인된 변화에 대해 객관적인 의견을 전달드리고자 본 탄원서를 작성합니다.',
    '피고인은 상담 초기부터 자신의 행위에 대한 책임을 회피하기보다, 그 결과와 영향에 대해 진지하게 직면하려는 태도를 보였습니다. 자신의 판단과 선택이 초래한 결과를 인정하며, 그로 인해 주변 사람들과 사회에 미친 영향을 깊이 고민하는 모습을 여러 차례 확인할 수 있었습니다. 이는 단순한 형식적 반성이 아니라, 감정적 수용과 인지적 성찰이 함께 이루어지는 과정으로 판단됩니다.',
    '상담 과정에서 피고인은 사건과 관련된 당시의 심리 상태, 사고 과정, 감정 반응을 구체적으로 되짚어 보았습니다. 자신의 판단 오류와 감정 조절의 미숙함을 인정하고, 유사한 상황이 다시 발생하더라도 동일한 선택을 하지 않기 위해 어떤 준비와 노력이 필요한지 스스로 정리하는 모습을 보였습니다.',
    '특히 인상 깊었던 점은 책임을 외부 환경이나 타인에게 전가하기보다, 자신의 선택에 초점을 맞추어 반성하려는 태도였습니다. 이는 재발 방지를 위한 심리적 기반이 형성되고 있음을 보여주는 중요한 요소라고 판단됩니다.',
    '또한 피고인은 재발 방지를 위한 구체적인 실천 계획을 세우고 있으며, 필요 시 전문 기관 연계 상담 및 지속적인 심리 관리에 성실히 참여하겠다는 의지를 명확히 밝혔습니다. 단순한 다짐 수준을 넘어, 생활 환경 조정과 자기 점검 계획까지 포함하여 현실적인 변화 노력을 이어가고 있습니다.',
    '상담을 진행하는 동안 피고인의 태도는 일관되게 성실하였으며, 상담 내용에 대해 깊이 숙고하고 실질적인 행동 변화를 모색하려는 모습을 확인할 수 있었습니다. 감정 조절 능력 향상과 자기 통제력 강화에 대한 동기 또한 분명하게 관찰되었습니다.',
    '전문 상담사의 관점에서 볼 때, 피고인은 자신의 잘못을 인식하고 이를 교정하려는 내적 동기가 형성되어 있으며, 지속적인 관리와 노력이 병행될 경우 건전한 사회 구성원으로서의 역할을 충분히 수행할 가능성이 있다고 판단됩니다.',
    '부디 재판장님께서 피고인의 현재 심리적 변화와 재발 방지를 위한 노력, 그리고 향후 개선 가능성을 깊이 살펴 주시어 선처를 베풀어 주시기를 간곡히 요청드립니다.',
  ];

  const fontSize = 10.5;
  const lineHeight = 16;
  const charsPerLine = 55;
  const paragraphGap = 7;

  for (const paragraph of petitionParagraphs) {
    const lines = wrapText(paragraph, charsPerLine);
    for (const line of lines) {
      page.drawText(line, { x: 45, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
      y -= lineHeight;
    }
    y -= paragraphGap;
  }

  // 발급일 (고정 위치)
  const dateY = 95;
  page.drawText('발 급 일 :', { x: 50, y: dateY, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: 125, y: dateY - 3 }, end: { x: 330, y: dateY - 3 }, thickness: 0.5, color: theme.secondary });

  // 심리상담사 서명 영역
  const signY = dateY - 35;
  centerText(page, '심리상담사', signY, font, 12, theme.primary);

  // 성명: 김태훈
  const counselorNameY = signY - 22;
  page.drawText('성명: 김태훈', { x: PAGE_WIDTH / 2 - 50, y: counselorNameY, size: 11, font, color: rgb(0.1, 0.1, 0.1) });

  // 직인 이미지
  if (sealImage) {
    const sealWidth = 50;
    const sealHeight = 50;
    page.drawImage(sealImage, {
      x: PAGE_WIDTH / 2 + 35,
      y: counselorNameY - 15,
      width: sealWidth,
      height: sealHeight
    });
  } else {
    page.drawText('(인)', { x: PAGE_WIDTH / 2 + 40, y: counselorNameY, size: 10, font, color: theme.secondary });
  }

  // PDF 저장
  const pdfBytes = await pdfDoc.save();

  const outputPath1 = path.join(outputDir, '심리상담사 서명 탄원서.pdf');
  const outputPath2 = path.join(docsDir, '심리상담사 서명 탄원서.pdf');

  fs.writeFileSync(outputPath1, pdfBytes);
  fs.writeFileSync(outputPath2, pdfBytes);

  console.log('✓ 생성 완료:', outputPath1);
  console.log('✓ 생성 완료:', outputPath2);

  // 좌표 정보 출력 (certificateTemplates.ts 업데이트용)
  console.log('\n=== certificateTemplates.ts 좌표 정보 ===');
  console.log(`피고인 성명 위치 (PDF-lib): x=140, y=${nameY}`);
  console.log(`발급일 위치 (PDF-lib): x=125, y=${dateY}`);
  console.log(`\n좌상단 기준 변환 (PAGE_HEIGHT=${PAGE_HEIGHT}):`);
  console.log(`  namePosition: { x: 140, y: ${Math.round(PAGE_HEIGHT - nameY)}, fontSize: 12 }`);
  console.log(`  datePosition: { x: 125, y: ${Math.round(PAGE_HEIGHT - dateY)}, fontSize: 11 }`);
}

generateCounselorPetition().catch(console.error);
