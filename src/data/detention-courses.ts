export interface DetentionCourse {
  id: string;
  title: string;
  price: number;
  duration: string;
  features: string[];
  gradient: string;
  description: string;
  popular?: boolean;
}

export const detentionCourses: DetentionCourse[] = [
  {
    id: 'detention-basic',
    title: '수감자 교육 기본과정',
    price: 150000,
    duration: '1시간',
    description: '수감 중인 분들을 위한 기본 재범방지교육 프로그램입니다. 재범방지교육, 인지행동개선훈련, 준법의식교육을 포함한 체계적인 교육과 각종 증명서를 발급받으실 수 있습니다.',
    features: [
      '재범방지교육 수료증',
      '인지행동개선훈련 교육 수료증',
      '준법의식교육 수료증',
      '재범방지교육통합센터 교육내용 증명서',
      '재범방지교육 상세 교육과정 증명서',
      '인지행동개선훈련 상세 교육과정 증명서',
      '준법의식교육 상세 교육과정 증명서',
      '재범 위험 종합 관리 평가 증명서',
    ],
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'detention-efficient',
    title: '수감자 교육 효율과정',
    price: 250000,
    duration: '1시간',
    description: '기본과정의 모든 혜택에 더해 심리상담사 및 형사사건 전문 변호사와의 편지 상담이 포함된 효율적인 교육 프로그램입니다. 전문가의 소견서와 상담 증명서까지 발급받으실 수 있습니다.',
    features: [
      '재범방지교육 수료증',
      '인지행동개선훈련 교육 수료증',
      '준법의식교육 수료증',
      '재범방지교육통합센터 교육내용 증명서',
      '재범방지교육 상세 교육과정 증명서',
      '인지행동개선훈련 상세 교육과정 증명서',
      '준법의식교육 상세 교육과정 증명서',
      '심리상담사와 편지를 통한 상담',
      '심리상담사 종합 소견서',
      '심리상담 소감문 제출 (대필 양식 제공)',
      '형사사건 전문 변호사와 편지를 통한 상담',
      '변호사 상담 증명서 [위법공포(違法恐怖) 내용 첨부]',
      '재범 위험 종합 관리 평가 증명서',
    ],
    gradient: 'from-violet-500 to-purple-600',
    popular: true,
  },
  {
    id: 'detention-integrated',
    title: '수감자 교육 통합과정',
    price: 350000,
    duration: '1시간',
    description: '가장 포괄적인 수감자 교육 프로그램입니다. 모든 교육과 상담은 물론, 탄원서/소견서 제출, 반성문 대필, 준법생활 계획서 등 양형에 유리한 모든 자료를 종합적으로 지원해드립니다.',
    features: [
      '재범방지교육 수료증',
      '인지행동개선훈련 교육 수료증',
      '준법의식교육 수료증',
      '재범방지교육통합센터 교육내용 증명서',
      '재범방지교육 상세 교육과정 증명서',
      '인지행동개선훈련 상세 교육과정 증명서',
      '준법의식교육 상세 교육과정 증명서',
      '심리상담사와 편지를 통한 상담',
      '심리상담사 종합 소견서',
      '심리상담 소감문 제출 (간편대필 양식 제공)',
      '형사사건 전문 변호사와 편지를 통한 상담',
      '변호사 상담 증명서 [위법공포(違法恐怖) 내용 첨부]',
      '재범방지교육통합센터 서명 탄원서 1부 제출',
      '재범방지교육통합센터 서명 소견서 1부 제출',
      '재범방지교육·인지행동개선·준법의식 각 이수 소감문 제출 (간편대필 양식 제공)',
      '재범방지를 위한 준법생활 계획서',
      '반성문 1회 대필 (분량은 사건에 따라 상이)',
      '효과적인 반성문 작성 가이드 양식',
      '재범 위험 종합 관리 평가 증명서',
    ],
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export function getDetentionCourseById(id: string): DetentionCourse | undefined {
  return detentionCourses.find((course) => course.id === id);
}
