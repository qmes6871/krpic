'use client';

/* eslint-disable @next/next/no-img-element */
import { Scale, Brain, Shield, Award, Briefcase, Star } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

interface CareerItem {
  text: string;
  highlight?: boolean;
}

interface ExpertInfo {
  id: string;
  name: string;
  title: string;
  company: string;
  certification: string;
  image: string;
  imagePosition: string;
  gradient: string;
  borderColor: string;
  bgGradient: string;
  icon: 'scale' | 'brain';
  career: CareerItem[];
  works: string[];
}

const experts: ExpertInfo[] = [
  {
    id: 'moon',
    name: '문해성 변호사',
    title: '대표 변호사',
    company: '재범방지교육통합센터',
    certification: '대한변호사협회 등록',
    image: '/images/lawyer-moon-optimized.jpg',
    imagePosition: 'center 20%',
    gradient: 'from-primary-200 to-primary-300',
    borderColor: 'border-primary-100',
    bgGradient: 'from-primary-900 to-primary-800',
    icon: 'scale',
    career: [
      { text: '前 법무법인(유) 태평양', highlight: true },
      { text: '現 법률사무소 유나이트 대표 변호사', highlight: false },
    ],
    works: [
      '국내 대표 패션/라이프스타일 커머스 플랫폼 A사의 series C 투자 자문',
      '인프라 및 실물자산 투자 전문 글로벌 투자 운용사 S사의 국내 해상풍력발전 투자 자문',
      '글로벌 사모펀드 운용사 A사의 J사 투자 자문',
      '국내 리딩 사모펀드 A사의 MSO 회사 투자 자문',
      '국내 최대 리걸테크 기업 L사 정기 법률고문 자문',
      '5성급 엔터테인먼트 리조트의 카지노 인허가 취득 자문',
      '대기업 발전사 G사 소속 근로자의 부당해고 구제 관련 자문',
      '국내 힙합 아티스트 O그룹의 엔터테인먼트 전속계약 해지 분쟁 대리',
      '국내 유수 건설사 I사의 600억대 규모 부동산 계약해제 소송대리',
      '2,400억대 규모의 발전소 EPC 계약 해석 관련 소송대리',
      '성폭력처벌법 위반(강제추행) 등 성폭력 범죄 수사 및 공판 대응',
      '교통사고처리특례법 위반 등 교통사고 범죄 수사 및 공판 대응',
    ],
  },
  {
    id: 'kim',
    name: '김후 변호사',
    title: '대표 변호사',
    company: '재범방지교육통합센터',
    certification: '대한변호사협회 등록',
    image: '/images/lawyer-kim-optimized.jpg',
    imagePosition: 'center 20%',
    gradient: 'from-primary-200 to-primary-300',
    borderColor: 'border-primary-100',
    bgGradient: 'from-primary-900 to-primary-800',
    icon: 'scale',
    career: [
      { text: '現 법률사무소 유나이트 대표 변호사', highlight: false },
      { text: '前 법률사무소 부광 소속 변호사', highlight: false },
      { text: '前 뉴로이어 법률사무소 파트너 변호사', highlight: false },
      { text: '前 법률사무소 후 대표 변호사', highlight: false },
      { text: '現 대법원 국선변호인', highlight: false },
      { text: '現 서울지방경찰청 형사당직변호사', highlight: false },
      { text: '現 대한변호사협회 대의원', highlight: false },
      { text: '現 서울지방변호사회 이사', highlight: false },
      { text: '現 서울지방변호사회 대외협력위원회 위원', highlight: false },
      { text: '現 서울지방변호사회 기획위원회 위원', highlight: false },
      { text: '現 대한변호사협회 미래전략센터 정책자문단', highlight: false },
      { text: '現 대한변호사협회 공보위원회 위원', highlight: false },
      { text: '現 대한변호사협회 사업위원회 위원', highlight: false },
      { text: '現 대한변호사협회 청년변호사 특별위원회 위원', highlight: false },
      { text: '現 동작구청 무료상담변호사', highlight: false },
      { text: '現 서울지방변호사회 예비조사위원', highlight: false },
      { text: '現 대한변호사협회 예산결산위원회 위원', highlight: false },
    ],
    works: [],
  },
  {
    id: 'counselor',
    name: '김태훈 심리상담사',
    title: '재범방지교육 전문',
    company: '재범방지교육통합센터',
    certification: 'KAC인증 자격 (KAC13239)',
    image: '/images/counselor-kim-taehoon.png',
    imagePosition: 'center 15%',
    gradient: 'from-secondary-200 to-secondary-300',
    borderColor: 'border-secondary-100',
    bgGradient: 'from-secondary-600 to-secondary-700',
    icon: 'brain',
    career: [],
    works: [],
  },
];

const lawyers = experts.filter(e => e.icon === 'scale');
const counselors = experts.filter(e => e.icon === 'brain');

export default function ExpertSection() {
  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-secondary-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary-100/50 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              전문가와 함께하세요
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              법률과 심리, 최고의 전문가가 함께합니다
            </h2>
            <p className="text-primary-600 max-w-3xl mx-auto text-lg leading-relaxed">
              <strong className="text-primary-900">대한변호사협회 등록 법률사무소 변호사</strong>와{' '}
              <strong className="text-primary-900">KAC인증 심리상담사</strong>가<br className="hidden md:block" />
              양형을 위해 한 자리에 모였습니다.
            </p>
          </div>
        </FadeIn>

        {/* Lawyers Row */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-6">
          {lawyers.map((expert, index) => (
            <FadeIn key={expert.id} delay={100 + index * 50} direction="up">
              <div className="relative group h-full">
                <div className={`absolute -inset-3 bg-gradient-to-r ${expert.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`} />
                <div className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl ${expert.borderColor} border h-full flex flex-col`}>
                  {/* Image */}
                  <div className="aspect-[4/5] relative flex-shrink-0">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: expert.imagePosition }}
                    />
                  </div>

                  {/* Name & Title */}
                  <div className={`p-4 bg-gradient-to-r ${expert.bgGradient}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                        <Scale className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-bold">{expert.name}</div>
                        <div className="text-white/80 text-xs">{expert.company}</div>
                        <div className="text-accent-300 text-xs">{expert.certification}</div>
                      </div>
                    </div>
                  </div>

                  {/* Career & Works */}
                  <div className="p-4 bg-gray-50 flex-grow">
                    {/* Career */}
                    {expert.career.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Briefcase className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-bold text-gray-700">경력</span>
                        </div>
                        <ul className="space-y-1.5">
                          {expert.career.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                              <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                item.text.startsWith('現') ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                              <span className={`text-sm leading-relaxed ${
                                item.highlight ? 'bg-yellow-200 px-1 rounded font-medium text-gray-800' : ''
                              }`}>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Works */}
                    {expert.works.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Star className="w-4 h-4 text-secondary-600" />
                          <span className="text-sm font-bold text-gray-700">주요 업무</span>
                        </div>
                        <ul className="space-y-1.5">
                          {expert.works.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-secondary-500 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Counselor Row */}
        <div className="flex justify-center mb-12">
          {counselors.map((expert) => (
            <FadeIn key={expert.id} delay={200} direction="up">
              <div className="relative group w-full max-w-xl">
                <div className={`absolute -inset-3 bg-gradient-to-r ${expert.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`} />
                <div className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl ${expert.borderColor} border`}>
                  {/* Image */}
                  <div className="aspect-[4/5] relative">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: expert.imagePosition }}
                    />
                  </div>

                  {/* Name & Title */}
                  <div className={`p-8 bg-gradient-to-r ${expert.bgGradient}`}>
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xl">{expert.name}</div>
                        <div className="text-white/80 text-lg">{expert.company}</div>
                        <div className="text-accent-300 mt-1">{expert.certification}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Stats */}
        <FadeIn delay={300}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-primary-900 rounded-2xl p-5 text-center">
              <Award className="w-8 h-8 text-accent-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1500+</div>
              <div className="text-white/70 text-sm">성공 사례</div>
            </div>
            <div className="bg-secondary-600 rounded-2xl p-5 text-center">
              <Shield className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-white/70 text-sm">양형자료 채택</div>
            </div>
            <div className="bg-primary-800 rounded-2xl p-5 text-center">
              <Scale className="w-8 h-8 text-accent-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">법률사무소</div>
              <div className="text-white/70 text-sm">대한변협 등록</div>
            </div>
            <div className="bg-secondary-500 rounded-2xl p-5 text-center">
              <Brain className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">KAC인증</div>
              <div className="text-white/70 text-sm">공인 심리상담</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
