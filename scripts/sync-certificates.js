// 포함 항목(features)을 기반으로 발급 증명서(certificates)를 자동 매핑하는 스크립트
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// .env.local 파일 직접 파싱
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 증명서 템플릿
const allCertificates = [
  // 기본 증명서
  { id: 'default-completion', name: '인지행동개선훈련 수료증' },
  { id: 'default-certificate', name: '인지행동개선훈련 증명서' },

  // 카테고리별 수료증/증명서
  { id: 'drunk-driving-completion', name: '음주운전 재범방지교육 수료증' },
  { id: 'drunk-driving-certificate', name: '음주운전 재범방지교육 교육내용 증명서' },
  { id: 'violence-completion', name: '폭력범죄 재범방지교육 수료증' },
  { id: 'violence-certificate', name: '폭력범죄 재범방지교육 교육내용 증명서' },
  { id: 'property-completion', name: '재산범죄 재범방지교육 수료증' },
  { id: 'property-certificate', name: '재산범죄 재범방지교육 교육내용 증명서' },
  { id: 'sexual-completion', name: '성범죄 재범방지교육 수료증' },
  { id: 'sexual-certificate', name: '성범죄 재범방지교육 교육내용 증명서' },
  { id: 'gambling-completion', name: '도박중독 재범방지교육 수료증' },
  { id: 'gambling-certificate', name: '도박중독 재범방지교육 교육내용 증명서' },
  { id: 'drugs-completion', name: '마약범죄 재범방지교육 수료증' },
  { id: 'drugs-certificate', name: '마약범죄 재범방지교육 교육내용 증명서' },
  { id: 'digital-completion', name: '디지털범죄 재범방지교육 수료증' },
  { id: 'digital-certificate', name: '디지털범죄 재범방지교육 교육내용 증명서' },
  { id: 'law-compliance-completion', name: '준법의식교육 수료증' },
  { id: 'law-compliance-certificate', name: '준법의식교육 증명서' },
  { id: 'cbt-completion', name: '인지행동개선훈련 수료증' },
  { id: 'cbt-certificate', name: '인지행동개선훈련 증명서' },
  { id: 'recidivism-prevention-completion', name: '재범방지교육 수료증' },

  // 공통 증명서
  { id: 'risk-assessment', name: '재범 위험 종합 관리 평가 증명서' },
  { id: 'center-education', name: '재범방지교육통합센터 교육내용 증명서' },
  { id: 'center-opinion', name: '재범방지교육통합센터 소견서' },
  { id: 'petition', name: '재범방지교육통합센터 탄원서' },
  { id: 'reflection', name: '반성문' },
  { id: 'lawyer-consultation', name: '변호사 상담증명서' },
  { id: 'counselor-opinion', name: '심리상담사 소견서' },
  { id: 'life-plan', name: '준법생활 계획서' },
  { id: 'risk-management-diary', name: '재범 위험 관리 실천일지' },
  { id: 'change-report', name: '재범방지교육 이수자 변화 기록 보고서' },
  { id: 'counselor-petition', name: '심리상담사 서명 탄원서' },
  { id: 'counseling-reflection', name: '심리상담 소감문' },
  { id: 'completion-reflections', name: '이수 소감문' },
  { id: 'detailed-course-certificate', name: '재범방지교육 상세 교육과정 증명서' },

  // 가이드 문서
  { id: 'completion-guide', name: '이수 소감문 가이드' },
  { id: 'counseling-guide', name: '심리상담 소감문 가이드' },
  { id: 'reflection-guide', name: '반성문 탄원서 작성 가이드' },
  { id: 'reflection-writing-guide', name: '효과적인 반성문 작성 가이드 양식' },
  { id: 'petition-writing-guide', name: '효과적인 탄원서 작성 가이드 양식' },
];

// features 텍스트 → 증명서 ID 직접 매핑
const directMapping = {
  // 수료증 관련
  '재범방지교육 수료증': null, // 카테고리별로 다름
  '인지행동개선훈련 교육 수료증': 'cbt-completion',
  '인지행동개선훈련 수료증': 'cbt-completion',
  '준법의식교육 수료증': 'law-compliance-completion',

  // 증명서 관련
  '재범방지교육통합센터 교육내용 증명서': 'center-education',
  '재범방지교육 상세 교육과정 증명서': 'detailed-course-certificate',
  '인지행동개선훈련 상세 교육과정 증명서': 'cbt-certificate',
  '준법의식교육 상세 교육과정 증명서': 'law-compliance-certificate',
  '재범 위험 종합 관리 평가 증명서': 'risk-assessment',
  '인지행동개선훈련 증명서': 'cbt-certificate',
  '준법의식교육 증명서': 'law-compliance-certificate',

  // 실천일지/보고서
  '재범 위험 관리 실천일지': 'risk-management-diary',
  '재범방지교육 이수자 변화 기록 보고서': 'change-report',

  // 소견서/탄원서 관련
  '재범방지교육통합센터 소견서': 'center-opinion',
  '재범방지교육통합센터 탄원서': 'petition',
  '재범방지교육통합센터 서명 탄원서 1부': 'petition',
  '재범방지교육통합센터 서명 소견서 1부': 'center-opinion',
  '심리상담사 종합 소견서': 'counselor-opinion',
  '심리상담사 소견서': 'counselor-opinion',
  '심리상담사 서명 탄원서 1부': 'counselor-petition',

  // 변호사 관련
  '변호사 상담증명서': 'lawyer-consultation',
  '변호사 상담 증명서 [위법공포 내용 첨부]': 'lawyer-consultation',

  // 계획서/반성문 관련
  '재범방지를 위한 준법생활 계획서': 'life-plan',
  '준법생활 계획서': 'life-plan',
  '반성문': 'reflection',
  '반성문 1회 대필 (A4 3페이지 분량)': 'reflection',

  // 가이드 관련
  '효과적인 반성문 작성 가이드 양식': 'reflection-writing-guide',
  '효과적인 탄원서 작성 가이드 양식': 'petition-writing-guide',
  '반성문 탄원서 작성 가이드': 'reflection-guide',
  '이수 소감문 가이드': 'completion-guide',
  '심리상담 소감문 가이드': 'counseling-guide',

  // 소감문 관련
  '심리상담 소감문 제출 (대필 양식 제공)': 'counseling-reflection',
  '재범방지교육·인지행동개선·준법의식 각 이수 소감문 3부': 'completion-reflections',

  // 제외 항목 (null이 아닌 false로 명시적 제외)
  '형사사건 전문 변호사와 유선 상담': false,
  '경찰·검찰·법원 단계별 감형 및 대처 노하우 채팅 상담 (사건 종결까지)': false,
};

// 카테고리별 수료증 ID
const categoryCompletionIds = {
  'drunk-driving': 'drunk-driving-completion',
  'violence': 'violence-completion',
  'property': 'property-completion',
  'sexual': 'sexual-completion',
  'gambling': 'gambling-completion',
  'drugs': 'drugs-completion',
  'digital': 'digital-completion',
  'law-compliance': 'law-compliance-completion',
  'detention': 'recidivism-prevention-completion',
};

function findCertificateId(featureName, category) {
  // 직접 매핑 먼저 확인
  if (directMapping[featureName] !== undefined) {
    if (directMapping[featureName] === false) {
      // 명시적 제외 항목
      return null;
    }
    if (directMapping[featureName] === null) {
      // 카테고리별 수료증
      return categoryCompletionIds[category] || 'cbt-completion';
    }
    return directMapping[featureName];
  }

  // 정확한 이름 매칭
  const exactMatch = allCertificates.find(cert => cert.name === featureName);
  if (exactMatch) {
    return exactMatch.id;
  }

  // 부분 매칭 (포함 관계)
  for (const cert of allCertificates) {
    if (cert.name.includes(featureName) || featureName.includes(cert.name)) {
      return cert.id;
    }
  }

  // "수료증"이 포함된 경우 카테고리별 수료증 반환
  if (featureName.includes('수료증')) {
    return categoryCompletionIds[category] || 'cbt-completion';
  }

  return null;
}

async function syncCertificates() {
  console.log('코스 목록 조회 중...');

  const { data: courses, error } = await supabase
    .from('courses')
    .select('*');

  if (error) {
    console.error('코스 조회 실패:', error);
    return;
  }

  console.log(`총 ${courses.length}개의 코스 발견\n`);

  for (const course of courses) {
    const features = course.features || [];

    if (features.length === 0) {
      console.log(`[${course.title}] - 포함 항목 없음, 스킵`);
      continue;
    }

    console.log(`\n[${course.title}] (카테고리: ${course.category})`);
    console.log(`  포함 항목: ${features.length}개`);

    const certificateIds = [];

    for (const feature of features) {
      const cleanFeature = feature.replace(/^[-•]\s*/, '').trim();
      const certId = findCertificateId(cleanFeature, course.category);

      if (certId) {
        certificateIds.push(certId);
        const certName = allCertificates.find(c => c.id === certId)?.name || certId;
        console.log(`    ✓ "${cleanFeature}" → ${certName}`);
      } else if (directMapping[cleanFeature] === false) {
        console.log(`    ✗ "${cleanFeature}" → 제외 (서비스 항목)`);
      } else {
        console.log(`    ? "${cleanFeature}" → 매칭 없음`);
      }
    }

    // 중복 제거
    const uniqueCertIds = [...new Set(certificateIds)];

    if (uniqueCertIds.length > 0) {
      console.log(`  → 총 ${uniqueCertIds.length}개 증명서 설정`);

      const { error: updateError } = await supabase
        .from('courses')
        .update({ certificates: uniqueCertIds })
        .eq('id', course.id);

      if (updateError) {
        console.log(`  ✗ 업데이트 실패: ${updateError.message}`);
      } else {
        console.log(`  ✓ 업데이트 완료`);
      }
    } else {
      console.log(`  → 매칭되는 증명서 없음`);
    }
  }

  console.log('\n완료!');
}

syncCertificates();
