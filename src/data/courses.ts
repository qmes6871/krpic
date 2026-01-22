import { Course } from '@/types';

export const courses: Course[] = [
  // 음주운전
  {
    id: 'drunk-driving-basic',
    categoryId: 'drunk-driving',
    title: '음주운전 재범방지 기본과정',
    description: '음주운전의 위험성과 법적 책임에 대해 학습하고, 재발 방지를 위한 자기 관리 방법을 배웁니다.',
    thumbnail: '/images/courses/drunk-driving-1.jpg',
    price: 50000,
    duration: '8시간',
    instructor: '김안전 교수',
    features: ['동영상 강의', '수료증 발급', '모바일 수강 가능', '24시간 상담'],
  },
  {
    id: 'drunk-driving-advanced',
    categoryId: 'drunk-driving',
    title: '음주운전 심화과정',
    description: '알코올 중독의 이해와 회복 과정, 가족 및 사회 관계 회복을 위한 심화 교육 프로그램입니다.',
    thumbnail: '/images/courses/drunk-driving-2.jpg',
    price: 80000,
    duration: '16시간',
    instructor: '박재활 박사',
    features: ['동영상 강의', '수료증 발급', '1:1 상담', '모바일 수강 가능'],
  },

  // 폭력범죄
  {
    id: 'violence-anger',
    categoryId: 'violence',
    title: '분노조절 교육과정',
    description: '분노의 원인을 이해하고 건강한 감정 표현 방법을 학습합니다.',
    thumbnail: '/images/courses/violence-1.jpg',
    price: 60000,
    duration: '10시간',
    instructor: '이심리 상담사',
    features: ['동영상 강의', '수료증 발급', '실습 과제', '그룹 상담'],
  },
  {
    id: 'violence-family',
    categoryId: 'violence',
    title: '가정폭력 예방교육',
    description: '가정 내 폭력 예방과 건강한 가족 관계 형성을 위한 교육입니다.',
    thumbnail: '/images/courses/violence-2.jpg',
    price: 55000,
    duration: '8시간',
    instructor: '정가정 교수',
    features: ['동영상 강의', '수료증 발급', '가족 상담 연계'],
  },

  // 재산범죄
  {
    id: 'property-ethics',
    categoryId: 'property',
    title: '경제윤리 교육과정',
    description: '올바른 경제 윤리와 재산권 존중에 대한 교육 프로그램입니다.',
    thumbnail: '/images/courses/property-1.jpg',
    price: 45000,
    duration: '6시간',
    instructor: '최윤리 교수',
    features: ['동영상 강의', '수료증 발급', '사례 학습'],
  },
  {
    id: 'property-fraud',
    categoryId: 'property',
    title: '사기범죄 예방교육',
    description: '사기 범죄의 유형과 예방법, 피해자 보호에 대해 학습합니다.',
    thumbnail: '/images/courses/property-2.jpg',
    price: 50000,
    duration: '8시간',
    instructor: '강법률 변호사',
    features: ['동영상 강의', '수료증 발급', '법률 상담'],
  },

  // 성범죄
  {
    id: 'sexual-awareness',
    categoryId: 'sexual',
    title: '성인지 감수성 교육',
    description: '성인지 감수성을 높이고 건전한 성윤리를 학습합니다.',
    thumbnail: '/images/courses/sexual-1.jpg',
    price: 70000,
    duration: '12시간',
    instructor: '한성평등 교수',
    features: ['동영상 강의', '수료증 발급', '전문 상담', '사례 분석'],
  },
  {
    id: 'sexual-prevention',
    categoryId: 'sexual',
    title: '성범죄 재발방지 교육',
    description: '성범죄 재발 방지를 위한 전문 치료 교육 프로그램입니다.',
    thumbnail: '/images/courses/sexual-2.jpg',
    price: 100000,
    duration: '20시간',
    instructor: '서치료 박사',
    features: ['동영상 강의', '수료증 발급', '심리 치료', '정기 상담'],
  },

  // 도박중독
  {
    id: 'gambling-basic',
    categoryId: 'gambling',
    title: '도박중독 기본교육',
    description: '도박 중독의 원인과 증상을 이해하고 회복 방법을 학습합니다.',
    thumbnail: '/images/courses/gambling-1.jpg',
    price: 55000,
    duration: '8시간',
    instructor: '문중독 상담사',
    features: ['동영상 강의', '수료증 발급', '자가진단', '회복 프로그램'],
  },
  {
    id: 'gambling-recovery',
    categoryId: 'gambling',
    title: '도박중독 회복과정',
    description: '도박 중독에서 벗어나기 위한 단계별 회복 프로그램입니다.',
    thumbnail: '/images/courses/gambling-2.jpg',
    price: 90000,
    duration: '16시간',
    instructor: '윤재활 박사',
    features: ['동영상 강의', '수료증 발급', '그룹 치료', '가족 상담'],
  },

  // 마약범죄
  {
    id: 'drugs-prevention',
    categoryId: 'drugs',
    title: '마약류 예방교육',
    description: '마약류의 위험성과 예방법에 대한 기본 교육입니다.',
    thumbnail: '/images/courses/drugs-1.jpg',
    price: 60000,
    duration: '10시간',
    instructor: '조예방 교수',
    features: ['동영상 강의', '수료증 발급', '사례 학습', '상담 연계'],
  },
  {
    id: 'drugs-rehabilitation',
    categoryId: 'drugs',
    title: '마약류 재활교육',
    description: '마약류 중독에서 벗어나기 위한 전문 재활 교육 프로그램입니다.',
    thumbnail: '/images/courses/drugs-2.jpg',
    price: 120000,
    duration: '24시간',
    instructor: '신재활 박사',
    features: ['동영상 강의', '수료증 발급', '전문 치료', '정기 모니터링'],
  },

  // 디지털범죄
  {
    id: 'digital-ethics',
    categoryId: 'digital',
    title: '디지털 윤리교육',
    description: '온라인 공간에서의 올바른 행동과 디지털 시민의식을 학습합니다.',
    thumbnail: '/images/courses/digital-1.jpg',
    price: 45000,
    duration: '6시간',
    instructor: '황디지털 교수',
    features: ['동영상 강의', '수료증 발급', '실습 과제'],
  },
  {
    id: 'digital-crime',
    categoryId: 'digital',
    title: '사이버범죄 예방교육',
    description: '사이버 범죄의 유형과 법적 책임, 예방법에 대해 학습합니다.',
    thumbnail: '/images/courses/digital-2.jpg',
    price: 55000,
    duration: '8시간',
    instructor: '임보안 전문가',
    features: ['동영상 강의', '수료증 발급', '사례 분석', '법률 상담'],
  },

  // 준법의식교육
  {
    id: 'law-basic',
    categoryId: 'law-compliance',
    title: '준법의식 기본교육',
    description: '법률 준수의 중요성과 시민의식 향상을 위한 기본 교육입니다.',
    thumbnail: '/images/courses/law-1.jpg',
    price: 40000,
    duration: '6시간',
    instructor: '권법률 교수',
    features: ['동영상 강의', '수료증 발급', '법률 상식 테스트'],
  },
  {
    id: 'law-citizenship',
    categoryId: 'law-compliance',
    title: '시민의식 향상교육',
    description: '건전한 시민의식과 사회 공동체 의식을 함양하는 교육입니다.',
    thumbnail: '/images/courses/law-2.jpg',
    price: 45000,
    duration: '8시간',
    instructor: '오시민 교수',
    features: ['동영상 강의', '수료증 발급', '토론 활동', '봉사활동 연계'],
  },
];

export function getCoursesByCategory(categoryId: string): Course[] {
  return courses.filter((course) => course.categoryId === categoryId);
}

export function getCourseById(courseId: string): Course | undefined {
  return courses.find((course) => course.id === courseId);
}
