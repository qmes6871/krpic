const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

// A4 사이즈
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

// 색상 정의
const COLORS = {
  primary: rgb(0.1, 0.2, 0.4),      // 진한 남색
  secondary: rgb(0.3, 0.3, 0.3),    // 회색
  accent: rgb(0.8, 0.6, 0.2),       // 금색
  text: rgb(0.1, 0.1, 0.1),         // 검정
  lightGray: rgb(0.7, 0.7, 0.7),    // 연회색
  border: rgb(0.6, 0.5, 0.3),       // 테두리 금색
};

// 증명서 목록 (20개)
const certificates = [
  {
    id: 'risk-assessment',
    fileName: '재범 위험 종합 관리 평가 증명서.pdf',
    title: '재범 위험 종합 관리 평가 증명서',
    subtitle: 'Recidivism Risk Comprehensive Management Assessment Certificate',
    type: 'assessment',
    content: [
      '위 사람은 본 센터에서 실시한 재범 위험 종합 관리 평가를',
      '성실히 수행하였으며, 아래와 같이 평가 결과를 증명합니다.',
    ],
    sections: [
      { label: '평가 항목', value: '재범 위험성 평가, 심리상태 평가, 사회적응도 평가' },
      { label: '평가 결과', value: '재범 위험 관리 역량 양호' },
      { label: '권고 사항', value: '지속적인 자기관리 및 정기 상담 권장' },
    ],
  },
  {
    id: 'center-education',
    fileName: '재범방지교육통합센터 교육내용 증명서.pdf',
    title: '교육내용 증명서',
    subtitle: 'Education Content Certificate',
    type: 'education',
    content: [
      '위 사람은 재범방지교육통합센터에서 실시한',
      '재범방지교육 과정을 아래와 같이 이수하였음을 증명합니다.',
    ],
    sections: [
      { label: '교육 과정', value: '재범방지교육 통합 과정' },
      { label: '교육 내용', value: '법률 이해, 인지행동 개선, 심리상담, 재범 위험 관리' },
      { label: '교육 시간', value: '총 8시간' },
    ],
  },
  {
    id: 'center-opinion',
    fileName: '재범방지교육통합센터 소견서.pdf',
    title: '소 견 서',
    subtitle: 'Professional Opinion Statement',
    type: 'opinion',
    content: [
      '위 사람은 본 센터에서 실시한 재범방지교육 프로그램에',
      '성실히 참여하였으며, 다음과 같이 소견을 제출합니다.',
    ],
    sections: [
      { label: '교육 태도', value: '매우 성실하고 적극적인 참여 태도를 보임' },
      { label: '변화 정도', value: '자신의 행동에 대한 깊은 반성과 개선 의지 확인' },
      { label: '종합 소견', value: '재범 가능성이 낮으며, 사회 복귀 준비가 양호함' },
    ],
  },
  {
    id: 'petition',
    fileName: '재범방지교육통합센터 탄원서.pdf',
    title: '탄 원 서',
    subtitle: 'Petition Letter',
    type: 'petition',
    content: [
      '존경하는 재판장님께',
      '',
      '위 사람은 본 센터의 재범방지교육 프로그램에 참여하여',
      '진정한 반성과 함께 재범 방지를 위한 노력을 기울이고 있습니다.',
      '',
      '교육 과정에서 보여준 성실한 태도와 변화 의지를 고려하여',
      '선처를 탄원하오니 넓은 아량으로 살펴주시기 바랍니다.',
    ],
    sections: [],
  },
  {
    id: 'risk-management-diary',
    fileName: '재범 위험 관리 실천일지.pdf',
    title: '재범 위험 관리 실천일지',
    subtitle: 'Recidivism Risk Management Practice Journal',
    type: 'journal',
    content: [
      '위 사람은 본 센터에서 제공한 재범 위험 관리 프로그램을',
      '성실히 이행하며 실천일지를 작성하였음을 증명합니다.',
    ],
    sections: [
      { label: '실천 기간', value: '교육 수료일로부터 지속' },
      { label: '주요 실천 항목', value: '일일 자기점검, 위험상황 인식, 대처방안 수립' },
      { label: '이행 평가', value: '성실히 이행함' },
    ],
  },
  {
    id: 'change-report',
    fileName: '재범방지교육 이수자 변화 기록 보고서.pdf',
    title: '이수자 변화 기록 보고서',
    subtitle: 'Trainee Progress Report',
    type: 'report',
    content: [
      '위 사람의 재범방지교육 이수 과정에서 관찰된',
      '변화 사항을 아래와 같이 보고합니다.',
    ],
    sections: [
      { label: '교육 전 상태', value: '범죄 행위에 대한 인식 부족' },
      { label: '교육 중 변화', value: '점진적인 자기 인식 개선 및 반성 태도 형성' },
      { label: '교육 후 상태', value: '재범 방지 의지 확립 및 사회 복귀 준비 완료' },
    ],
  },
  {
    id: 'counselor-petition',
    fileName: '심리상담사 서명 탄원서.pdf',
    title: '심리상담사 탄원서',
    subtitle: 'Counselor Petition Letter',
    type: 'petition',
    content: [
      '존경하는 재판장님께',
      '',
      '본 심리상담사는 위 사람과의 상담 과정에서',
      '진정한 반성과 변화 의지를 확인하였습니다.',
      '',
      '상담을 통해 확인된 심리적 변화와 재범 방지 노력을 고려하여',
      '선처를 부탁드리며, 사회 복귀 기회를 주시길 탄원합니다.',
    ],
    sections: [],
  },
  {
    id: 'counseling-reflection',
    fileName: '심리상담 소감문.pdf',
    title: '심리상담 소감문',
    subtitle: 'Psychological Counseling Reflection',
    type: 'reflection',
    content: [
      '위 사람은 본 센터에서 실시한 심리상담 프로그램에 참여하여',
      '아래와 같이 소감문을 작성하였음을 증명합니다.',
    ],
    sections: [
      { label: '상담 내용', value: '심리 상태 점검, 행동 패턴 분석, 개선 방안 수립' },
      { label: '참여 태도', value: '성실하고 적극적인 참여' },
      { label: '향후 계획', value: '지속적인 자기 관리 및 정기 상담 참여' },
    ],
  },
  {
    id: 'completion-reflections',
    fileName: '이수 소감문.pdf',
    title: '이수 소감문',
    subtitle: 'Course Completion Reflection',
    type: 'reflection',
    content: [
      '위 사람은 본 센터에서 실시한 재범방지교육 프로그램을 이수하고',
      '아래와 같이 이수 소감문을 제출하였음을 증명합니다.',
    ],
    sections: [
      { label: '이수 과정', value: '재범방지교육, 인지행동개선훈련, 준법의식교육' },
      { label: '교육 소감', value: '본인의 행동에 대한 깊은 반성과 개선 의지를 다짐함' },
      { label: '향후 다짐', value: '준법 시민으로서 사회에 기여하겠음' },
    ],
  },
  {
    id: 'detailed-course-certificate',
    fileName: '재범방지교육 상세 교육과정 증명서.pdf',
    title: '상세 교육과정 증명서',
    subtitle: 'Detailed Course Certificate',
    type: 'education',
    content: [
      '위 사람은 재범방지교육통합센터에서 실시한',
      '상세 교육과정을 아래와 같이 이수하였음을 증명합니다.',
    ],
    sections: [
      { label: '1단계', value: '법률 이해 교육 (2시간) - 관련 법규 및 처벌 기준 학습' },
      { label: '2단계', value: '인지행동 개선 (2시간) - 행동 패턴 분석 및 개선' },
      { label: '3단계', value: '심리상담 (2시간) - 전문 상담사와 1:1 상담' },
      { label: '4단계', value: '재범 위험 관리 (2시간) - 위험 상황 대처법 훈련' },
    ],
  },
  {
    id: 'drunk-driving-certificate',
    fileName: '음주운전 재범방지교육 교육내용 증명서.pdf',
    title: '음주운전 재범방지교육',
    subtitle: 'DUI Prevention Education Certificate',
    type: 'education',
    subTitle2: '교육내용 증명서',
    content: [
      '위 사람은 본 센터에서 실시한 음주운전 재범방지교육을',
      '성실히 이수하였으며, 교육 내용을 아래와 같이 증명합니다.',
    ],
    sections: [
      { label: '교육 내용', value: '음주운전의 위험성, 법적 책임, 피해자 영향 이해' },
      { label: '실습 내용', value: '음주 거절 훈련, 대안 교통수단 계획 수립' },
      { label: '이수 시간', value: '총 8시간' },
    ],
  },
  {
    id: 'violence-certificate',
    fileName: '폭력범죄 재범방지교육 교육내용 증명서.pdf',
    title: '폭력범죄 재범방지교육',
    subtitle: 'Violence Prevention Education Certificate',
    subTitle2: '교육내용 증명서',
    type: 'education',
    content: [
      '위 사람은 본 센터에서 실시한 폭력범죄 재범방지교육을',
      '성실히 이수하였으며, 교육 내용을 아래와 같이 증명합니다.',
    ],
    sections: [
      { label: '교육 내용', value: '분노 조절, 갈등 해결, 비폭력 의사소통' },
      { label: '실습 내용', value: '분노 관리 기법, 스트레스 해소법 훈련' },
      { label: '이수 시간', value: '총 8시간' },
    ],
  },
  {
    id: 'property-certificate',
    fileName: '재산범죄 재범방지교육 교육내용 증명서.pdf',
    title: '재산범죄 재범방지교육',
    subtitle: 'Property Crime Prevention Education Certificate',
    subTitle2: '교육내용 증명서',
    type: 'education',
    content: [
      '위 사람은 본 센터에서 실시한 재산범죄 재범방지교육을',
      '성실히 이수하였으며, 교육 내용을 아래와 같이 증명합니다.',
    ],
    sections: [
      { label: '교육 내용', value: '재산권 이해, 범죄 결과 인식, 피해자 공감' },
      { label: '실습 내용', value: '경제 관리 훈련, 합법적 수입 계획 수립' },
      { label: '이수 시간', value: '총 8시간' },
    ],
  },
  {
    id: 'sexual-certificate',
    fileName: '성범죄 재범방지교육 교육내용 증명서.pdf',
    title: '성범죄 재범방지교육',
    subtitle: 'Sexual Offense Prevention Education Certificate',
    subTitle2: '교육내용 증명서',
    type: 'education',
    content: [
      '위 사람은 본 센터에서 실시한 성범죄 재범방지교육을',
      '성실히 이수하였으며, 교육 내용을 아래와 같이 증명합니다.',
    ],
    sections: [
      { label: '교육 내용', value: '성인지 감수성, 동의 개념, 피해자 영향 이해' },
      { label: '실습 내용', value: '건강한 관계 형성, 충동 조절 훈련' },
      { label: '이수 시간', value: '총 8시간' },
    ],
  },
  {
    id: 'gambling-certificate',
    fileName: '도박중독 재범방지교육 교육내용 증명서.pdf',
    title: '도박중독 재범방지교육',
    subtitle: 'Gambling Addiction Prevention Education Certificate',
    subTitle2: '교육내용 증명서',
    type: 'education',
    content: [
      '위 사람은 본 센터에서 실시한 도박중독 재범방지교육을',
      '성실히 이수하였으며, 교육 내용을 아래와 같이 증명합니다.',
    ],
    sections: [
      { label: '교육 내용', value: '도박 중독의 이해, 재정 관리, 회복 과정' },
      { label: '실습 내용', value: '유혹 대처 훈련, 건전한 여가 활동 계획' },
      { label: '이수 시간', value: '총 8시간' },
    ],
  },
  {
    id: 'drugs-certificate',
    fileName: '마약범죄 재범방지교육 교육내용 증명서.pdf',
    title: '마약범죄 재범방지교육',
    subtitle: 'Drug Crime Prevention Education Certificate',
    subTitle2: '교육내용 증명서',
    type: 'education',
    content: [
      '위 사람은 본 센터에서 실시한 마약범죄 재범방지교육을',
      '성실히 이수하였으며, 교육 내용을 아래와 같이 증명합니다.',
    ],
    sections: [
      { label: '교육 내용', value: '마약의 위험성, 법적 처벌, 건강 영향 이해' },
      { label: '실습 내용', value: '거절 기술 훈련, 재발 방지 계획 수립' },
      { label: '이수 시간', value: '총 8시간' },
    ],
  },
  {
    id: 'digital-certificate',
    fileName: '디지털범죄 재범방지교육 교육내용 증명서.pdf',
    title: '디지털범죄 재범방지교육',
    subtitle: 'Digital Crime Prevention Education Certificate',
    subTitle2: '교육내용 증명서',
    type: 'education',
    content: [
      '위 사람은 본 센터에서 실시한 디지털범죄 재범방지교육을',
      '성실히 이수하였으며, 교육 내용을 아래와 같이 증명합니다.',
    ],
    sections: [
      { label: '교육 내용', value: '디지털 윤리, 사이버 범죄 법률, 피해자 보호' },
      { label: '실습 내용', value: '건전한 인터넷 사용, 개인정보 보호 훈련' },
      { label: '이수 시간', value: '총 8시간' },
    ],
  },
  {
    id: 'law-compliance-certificate',
    fileName: '준법의식교육 증명서.pdf',
    title: '준법의식교육 증명서',
    subtitle: 'Legal Compliance Education Certificate',
    type: 'education',
    content: [
      '위 사람은 본 센터에서 실시한 준법의식교육을',
      '성실히 이수하였으며, 교육 내용을 아래와 같이 증명합니다.',
    ],
    sections: [
      { label: '교육 내용', value: '법률 기초, 시민 의식, 사회적 책임' },
      { label: '실습 내용', value: '법률 사례 분석, 준법 생활 계획 수립' },
      { label: '이수 시간', value: '총 8시간' },
    ],
  },
  {
    id: 'cbt-certificate',
    fileName: '인지행동개선훈련 증명서.pdf',
    title: '인지행동개선훈련 증명서',
    subtitle: 'Cognitive Behavioral Training Certificate',
    type: 'education',
    content: [
      '위 사람은 본 센터에서 실시한 인지행동개선훈련을',
      '성실히 이수하였으며, 교육 내용을 아래와 같이 증명합니다.',
    ],
    sections: [
      { label: '교육 내용', value: '인지 왜곡 파악, 행동 패턴 분석, 대안 행동 학습' },
      { label: '실습 내용', value: '자기 모니터링, 문제 해결 훈련, 역할극' },
      { label: '이수 시간', value: '총 8시간' },
    ],
  },
  {
    id: 'default-certificate',
    fileName: '인지행동개선훈련 증명서_기본.pdf',
    title: '인지행동개선훈련 증명서',
    subtitle: 'Cognitive Behavioral Training Certificate',
    type: 'education',
    content: [
      '위 사람은 본 센터에서 실시한 인지행동개선훈련을',
      '성실히 이수하였으며, 교육 내용을 아래와 같이 증명합니다.',
    ],
    sections: [
      { label: '교육 내용', value: '인지 왜곡 파악, 행동 패턴 분석, 대안 행동 학습' },
      { label: '실습 내용', value: '자기 모니터링, 문제 해결 훈련, 역할극' },
      { label: '이수 시간', value: '총 8시간' },
    ],
  },
];

async function generateCertificate(cert, fontBytes, logoBytes, sealBytes) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const koreanFont = await pdfDoc.embedFont(fontBytes);

  // 로고와 직인 이미지 임베드
  let logoImage, sealImage;
  try {
    logoImage = await pdfDoc.embedPng(logoBytes);
  } catch (e) {
    console.log('로고 임베드 실패, 건너뜀');
  }
  try {
    sealImage = await pdfDoc.embedPng(sealBytes);
  } catch (e) {
    console.log('직인 임베드 실패, 건너뜀');
  }

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // 외곽 테두리 (이중 테두리)
  page.drawRectangle({
    x: 30,
    y: 30,
    width: PAGE_WIDTH - 60,
    height: PAGE_HEIGHT - 60,
    borderColor: COLORS.border,
    borderWidth: 2,
  });
  page.drawRectangle({
    x: 40,
    y: 40,
    width: PAGE_WIDTH - 80,
    height: PAGE_HEIGHT - 80,
    borderColor: COLORS.border,
    borderWidth: 0.5,
  });

  let y = PAGE_HEIGHT - 80;

  // 로고
  if (logoImage) {
    const logoWidth = 120;
    const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
    page.drawImage(logoImage, {
      x: (PAGE_WIDTH - logoWidth) / 2,
      y: y - logoHeight,
      width: logoWidth,
      height: logoHeight,
    });
    y -= logoHeight + 20;
  }

  // 기관명
  const orgName = '재범방지교육통합센터';
  const orgNameWidth = koreanFont.widthOfTextAtSize(orgName, 14);
  page.drawText(orgName, {
    x: (PAGE_WIDTH - orgNameWidth) / 2,
    y: y,
    size: 14,
    font: koreanFont,
    color: COLORS.secondary,
  });
  y -= 50;

  // 제목
  const titleSize = cert.title.length > 15 ? 28 : 32;
  const titleWidth = koreanFont.widthOfTextAtSize(cert.title, titleSize);
  page.drawText(cert.title, {
    x: (PAGE_WIDTH - titleWidth) / 2,
    y: y,
    size: titleSize,
    font: koreanFont,
    color: COLORS.primary,
  });
  y -= 25;

  // 부제목 (영문)
  const subtitleWidth = koreanFont.widthOfTextAtSize(cert.subtitle, 10);
  page.drawText(cert.subtitle, {
    x: (PAGE_WIDTH - subtitleWidth) / 2,
    y: y,
    size: 10,
    font: koreanFont,
    color: COLORS.lightGray,
  });
  y -= 20;

  // 추가 부제목 (있는 경우)
  if (cert.subTitle2) {
    const subTitle2Width = koreanFont.widthOfTextAtSize(cert.subTitle2, 20);
    page.drawText(cert.subTitle2, {
      x: (PAGE_WIDTH - subTitle2Width) / 2,
      y: y,
      size: 20,
      font: koreanFont,
      color: COLORS.primary,
    });
    y -= 30;
  }

  y -= 30;

  // 구분선
  page.drawLine({
    start: { x: 80, y: y },
    end: { x: PAGE_WIDTH - 80, y: y },
    thickness: 1,
    color: COLORS.border,
  });
  y -= 40;

  // 이름 라벨
  const nameLabel = '성        명 :';
  page.drawText(nameLabel, {
    x: 80,
    y: y,
    size: 14,
    font: koreanFont,
    color: COLORS.text,
  });

  // 이름 입력 위치 표시 (밑줄)
  page.drawLine({
    start: { x: 180, y: y - 5 },
    end: { x: 350, y: y - 5 },
    thickness: 0.5,
    color: COLORS.lightGray,
  });
  y -= 50;

  // 본문 내용
  for (const line of cert.content) {
    if (line === '') {
      y -= 15;
      continue;
    }
    page.drawText(line, {
      x: 80,
      y: y,
      size: 13,
      font: koreanFont,
      color: COLORS.text,
    });
    y -= 25;
  }
  y -= 20;

  // 섹션들 (교육 내용, 평가 결과 등)
  if (cert.sections && cert.sections.length > 0) {
    // 섹션 배경
    const sectionHeight = cert.sections.length * 50 + 20;
    page.drawRectangle({
      x: 60,
      y: y - sectionHeight,
      width: PAGE_WIDTH - 120,
      height: sectionHeight,
      color: rgb(0.97, 0.97, 0.97),
      borderColor: COLORS.lightGray,
      borderWidth: 0.5,
    });

    y -= 25;
    for (const section of cert.sections) {
      // 라벨
      page.drawText(`■ ${section.label}`, {
        x: 80,
        y: y,
        size: 12,
        font: koreanFont,
        color: COLORS.primary,
      });
      y -= 22;

      // 값
      page.drawText(`   ${section.value}`, {
        x: 80,
        y: y,
        size: 11,
        font: koreanFont,
        color: COLORS.secondary,
      });
      y -= 30;
    }
    y -= 10;
  }

  y -= 30;

  // 날짜 라벨
  const dateLabel = '발 급 일 :                  년           월           일';
  page.drawText(dateLabel, {
    x: 80,
    y: y,
    size: 12,
    font: koreanFont,
    color: COLORS.text,
  });
  y -= 50;

  // 기관 정보 및 직인
  const orgInfo = '재범방지교육통합센터';
  const orgInfoWidth = koreanFont.widthOfTextAtSize(orgInfo, 16);
  page.drawText(orgInfo, {
    x: (PAGE_WIDTH - orgInfoWidth) / 2 - 40,
    y: y,
    size: 16,
    font: koreanFont,
    color: COLORS.primary,
  });

  // 직인
  if (sealImage) {
    const sealSize = 80;
    page.drawImage(sealImage, {
      x: (PAGE_WIDTH - orgInfoWidth) / 2 + orgInfoWidth - 20,
      y: y - 25,
      width: sealSize,
      height: sealSize,
    });
  }
  y -= 30;

  // 센터장
  const directorLabel = '센터장';
  const directorWidth = koreanFont.widthOfTextAtSize(directorLabel, 12);
  page.drawText(directorLabel, {
    x: (PAGE_WIDTH - directorWidth) / 2,
    y: y,
    size: 12,
    font: koreanFont,
    color: COLORS.secondary,
  });
  y -= 50;

  // 하단 정보
  const footerInfo = [
    '재범방지교육통합센터',
    '전화: 02-6956-8855 | 이메일: help@krpic.co.kr',
    'www.krpic.co.kr',
  ];

  page.drawLine({
    start: { x: 80, y: y },
    end: { x: PAGE_WIDTH - 80, y: y },
    thickness: 0.5,
    color: COLORS.lightGray,
  });
  y -= 20;

  for (const info of footerInfo) {
    const infoWidth = koreanFont.widthOfTextAtSize(info, 9);
    page.drawText(info, {
      x: (PAGE_WIDTH - infoWidth) / 2,
      y: y,
      size: 9,
      font: koreanFont,
      color: COLORS.lightGray,
    });
    y -= 15;
  }

  return pdfDoc.save();
}

async function main() {
  console.log('증명서 PDF 생성 시작...\n');

  // 폰트 및 이미지 로드
  const fontPath = path.join(__dirname, '../public/fonts/NanumGothicBold.ttf');
  const logoPath = path.join(__dirname, '../public/images/logo/logo.png');
  const sealPath = path.join(__dirname, '../public/images/seal.png');
  const outputDir = path.join(__dirname, '../public/certificates');

  const fontBytes = fs.readFileSync(fontPath);

  let logoBytes, sealBytes;
  try {
    logoBytes = fs.readFileSync(logoPath);
  } catch (e) {
    console.log('로고 파일 없음, 로고 없이 생성');
  }
  try {
    sealBytes = fs.readFileSync(sealPath);
  } catch (e) {
    console.log('직인 파일 없음, 직인 없이 생성');
  }

  // 출력 디렉토리 확인
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 각 증명서 생성
  for (const cert of certificates) {
    try {
      console.log(`생성 중: ${cert.fileName}`);
      const pdfBytes = await generateCertificate(cert, fontBytes, logoBytes, sealBytes);
      const outputPath = path.join(outputDir, cert.fileName);
      fs.writeFileSync(outputPath, pdfBytes);
      console.log(`  ✓ 완료: ${cert.fileName}`);
    } catch (error) {
      console.error(`  ✗ 실패: ${cert.fileName}`, error.message);
    }
  }

  console.log('\n모든 증명서 생성 완료!');
}

main().catch(console.error);
