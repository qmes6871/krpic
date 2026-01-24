import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'drunk-driving',
    name: '음주운전',
    description: '반성문·양형자료·수료증·심리상담 소견서가 필요하신 분을 위한 음주운전 재범방지교육',
    icon: 'Wine',
    slug: 'drunk-driving',
    color: 'bg-red-500',
  },
  {
    id: 'violence',
    name: '폭력범죄',
    description: '폭력 사건 감형·법원 제출 자료·수료증·심리소견서가 필요하신 분을 위한 재범방지교육',
    icon: 'ShieldAlert',
    slug: 'violence',
    color: 'bg-orange-500',
  },
  {
    id: 'property',
    name: '재산범죄',
    description: '절도·사기·보이스피싱 재판을 앞두고 감형 자료가 필요하신 분을 위한 재범방지교육',
    icon: 'Wallet',
    slug: 'property',
    color: 'bg-yellow-500',
  },
  {
    id: 'sexual',
    name: '성범죄',
    description: '성범죄 재판을 앞두고 감형 자료·수료증·심리소견서가 필요하신 분을 위한 재범방지교육',
    icon: 'UserX',
    slug: 'sexual',
    color: 'bg-pink-500',
  },
  {
    id: 'gambling',
    name: '도박중독',
    description: '도박·도박개장 재판, 개인회생·워크아웃 과정을 앞두신 분을 위한 재범방지교육',
    icon: 'Dices',
    slug: 'gambling',
    color: 'bg-purple-500',
  },
  {
    id: 'drugs',
    name: '마약범죄',
    description: '마약 투약·소지·매매 재판을 앞두고 감형 자료가 필요하신 분을 위한 재범방지교육',
    icon: 'Pill',
    slug: 'drugs',
    color: 'bg-indigo-500',
  },
  {
    id: 'digital',
    name: '디지털범죄',
    description: '해킹·개인정보 유출 등 관련 재판을 앞두고 감형 자료가 필요하신 분을 위한 재범방지교육',
    icon: 'Monitor',
    slug: 'digital',
    color: 'bg-blue-500',
  },
  {
    id: 'law-compliance',
    name: '준법의식교육',
    description: '무면허운전·공무집행방해·모욕·명예훼손·경범죄·재물손괴 등 경미한 법 위반으로 양형자료가 필요하신 프로그램',
    icon: 'Scale',
    slug: 'law-compliance',
    color: 'bg-green-500',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}
