// 증명서 템플릿 데이터
export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  fileName: string;
  // PDF 내에서 이름과 날짜가 들어갈 위치 (pt 단위, 좌상단 기준)
  namePosition: { x: number; y: number; fontSize: number };
  datePosition: { x: number; y: number; fontSize: number };
  // 가이드 문서인지 여부 (가이드 문서는 이름/날짜 삽입 없이 그대로 제공)
  isGuide?: boolean;
  // 편집 가능한 문서인지 여부 (반성문, 계획서 등 사용자가 작성해야 하는 문서)
  isEditable?: boolean;
}

// 공통 증명서 (모든 코스에서 사용)
export const commonCertificates: CertificateTemplate[] = [
  {
    id: 'recidivism-prevention-completion',
    name: '재범방지교육 수료증',
    description: '재범방지교육 수료증',
    fileName: '재범방지교육 수료증.pdf',
    namePosition: { x: 70, y: 590, fontSize: 26 },
    datePosition: { x: 108, y: 260, fontSize: 14 },
  },
  {
    id: 'risk-assessment',
    name: '재범 위험 종합 관리 평가 증명서',
    description: '재범 위험성을 종합적으로 평가한 증명서',
    fileName: '재범 위험 종합 관리 평가 증명서.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'center-education',
    name: '재범방지교육통합센터 교육내용 증명서',
    description: '교육 내용을 증명하는 서류',
    fileName: '재범방지교육통합센터 교육내용 증명서.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'center-opinion',
    name: '재범방지교육통합센터 소견서',
    description: '교육 이수에 대한 전문가 소견서',
    fileName: '재범방지교육통합센터 소견서.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'petition',
    name: '재범방지교육통합센터 탄원서',
    description: '재판부 제출용 탄원서',
    fileName: '재범방지교육통합센터 탄원서.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'reflection',
    name: '반성문',
    description: '교육 이수 후 작성하는 반성문 양식',
    fileName: '반성문.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
    isEditable: true,
  },
  {
    id: 'lawyer-consultation',
    name: '변호사 상담증명서',
    description: '변호사 상담을 받은 증명서',
    fileName: '변호사 상담증명서.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'counselor-opinion',
    name: '심리상담사 소견서',
    description: '심리상담사의 전문 소견서',
    fileName: '심리상담사 소견서.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'life-plan',
    name: '준법생활 계획서',
    description: '준법 생활을 위한 계획서 양식',
    fileName: '준법생활 계획서.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
    isEditable: true,
  },
  {
    id: 'risk-management-diary',
    name: '재범 위험 관리 실천일지',
    description: '재범 위험 관리를 위한 실천일지',
    fileName: '재범 위험 관리 실천일지.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'change-report',
    name: '재범방지교육 이수자 변화 기록 보고서',
    description: '교육 이수자의 변화를 기록한 보고서',
    fileName: '재범방지교육 이수자 변화 기록 보고서.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'counselor-petition',
    name: '심리상담사 서명 탄원서',
    description: '심리상담사가 서명한 탄원서',
    fileName: '심리상담사 서명 탄원서.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'counseling-reflection',
    name: '심리상담 소감문',
    description: '심리상담 소감문 (대필 양식 제공)',
    fileName: '심리상담 소감문.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'completion-reflections',
    name: '이수 소감문',
    description: '재범방지교육·인지행동개선·준법의식 각 이수 소감문',
    fileName: '이수 소감문.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
  {
    id: 'detailed-course-certificate',
    name: '재범방지교육 상세 교육과정 증명서',
    description: '재범방지교육 상세 교육과정 증명서',
    fileName: '재범방지교육 상세 교육과정 증명서.pdf',
    namePosition: { x: 70, y: 645, fontSize: 22 },
    datePosition: { x: 108, y: 222, fontSize: 14 },
  },
];

// 가이드 문서 (이름/날짜 삽입 없이 그대로 제공)
export const guideCertificates: CertificateTemplate[] = [
  {
    id: 'completion-guide',
    name: '이수 소감문 가이드',
    description: '이수 소감문 작성 가이드라인 및 예시',
    fileName: '이수 소감문 가이드.pdf',
    namePosition: { x: 0, y: 0, fontSize: 0 },
    datePosition: { x: 0, y: 0, fontSize: 0 },
    isGuide: true,
  },
  {
    id: 'counseling-guide',
    name: '심리상담 소감문 가이드',
    description: '심리상담 소감문 작성 가이드라인 및 예시',
    fileName: '심리상담 소감문 가이드.pdf',
    namePosition: { x: 0, y: 0, fontSize: 0 },
    datePosition: { x: 0, y: 0, fontSize: 0 },
    isGuide: true,
  },
  {
    id: 'reflection-guide',
    name: '반성문 탄원서 작성 가이드',
    description: '반성문, 탄원서 작성 가이드라인 및 양식',
    fileName: '반성문 탄원서 작성 가이드.pdf',
    namePosition: { x: 0, y: 0, fontSize: 0 },
    datePosition: { x: 0, y: 0, fontSize: 0 },
    isGuide: true,
  },
  {
    id: 'reflection-writing-guide',
    name: '효과적인 반성문 작성 가이드 양식',
    description: '효과적인 반성문 작성을 위한 가이드',
    fileName: '반성문 탄원서 작성 가이드.pdf',
    namePosition: { x: 0, y: 0, fontSize: 0 },
    datePosition: { x: 0, y: 0, fontSize: 0 },
    isGuide: true,
  },
  {
    id: 'petition-writing-guide',
    name: '효과적인 탄원서 작성 가이드 양식',
    description: '효과적인 탄원서 작성을 위한 가이드',
    fileName: '반성문 탄원서 작성 가이드.pdf',
    namePosition: { x: 0, y: 0, fontSize: 0 },
    datePosition: { x: 0, y: 0, fontSize: 0 },
    isGuide: true,
  },
];

// 코스 카테고리별 전용 증명서
export const courseCertificates: Record<string, CertificateTemplate[]> = {
  // 음주운전
  'drunk-driving': [
    {
      id: 'drunk-driving-completion',
      name: '음주운전 재범방지교육 수료증',
      description: '음주운전 재범방지교육 수료증',
      fileName: '음주운전 재범방지교육 수료증.pdf',
      namePosition: { x: 70, y: 590, fontSize: 26 },
      datePosition: { x: 108, y: 260, fontSize: 14 },
    },
    {
      id: 'drunk-driving-certificate',
      name: '음주운전 재범방지교육 교육내용 증명서',
      description: '음주운전 교육 내용 증명서',
      fileName: '음주운전 재범방지교육 교육내용 증명서.pdf',
      namePosition: { x: 70, y: 645, fontSize: 22 },
      datePosition: { x: 108, y: 222, fontSize: 14 },
    },
  ],
  // 폭력범죄
  'violence': [
    {
      id: 'violence-completion',
      name: '폭력범죄 재범방지교육 수료증',
      description: '폭력범죄 재범방지교육 수료증',
      fileName: '폭력범죄 재범방지교육 수료증.pdf',
      namePosition: { x: 70, y: 590, fontSize: 26 },
      datePosition: { x: 108, y: 260, fontSize: 14 },
    },
    {
      id: 'violence-certificate',
      name: '폭력범죄 재범방지교육 교육내용 증명서',
      description: '폭력범죄 교육 내용 증명서',
      fileName: '폭력범죄 재범방지교육 교육내용 증명서.pdf',
      namePosition: { x: 70, y: 645, fontSize: 22 },
      datePosition: { x: 108, y: 222, fontSize: 14 },
    },
  ],
  // 재산범죄
  'property': [
    {
      id: 'property-completion',
      name: '재산범죄 재범방지교육 수료증',
      description: '재산범죄 재범방지교육 수료증',
      fileName: '재산범죄 재범방지교육 수료증.pdf',
      namePosition: { x: 70, y: 590, fontSize: 26 },
      datePosition: { x: 108, y: 260, fontSize: 14 },
    },
    {
      id: 'property-certificate',
      name: '재산범죄 재범방지교육 교육내용 증명서',
      description: '재산범죄 교육 내용 증명서',
      fileName: '재산범죄 재범방지교육 교육내용 증명서.pdf',
      namePosition: { x: 70, y: 645, fontSize: 22 },
      datePosition: { x: 108, y: 222, fontSize: 14 },
    },
  ],
  // 성범죄
  'sexual': [
    {
      id: 'sexual-completion',
      name: '성범죄 재범방지교육 수료증',
      description: '성범죄 재범방지교육 수료증',
      fileName: '성범죄 재범방지교육 수료증.pdf',
      namePosition: { x: 70, y: 590, fontSize: 26 },
      datePosition: { x: 108, y: 260, fontSize: 14 },
    },
    {
      id: 'sexual-certificate',
      name: '성범죄 재범방지교육 교육내용 증명서',
      description: '성범죄 교육 내용 증명서',
      fileName: '성범죄 재범방지교육 교육내용 증명서.pdf',
      namePosition: { x: 70, y: 645, fontSize: 22 },
      datePosition: { x: 108, y: 222, fontSize: 14 },
    },
  ],
  // 도박중독
  'gambling': [
    {
      id: 'gambling-completion',
      name: '도박중독 재범방지교육 수료증',
      description: '도박중독 재범방지교육 수료증',
      fileName: '도박중독 재범방지교육 수료증.pdf',
      namePosition: { x: 70, y: 590, fontSize: 26 },
      datePosition: { x: 108, y: 260, fontSize: 14 },
    },
    {
      id: 'gambling-certificate',
      name: '도박중독 재범방지교육 교육내용 증명서',
      description: '도박중독 교육 내용 증명서',
      fileName: '도박중독 재범방지교육 교육내용 증명서.pdf',
      namePosition: { x: 70, y: 645, fontSize: 22 },
      datePosition: { x: 108, y: 222, fontSize: 14 },
    },
  ],
  // 마약범죄
  'drugs': [
    {
      id: 'drugs-completion',
      name: '마약범죄 재범방지교육 수료증',
      description: '마약범죄 재범방지교육 수료증',
      fileName: '마약범죄 재범방지교육 수료증.pdf',
      namePosition: { x: 70, y: 590, fontSize: 26 },
      datePosition: { x: 108, y: 260, fontSize: 14 },
    },
    {
      id: 'drugs-certificate',
      name: '마약범죄 재범방지교육 교육내용 증명서',
      description: '마약범죄 교육 내용 증명서',
      fileName: '마약범죄 재범방지교육 교육내용 증명서.pdf',
      namePosition: { x: 70, y: 645, fontSize: 22 },
      datePosition: { x: 108, y: 222, fontSize: 14 },
    },
  ],
  // 디지털범죄
  'digital': [
    {
      id: 'digital-completion',
      name: '디지털범죄 재범방지교육 수료증',
      description: '디지털범죄 재범방지교육 수료증',
      fileName: '디지털범죄 재범방지교육 수료증.pdf',
      namePosition: { x: 70, y: 590, fontSize: 26 },
      datePosition: { x: 108, y: 260, fontSize: 14 },
    },
    {
      id: 'digital-certificate',
      name: '디지털범죄 재범방지교육 교육내용 증명서',
      description: '디지털범죄 교육 내용 증명서',
      fileName: '디지털범죄 재범방지교육 교육내용 증명서.pdf',
      namePosition: { x: 70, y: 645, fontSize: 22 },
      datePosition: { x: 108, y: 222, fontSize: 14 },
    },
  ],
  // 준법의식교육
  'law-compliance': [
    {
      id: 'law-compliance-completion',
      name: '준법의식교육 수료증',
      description: '준법의식교육 수료증',
      fileName: '준법의식교육 수료증.pdf',
      namePosition: { x: 70, y: 590, fontSize: 26 },
      datePosition: { x: 108, y: 260, fontSize: 14 },
    },
    {
      id: 'law-compliance-certificate',
      name: '준법의식교육 증명서',
      description: '준법의식 교육 이수 증명서',
      fileName: '준법의식교육 증명서.pdf',
      namePosition: { x: 70, y: 645, fontSize: 22 },
      datePosition: { x: 108, y: 222, fontSize: 14 },
    },
  ],
  // 구속 수감자 교육 (인지행동개선훈련 기반)
  'detention': [
    {
      id: 'recidivism-prevention-completion',
      name: '재범방지교육 수료증',
      description: '재범방지교육 수료증',
      fileName: '재범방지교육 수료증.pdf',
      namePosition: { x: 70, y: 590, fontSize: 26 },
      datePosition: { x: 108, y: 260, fontSize: 14 },
    },
    {
      id: 'cbt-completion',
      name: '인지행동개선훈련 수료증',
      description: '인지행동개선훈련 수료증',
      fileName: '인지행동개선훈련 수료증.pdf',
      namePosition: { x: 70, y: 590, fontSize: 26 },
      datePosition: { x: 108, y: 260, fontSize: 14 },
    },
    {
      id: 'cbt-certificate',
      name: '인지행동개선훈련 증명서',
      description: '인지행동개선훈련 이수 증명서',
      fileName: '인지행동개선훈련 증명서.pdf',
      namePosition: { x: 70, y: 645, fontSize: 22 },
      datePosition: { x: 108, y: 222, fontSize: 14 },
    },
  ],
};

// 기본 수료증 (카테고리별 전용 증명서가 없는 경우 사용)
export const defaultCompletionCertificate: CertificateTemplate = {
  id: 'default-completion',
  name: '인지행동개선훈련 수료증',
  description: '교육 수료증',
  fileName: '인지행동개선훈련 수료증.pdf',
  namePosition: { x: 70, y: 590, fontSize: 26 },
  datePosition: { x: 108, y: 260, fontSize: 14 },
};

export const defaultCertificate: CertificateTemplate = {
  id: 'default-certificate',
  name: '인지행동개선훈련 증명서',
  description: '교육 이수 증명서',
  fileName: '인지행동개선훈련 증명서.pdf',
  namePosition: { x: 70, y: 645, fontSize: 22 },
  datePosition: { x: 108, y: 222, fontSize: 14 },
};

// 모든 증명서 목록 (관리자 페이지에서 선택할 수 있는 전체 목록)
export const allCertificates: CertificateTemplate[] = [
  defaultCompletionCertificate,
  defaultCertificate,
  ...Object.values(courseCertificates).flat(),
  ...commonCertificates,
  ...guideCertificates,
];

// 증명서 ID로 템플릿 찾기
export function getCertificateById(id: string): CertificateTemplate | undefined {
  return allCertificates.find(cert => cert.id === id);
}

// 증명서 ID 목록으로 템플릿 목록 가져오기
export function getCertificatesByIds(ids: string[]): CertificateTemplate[] {
  return ids.map(id => getCertificateById(id)).filter((cert): cert is CertificateTemplate => cert !== undefined);
}

// 코스 카테고리에 따른 전체 증명서 목록 가져오기 (기본값)
export function getCertificatesForCategory(category: string): CertificateTemplate[] {
  const courseCerts = courseCertificates[category] || [defaultCompletionCertificate, defaultCertificate];
  return [...courseCerts, ...commonCertificates, ...guideCertificates];
}

// 코스별 설정된 증명서 목록 또는 기본 카테고리 증명서 가져오기
export function getCertificatesForCourse(certificateIds: string[] | null, category: string): CertificateTemplate[] {
  if (certificateIds && certificateIds.length > 0) {
    return getCertificatesByIds(certificateIds);
  }
  return getCertificatesForCategory(category);
}

// 관리자용: 카테고리와 관계없이 모든 증명서 목록 (수동 발급용)
export function getAllCertificatesForAdmin(): CertificateTemplate[] {
  return allCertificates;
}

// 카테고리별 증명서 그룹 (관리자 UI용)
export function getCertificatesByCategory(): Record<string, CertificateTemplate[]> {
  return {
    '공통 증명서': commonCertificates,
    '가이드 문서': guideCertificates,
    ...Object.entries(courseCertificates).reduce((acc, [key, certs]) => {
      const categoryNames: Record<string, string> = {
        'drunk-driving': '음주운전',
        'violence': '폭력범죄',
        'property': '재산범죄',
        'sexual': '성범죄',
        'gambling': '도박중독',
        'drugs': '마약범죄',
        'digital': '디지털범죄',
        'law-compliance': '준법의식교육',
        'detention': '구속 수감자 교육',
      };
      acc[categoryNames[key] || key] = certs;
      return acc;
    }, {} as Record<string, CertificateTemplate[]>),
  };
}
