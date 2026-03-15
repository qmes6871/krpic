// 준법생활 계획서 PDF 생성
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

// 고정된 이름/날짜 위치 (PDF 좌표계 - 좌하단 기준)
const NAME_Y = 580;  // 상단에서 약 262pt
const DATE_Y = 170;  // 하단에서 약 170pt
const NAME_X = 155;
const DATE_X = 155;

// 테마 색상
const THEME = {
  primary: rgb(0.2, 0.3, 0.45),
  secondary: rgb(0.4, 0.5, 0.6),
  border: rgb(0.25, 0.40, 0.55),
  accent: rgb(0.7, 0.65, 0.55),
  bg: rgb(0.96, 0.97, 0.98),
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

async function generateLifePlan(pdfDoc, font, logoImage, sealImage) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // 테두리
  page.drawRectangle({
    x: 28, y: 28,
    width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56,
    borderColor: THEME.border,
    borderWidth: 2
  });
  page.drawRectangle({
    x: 35, y: 35,
    width: PAGE_WIDTH - 70, height: PAGE_HEIGHT - 70,
    borderColor: THEME.accent,
    borderWidth: 0.5
  });

  let y = PAGE_HEIGHT - 70;

  // 로고
  if (logoImage) {
    const logoW = 80, logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: (PAGE_WIDTH - logoW) / 2, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  centerText(page, '재범방지교육통합센터', y, font, 11, THEME.secondary);
  y -= 50;

  centerText(page, '준법생활 계획서', y, font, 28, THEME.primary);
  y -= 40;

  // 성명 라벨과 밑줄 (고정 위치)
  page.drawText('성        명 :', { x: 65, y: NAME_Y, size: 13, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: NAME_X, y: NAME_Y - 3 }, end: { x: 380, y: NAME_Y - 3 }, thickness: 0.5, color: THEME.secondary });

  y = NAME_Y - 35;

  // 인트로 문구
  const intro = '위 사람은 본 센터에서 실시한 재범방지교육 프로그램을 이수하고, 아래와 같이 준법생활 실천 계획을 수립하였음을 확인합니다.';
  const introLines = wrapText(intro, 58);
  for (const line of introLines) {
    page.drawText(line, { x: 60, y, size: 10, font, color: rgb(0.12, 0.12, 0.12) });
    y -= 18;
  }
  y -= 15;

  // 계획 항목들
  const planItems = [
    {
      title: '1. 자기 성찰 및 반성',
      content: '이번 사건을 계기로 저의 행동이 사회와 타인에게 미친 영향을 깊이 반성하였습니다. 앞으로는 모든 행동에 앞서 그 결과를 신중하게 생각하고, 법과 사회 규범을 존중하는 삶을 살겠습니다.'
    },
    {
      title: '2. 구체적 실천 계획',
      content: '• 스트레스 상황에서 건강한 방식으로 대처하기\n• 어려운 상황에서 전문가나 가족에게 도움 요청하기\n• 정기적으로 자기 점검 및 반성의 시간 갖기\n• 긍정적인 대인관계 유지 및 발전시키기'
    },
    {
      title: '3. 사회 기여 계획',
      content: '건전한 사회 구성원으로서 책임을 다하고, 가능하다면 비슷한 어려움을 겪는 이들에게 제 경험을 바탕으로 도움이 되고자 합니다.'
    },
    {
      title: '4. 다짐',
      content: '다시는 같은 실수를 반복하지 않을 것을 굳게 다짐합니다. 법을 준수하고 타인을 존중하며, 성실하게 살아가겠습니다. 이 계획서에 적힌 내용을 실천하기 위해 최선을 다하겠습니다.'
    }
  ];

  for (const item of planItems) {
    // 제목 배경
    page.drawRectangle({
      x: 52, y: y - 2,
      width: PAGE_WIDTH - 104, height: 18,
      color: THEME.bg
    });
    page.drawText(item.title, { x: 58, y, size: 10, font, color: THEME.primary });
    y -= 22;

    // 내용
    const contentLines = item.content.split('\n');
    for (const cl of contentLines) {
      const wrappedLines = wrapText(cl, 62);
      for (const line of wrappedLines) {
        page.drawText(line, { x: 58, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
        y -= 15;
      }
    }
    y -= 12;
  }

  // 발급일 (고정 위치)
  page.drawText('발 급 일 :', { x: 65, y: DATE_Y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawLine({ start: { x: DATE_X, y: DATE_Y - 3 }, end: { x: 370, y: DATE_Y - 3 }, thickness: 0.5, color: THEME.secondary });

  // 서명 영역
  const signY = DATE_Y - 50;
  centerText(page, '재범방지교육통합센터', signY, font, 15, THEME.primary);
  if (sealImage) {
    page.drawImage(sealImage, { x: PAGE_WIDTH / 2 + 55, y: signY - 30, width: 65, height: 65 });
  }
}

async function main() {
  console.log('준법생활 계획서 PDF 생성...\n');

  const fontPath = path.join(__dirname, '../public/fonts/NanumGothicBold.ttf');
  const logoPath = path.join(__dirname, '../public/images/logo/logo.png');
  const sealPath = path.join(__dirname, '../public/images/seal.png');
  const outputDir = path.join(__dirname, '../public/certificates');
  const docsDir = path.join(__dirname, '../docs');

  const fontBytes = fs.readFileSync(fontPath);
  let logoBytes, sealBytes;
  try { logoBytes = fs.readFileSync(logoPath); } catch(e) {}
  try { sealBytes = fs.readFileSync(sealPath); } catch(e) {}

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);

  let logoImage, sealImage;
  if (logoBytes) try { logoImage = await pdfDoc.embedPng(logoBytes); } catch(e) {}
  if (sealBytes) try { sealImage = await pdfDoc.embedPng(sealBytes); } catch(e) {}

  await generateLifePlan(pdfDoc, font, logoImage, sealImage);

  const pdfBytes = await pdfDoc.save();

  const fileName = '준법생활 계획서.pdf';
  fs.writeFileSync(path.join(outputDir, fileName), pdfBytes);
  fs.writeFileSync(path.join(docsDir, fileName), pdfBytes);

  console.log(`✓ 생성 완료: ${fileName}`);
  console.log(`\n이름 위치: x=${NAME_X}, y=${NAME_Y} (PDF 좌표)`);
  console.log(`날짜 위치: x=${DATE_X}, y=${DATE_Y} (PDF 좌표)`);
  console.log(`\ncertificateTemplates.ts 업데이트 필요:`);
  console.log(`  namePosition: { x: ${NAME_X}, y: ${Math.round(PAGE_HEIGHT - NAME_Y)}, fontSize: 14 }`);
  console.log(`  datePosition: { x: ${DATE_X}, y: ${Math.round(PAGE_HEIGHT - DATE_Y)}, fontSize: 12 }`);
}

main().catch(console.error);
