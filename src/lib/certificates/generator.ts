import { PDFDocument, rgb, PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFile } from 'fs/promises';
import path from 'path';
import QRCode from 'qrcode';

// 직인 이미지 경로
const SEAL_IMAGE_PATH = 'public/images/seal.png';

// 사이트 URL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krpic.co.kr';

// A4 크기 (pt)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

// 수료증 타입 정의
type CertificateType = 'recidivism' | 'cbt' | 'law-compliance';

// 수료증 ID -> 타입 매핑
function getCertificateType(certificateId: string): CertificateType {
  if (certificateId === 'cbt-completion') {
    return 'cbt';
  }
  if (certificateId === 'law-compliance-completion') {
    return 'law-compliance';
  }
  return 'recidivism';
}

// 증명서 정보
interface CertificateInfo {
  subtitle: string;
  educationContent: string;
}

const CERTIFICATE_INFO: Record<string, CertificateInfo> = {
  'drunk-driving-completion': {
    subtitle: '음주운전 재범방지교육',
    educationContent: '음주운전의 위험성 인식 및 재발 방지를 위한 전문 교육 과정',
  },
  'violence-completion': {
    subtitle: '폭력범죄 재범방지교육',
    educationContent: '분노 조절 및 비폭력적 갈등 해결 능력 향상 교육 과정',
  },
  'property-completion': {
    subtitle: '재산범죄 재범방지교육',
    educationContent: '올바른 가치관 정립 및 건전한 경제윤리 함양 교육 과정',
  },
  'sexual-completion': {
    subtitle: '성범죄 재범방지교육',
    educationContent: '성인지 감수성 향상 및 건전한 성윤리 확립 교육 과정',
  },
  'gambling-completion': {
    subtitle: '도박중독 재범방지교육',
    educationContent: '도박 중독 극복 및 건전한 여가 활용 능력 배양 교육 과정',
  },
  'drugs-completion': {
    subtitle: '마약범죄 재범방지교육',
    educationContent: '약물 의존 극복 및 건강한 삶 회복을 위한 전문 교육 과정',
  },
  'digital-completion': {
    subtitle: '디지털범죄 재범방지교육',
    educationContent: '디지털 윤리 확립 및 올바른 정보 활용 능력 배양 교육 과정',
  },
  'recidivism-prevention-completion': {
    subtitle: '재범방지교육',
    educationContent: '재범 예방 및 건전한 사회 구성원으로의 복귀를 위한 종합 교육 과정',
  },
  'cbt-completion': {
    subtitle: '인지행동개선훈련',
    educationContent: '인지 왜곡 교정 및 긍정적 행동 패턴 형성을 위한 전문 훈련 과정',
  },
  'law-compliance-completion': {
    subtitle: '준법의식교육',
    educationContent: '법규 준수 의식 함양 및 책임 있는 시민 의식 확립 교육 과정',
  },
};

function centerX(textWidth: number): number {
  return (PAGE_WIDTH - textWidth) / 2;
}

// 테마 색상 정의
const THEMES: Record<CertificateType, {
  primary: [number, number, number];
  accent: [number, number, number];
}> = {
  'recidivism': {
    primary: [0.18, 0.22, 0.35],    // 다크 네이비
    accent: [0.75, 0.6, 0.35],      // 골드
  },
  'cbt': {
    primary: [0.18, 0.35, 0.38],    // 다크 틸
    accent: [0.55, 0.72, 0.65],     // 민트
  },
  'law-compliance': {
    primary: [0.3, 0.22, 0.38],     // 다크 퍼플
    accent: [0.65, 0.55, 0.72],     // 라벤더
  },
};

// 디자인 A: 재범방지교육 - 클래식 이중 테두리
function drawRecidivismStyle(page: PDFPage, theme: typeof THEMES['recidivism']) {
  const [r, g, b] = theme.primary;
  const [ar, ag, ab] = theme.accent;

  // 외곽 테두리
  page.drawRectangle({
    x: 35, y: 35,
    width: PAGE_WIDTH - 70, height: PAGE_HEIGHT - 70,
    borderColor: rgb(r, g, b),
    borderWidth: 2.5,
  });

  // 내곽 테두리
  page.drawRectangle({
    x: 45, y: 45,
    width: PAGE_WIDTH - 90, height: PAGE_HEIGHT - 90,
    borderColor: rgb(r, g, b),
    borderWidth: 0.5,
  });

  // 상단 악센트 라인
  page.drawRectangle({
    x: 80, y: PAGE_HEIGHT - 100,
    width: PAGE_WIDTH - 160, height: 1.5,
    color: rgb(ar, ag, ab),
  });

  // 하단 악센트 라인
  page.drawRectangle({
    x: 80, y: 100,
    width: PAGE_WIDTH - 160, height: 1.5,
    color: rgb(ar, ag, ab),
  });
}

// 디자인 B: 인지행동개선훈련 - 모던 상하단 바
function drawCbtStyle(page: PDFPage, theme: typeof THEMES['cbt']) {
  const [r, g, b] = theme.primary;
  const [ar, ag, ab] = theme.accent;

  // 상단 바
  page.drawRectangle({
    x: 0, y: PAGE_HEIGHT - 50,
    width: PAGE_WIDTH, height: 50,
    color: rgb(r, g, b),
  });

  // 상단 바 하단 얇은 악센트
  page.drawRectangle({
    x: 0, y: PAGE_HEIGHT - 54,
    width: PAGE_WIDTH, height: 4,
    color: rgb(ar, ag, ab),
  });

  // 하단 바
  page.drawRectangle({
    x: 0, y: 0,
    width: PAGE_WIDTH, height: 50,
    color: rgb(r, g, b),
  });

  // 하단 바 상단 얇은 악센트
  page.drawRectangle({
    x: 0, y: 50,
    width: PAGE_WIDTH, height: 4,
    color: rgb(ar, ag, ab),
  });
}

// 디자인 C: 준법의식교육 - 좌측 세로 바
function drawLawComplianceStyle(page: PDFPage, theme: typeof THEMES['law-compliance']) {
  const [r, g, b] = theme.primary;
  const [ar, ag, ab] = theme.accent;

  // 좌측 넓은 바
  page.drawRectangle({
    x: 0, y: 0,
    width: 45, height: PAGE_HEIGHT,
    color: rgb(r, g, b),
  });

  // 좌측 바 우측 얇은 악센트
  page.drawRectangle({
    x: 45, y: 0,
    width: 4, height: PAGE_HEIGHT,
    color: rgb(ar, ag, ab),
  });

  // 우측 얇은 테두리
  page.drawRectangle({
    x: PAGE_WIDTH - 35, y: 35,
    width: 0, height: PAGE_HEIGHT - 70,
    borderColor: rgb(r, g, b),
    borderWidth: 1,
  });

  // 상단 테두리
  page.drawRectangle({
    x: 49, y: PAGE_HEIGHT - 35,
    width: PAGE_WIDTH - 84, height: 0,
    borderColor: rgb(r, g, b),
    borderWidth: 1,
  });

  // 하단 테두리
  page.drawRectangle({
    x: 49, y: 35,
    width: PAGE_WIDTH - 84, height: 0,
    borderColor: rgb(r, g, b),
    borderWidth: 1,
  });
}

function applyStyle(page: PDFPage, certType: CertificateType) {
  const theme = THEMES[certType];

  switch (certType) {
    case 'recidivism':
      drawRecidivismStyle(page, theme);
      break;
    case 'cbt':
      drawCbtStyle(page, theme);
      break;
    case 'law-compliance':
      drawLawComplianceStyle(page, theme);
      break;
  }
}

// QR코드 생성 (PNG Buffer 반환)
async function generateQRCode(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    QRCode.toBuffer(url, {
      errorCorrectionLevel: 'M',
      type: 'png',
      margin: 1,
      width: 150,
      color: {
        dark: '#2D3748',
        light: '#FFFFFF',
      },
    }, (err, buffer) => {
      if (err) reject(err);
      else resolve(buffer);
    });
  });
}

// 인증 코드 생성
export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function generateProfessionalCertificate(
  certificateId: string,
  userName: string,
  completionDate: Date,
  verificationCode?: string
): Promise<Uint8Array> {
  const certType = getCertificateType(certificateId);
  const certInfo = CERTIFICATE_INFO[certificateId];
  const theme = THEMES[certType];

  if (!certInfo) {
    throw new Error(`Unknown certificate type: ${certificateId}`);
  }

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // 폰트 로드
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NanumGothicBold.ttf');
  const fontBytes = await readFile(fontPath);
  const font = await pdfDoc.embedFont(fontBytes);

  // 직인 이미지 로드
  const sealPath = path.join(process.cwd(), SEAL_IMAGE_PATH);
  const sealBytes = await readFile(sealPath);
  const sealImage = await pdfDoc.embedPng(sealBytes);

  // QR코드 생성 (인증 코드가 있는 경우)
  let qrImage = null;
  if (verificationCode) {
    const verifyUrl = `${SITE_URL}/verify/${verificationCode}`;
    const qrBuffer = await generateQRCode(verifyUrl);
    qrImage = await pdfDoc.embedPng(qrBuffer);
  }

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // 배경 스타일 적용
  applyStyle(page, certType);

  const [pr, pg, pb] = theme.primary;

  // === 콘텐츠 배치 ===
  // 좌측 바가 있는 준법의식교육은 텍스트 오프셋 필요
  const textOffsetX = certType === 'law-compliance' ? 25 : 0;

  let y = certType === 'cbt' ? PAGE_HEIGHT - 130 : PAGE_HEIGHT - 160;

  // 기관명 (상단)
  const orgName = '재범방지교육통합센터';
  const orgFontSize = 11;
  const orgWidth = font.widthOfTextAtSize(orgName, orgFontSize);
  page.drawText(orgName, {
    x: centerX(orgWidth) + textOffsetX,
    y: y,
    size: orgFontSize,
    font: font,
    color: rgb(0.5, 0.5, 0.55),
  });

  y -= 65;

  // 메인 타이틀: 수 료 증
  const title = '수 료 증';
  const titleFontSize = 46;
  const titleWidth = font.widthOfTextAtSize(title, titleFontSize);
  page.drawText(title, {
    x: centerX(titleWidth) + textOffsetX,
    y: y,
    size: titleFontSize,
    font: font,
    color: rgb(pr, pg, pb),
  });

  y -= 28;

  // 영문 타이틀
  const engTitle = 'CERTIFICATE OF COMPLETION';
  const engTitleFontSize = 9;
  const engTitleWidth = font.widthOfTextAtSize(engTitle, engTitleFontSize);
  page.drawText(engTitle, {
    x: centerX(engTitleWidth) + textOffsetX,
    y: y,
    size: engTitleFontSize,
    font: font,
    color: rgb(0.55, 0.55, 0.6),
  });

  y -= 22;

  // 부제목 (교육 종류)
  const subtitleFontSize = 13;
  const subtitleWidth = font.widthOfTextAtSize(certInfo.subtitle, subtitleFontSize);
  page.drawText(certInfo.subtitle, {
    x: centerX(subtitleWidth) + textOffsetX,
    y: y,
    size: subtitleFontSize,
    font: font,
    color: rgb(0.45, 0.45, 0.5),
  });

  y -= 75;

  // 성명 라벨
  const nameLabel = '성  명';
  const nameLabelFontSize = 10;
  const nameLabelWidth = font.widthOfTextAtSize(nameLabel, nameLabelFontSize);
  page.drawText(nameLabel, {
    x: centerX(nameLabelWidth) + textOffsetX,
    y: y,
    size: nameLabelFontSize,
    font: font,
    color: rgb(0.55, 0.55, 0.6),
  });

  y -= 38;

  // 이름 (큰 글씨)
  const nameFontSize = 34;
  const nameWidth = font.widthOfTextAtSize(userName, nameFontSize);
  page.drawText(userName, {
    x: centerX(nameWidth) + textOffsetX,
    y: y,
    size: nameFontSize,
    font: font,
    color: rgb(0.12, 0.12, 0.15),
  });

  y -= 12;

  // 이름 밑줄
  const underlineWidth = Math.max(nameWidth + 50, 160);
  page.drawRectangle({
    x: centerX(underlineWidth) + textOffsetX,
    y: y,
    width: underlineWidth,
    height: 1,
    color: rgb(pr, pg, pb),
    opacity: 0.5,
  });

  y -= 65;

  // 본문
  const bodyFontSize = 13;
  const bodyLine1 = '위 사람은 본 센터에서 실시한';
  const bodyLine2 = `${certInfo.subtitle} 과정을 성실히 이수하였기에`;
  const bodyLine3 = '이 증서를 수여합니다.';

  const line1Width = font.widthOfTextAtSize(bodyLine1, bodyFontSize);
  page.drawText(bodyLine1, {
    x: centerX(line1Width) + textOffsetX,
    y: y,
    size: bodyFontSize,
    font: font,
    color: rgb(0.3, 0.3, 0.35),
  });

  y -= 26;

  const line2Width = font.widthOfTextAtSize(bodyLine2, bodyFontSize);
  page.drawText(bodyLine2, {
    x: centerX(line2Width) + textOffsetX,
    y: y,
    size: bodyFontSize,
    font: font,
    color: rgb(0.3, 0.3, 0.35),
  });

  y -= 26;

  const line3Width = font.widthOfTextAtSize(bodyLine3, bodyFontSize);
  page.drawText(bodyLine3, {
    x: centerX(line3Width) + textOffsetX,
    y: y,
    size: bodyFontSize,
    font: font,
    color: rgb(0.3, 0.3, 0.35),
  });

  y -= 45;

  // 교육 내용 설명
  const descFontSize = 9;
  const descWidth = font.widthOfTextAtSize(certInfo.educationContent, descFontSize);
  page.drawText(certInfo.educationContent, {
    x: centerX(descWidth) + textOffsetX,
    y: y,
    size: descFontSize,
    font: font,
    color: rgb(0.55, 0.55, 0.6),
  });

  y -= 55;

  // 날짜
  const year = completionDate.getFullYear();
  const month = completionDate.getMonth() + 1;
  const day = completionDate.getDate();
  const dateStr = `${year}년 ${month}월 ${day}일`;
  const dateFontSize = 14;
  const dateWidth = font.widthOfTextAtSize(dateStr, dateFontSize);
  page.drawText(dateStr, {
    x: centerX(dateWidth) + textOffsetX,
    y: y,
    size: dateFontSize,
    font: font,
    color: rgb(0.2, 0.2, 0.25),
  });

  y -= 50;

  // 하단 기관명
  const bottomOrgFontSize = 16;
  const bottomOrgWidth = font.widthOfTextAtSize(orgName, bottomOrgFontSize);
  page.drawText(orgName, {
    x: centerX(bottomOrgWidth) + textOffsetX,
    y: y,
    size: bottomOrgFontSize,
    font: font,
    color: rgb(pr, pg, pb),
  });

  // 직인 이미지 추가 (기관명 오른쪽에 겹치도록)
  const sealSize = 70;
  const sealX = centerX(bottomOrgWidth) + textOffsetX + bottomOrgWidth + 5;
  const sealY = y - 15;
  page.drawImage(sealImage, {
    x: sealX,
    y: sealY,
    width: sealSize,
    height: sealSize,
    opacity: 0.85,
  });

  // QR코드 추가 (우측 하단)
  if (qrImage && verificationCode) {
    const qrSize = 60;
    // QR코드 위치 - 디자인 타입에 따라 조정
    let qrX = PAGE_WIDTH - qrSize - 55;
    let qrY = 55;

    if (certType === 'cbt') {
      qrY = 60; // 하단 바 위에
    } else if (certType === 'law-compliance') {
      qrX = PAGE_WIDTH - qrSize - 45;
    }

    // QR코드 위 안내 문구
    const guideText1 = '수료증 진위확인';
    const guideText2 = 'QR코드를 스캔하세요';
    const guideFontSize = 6;
    const guide1Width = font.widthOfTextAtSize(guideText1, guideFontSize);
    const guide2Width = font.widthOfTextAtSize(guideText2, guideFontSize);

    page.drawText(guideText1, {
      x: qrX + (qrSize - guide1Width) / 2,
      y: qrY + qrSize + 16,
      size: guideFontSize,
      font: font,
      color: rgb(0.4, 0.4, 0.45),
    });

    page.drawText(guideText2, {
      x: qrX + (qrSize - guide2Width) / 2,
      y: qrY + qrSize + 6,
      size: guideFontSize,
      font: font,
      color: rgb(0.55, 0.55, 0.6),
    });

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    });

    // 인증번호 텍스트
    const codeText = verificationCode;
    const codeFontSize = 6;
    const codeWidth = font.widthOfTextAtSize(codeText, codeFontSize);
    page.drawText(codeText, {
      x: qrX + (qrSize - codeWidth) / 2,
      y: qrY - 10,
      size: codeFontSize,
      font: font,
      color: rgb(0.5, 0.5, 0.55),
    });
  }

  return pdfDoc.save();
}

export function isAutoGeneratedCertificate(certificateId: string): boolean {
  return certificateId in CERTIFICATE_INFO;
}

export function getCertificateSubtitle(certificateId: string): string {
  return CERTIFICATE_INFO[certificateId]?.subtitle || '';
}
