const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  // 배경 SVG (그라데이션)
  const backgroundSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2d5a87;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>

      <!-- 장식 원들 -->
      <circle cx="100" cy="100" r="200" fill="rgba(255,255,255,0.03)"/>
      <circle cx="1100" cy="530" r="250" fill="rgba(255,255,255,0.03)"/>
      <circle cx="900" cy="50" r="150" fill="rgba(255,255,255,0.02)"/>

      <!-- 메인 텍스트 -->
      <text x="600" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white">KRPIC</text>
      <text x="600" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="rgba(255,255,255,0.9)">재범방지교육통합센터</text>

      <!-- 서브 텍스트 -->
      <text x="600" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.7)">법원 · 검찰 인정 공인 재범방지교육 전문기관</text>

      <!-- 하단 키워드 -->
      <text x="600" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.5)">음주운전 | 폭력범죄 | 성범죄 | 마약범죄 | 재산범죄 | 온라인 교육</text>

      <!-- URL -->
      <text x="600" y="580" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.6)">krpic.co.kr</text>
    </svg>
  `;

  // 출력 경로
  const outputDir = path.join(__dirname, '..', 'public', 'images');
  const outputPath = path.join(outputDir, 'og-image.png');

  // 디렉토리 확인
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 이미지 생성
  await sharp(Buffer.from(backgroundSvg))
    .png()
    .toFile(outputPath);

  console.log(`OG 이미지 생성 완료: ${outputPath}`);
}

generateOgImage().catch(console.error);
