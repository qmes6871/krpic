import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'drunk-driving',
    name: '음주운전',
    description: '음주운전 예방 및 재발 방지를 위한 전문 교육 프로그램',
    icon: 'Wine',
    slug: 'drunk-driving',
    color: 'bg-red-500',
  },
  {
    id: 'violence',
    name: '폭력범죄',
    description: '폭력 충동 조절 및 갈등 해결 능력 향상 교육',
    icon: 'ShieldAlert',
    slug: 'violence',
    color: 'bg-orange-500',
  },
  {
    id: 'property',
    name: '재산범죄',
    description: '재산범죄 예방 및 올바른 경제 윤리 교육',
    icon: 'Wallet',
    slug: 'property',
    color: 'bg-yellow-500',
  },
  {
    id: 'sexual',
    name: '성범죄',
    description: '성인지 감수성 향상 및 건전한 성윤리 교육',
    icon: 'UserX',
    slug: 'sexual',
    color: 'bg-pink-500',
  },
  {
    id: 'gambling',
    name: '도박중독',
    description: '도박 중독 예방 및 치료를 위한 전문 교육',
    icon: 'Dices',
    slug: 'gambling',
    color: 'bg-purple-500',
  },
  {
    id: 'drugs',
    name: '마약범죄',
    description: '마약류 중독 예방 및 재활을 위한 교육 프로그램',
    icon: 'Pill',
    slug: 'drugs',
    color: 'bg-indigo-500',
  },
  {
    id: 'digital',
    name: '디지털범죄',
    description: '사이버 범죄 예방 및 디지털 윤리 교육',
    icon: 'Monitor',
    slug: 'digital',
    color: 'bg-blue-500',
  },
  {
    id: 'law-compliance',
    name: '준법의식교육',
    description: '법률 준수 의식 고취 및 시민의식 향상 교육',
    icon: 'Scale',
    slug: 'law-compliance',
    color: 'bg-green-500',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}
