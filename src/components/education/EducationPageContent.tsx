'use client';

import Link from 'next/link';
import {
  Wine,
  ShieldAlert,
  Wallet,
  UserX,
  Dices,
  Pill,
  Monitor,
  Scale,
  ArrowRight,
  Shield,
  Award,
  Clock,
  Zap,
  MessageCircle,
  BookOpen,
  FileCheck,
  Play,
} from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';
import { Category, Course } from '@/types';

interface Props {
  categories: Category[];
  coursesByCategory: Record<string, Course[]>;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wine,
  ShieldAlert,
  Wallet,
  UserX,
  Dices,
  Pill,
  Monitor,
  Scale,
};

const colorGradientMap: Record<string, string> = {
  'bg-red-500': 'from-red-500 to-red-600',
  'bg-orange-500': 'from-orange-500 to-orange-600',
  'bg-yellow-500': 'from-yellow-500 to-amber-600',
  'bg-pink-500': 'from-pink-500 to-rose-600',
  'bg-purple-500': 'from-purple-500 to-purple-600',
  'bg-indigo-500': 'from-indigo-500 to-indigo-600',
  'bg-blue-500': 'from-blue-500 to-blue-600',
  'bg-green-500': 'from-green-500 to-emerald-600',
};

const steps = [
  {
    number: '01',
    title: '카테고리 선택',
    description: '원하시는 교육 카테고리를 선택합니다',
    icon: BookOpen,
  },
  {
    number: '02',
    title: '수강 신청',
    description: '교육과정을 선택하고 수강신청을 진행합니다',
    icon: FileCheck,
  },
  {
    number: '03',
    title: '온라인 학습',
    description: '결제 완료 후 즉시 수강을 시작할 수 있습니다',
    icon: Play,
  },
  {
    number: '04',
    title: '수료증 발급',
    description: '교육 이수 후 수료증이 자동으로 발급됩니다',
    icon: Award,
  },
];

export default function EducationPageContent({ categories, coursesByCategory }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Multi-layer Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-transparent to-pink-500/20" />
          <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400/20 via-transparent to-orange-500/10" />
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/10 via-transparent to-black/20" />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-accent-400/30 via-secondary-500/20 to-purple-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/30 via-blue-500/20 to-indigo-600/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-6">
                <Shield className="w-4 h-4 text-accent-400" />
                법원·검찰 채택 문서 공인교육
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                재범방지교육
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                법원, 검찰에서 인정하는 공인 재범방지교육 프로그램입니다.<br className="hidden md:block" />
                원하시는 교육 카테고리를 선택해 주세요.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="http://pf.kakao.com/_stxkUn/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  카카오톡 상담
                </a>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  센터 안내
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { icon: Shield, value: '법원 양형자료 채택', label: '수료증' },
              { icon: Monitor, value: '온라인', label: '24시간 수강' },
              { icon: Award, value: '즉시 발급', label: '수료증 자동' },
              { icon: Zap, value: '8개', label: '교육 카테고리' },
            ].map((stat, index) => (
              <FadeIn key={stat.label} delay={400 + index * 100}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-5 text-center hover:bg-white/15 transition-all hover:scale-105">
                  <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-accent-400 mx-auto mb-2" />
                  <div className="text-lg md:text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-primary-50">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 text-sm font-medium mb-4">
                교육 카테고리
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
                원하시는 교육을 선택하세요
              </h2>
              <p className="text-primary-600 max-w-2xl mx-auto">
                전문 강사진이 설계한 체계적인 교육 프로그램으로 성공적인 이수를 지원합니다
              </p>
            </div>
          </FadeIn>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((category, index) => {
              const Icon = iconMap[category.icon];
              const courses = coursesByCategory[category.id] || [];
              const gradient = colorGradientMap[category.color] || 'from-primary-500 to-primary-600';

              return (
                <FadeIn key={category.id} delay={index * 100}>
                  <Link
                    href={`/education/${category.slug}`}
                    className="group block h-full"
                  >
                    <div className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-primary-100 transition-all duration-300 hover:-translate-y-2">
                      {/* Card Header */}
                      <div className={`bg-gradient-to-br ${gradient} p-5 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative flex items-center justify-between">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            {Icon && <Icon className="w-6 h-6 text-white" />}
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 group-hover:text-white transition-all" />
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-primary-900 mb-2 group-hover:text-secondary-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-primary-600 text-sm mb-3 line-clamp-2">
                          {category.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm text-secondary-600 font-medium">
                          <BookOpen className="w-4 h-4" />
                          {courses.length}개 과정
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
                수강 안내
              </h2>
              <p className="text-primary-600">
                간단한 4단계로 교육을 이수하세요
              </p>
            </div>
          </FadeIn>

          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <FadeIn key={step.number} delay={index * 150}>
                  <div className="relative group">
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-primary-200 -translate-x-1/2 z-0" />
                    )}

                    <div className="bg-primary-50 rounded-2xl p-6 hover:bg-primary-100 transition-all relative z-10 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-900 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-sm font-bold text-secondary-600 mb-2">STEP {step.number}</div>
                      <h3 className="font-bold text-primary-900 text-lg mb-2">{step.title}</h3>
                      <p className="text-primary-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                KRPIC만의 차별화된 서비스
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                수강생의 성공적인 교육 이수를 위해 최선을 다합니다
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Shield, title: '법원·검찰 채택 문서', desc: '수료증 발급', gradient: 'from-blue-500 to-blue-600' },
              { icon: Monitor, title: '온라인 수강', desc: '언제 어디서나 24시간', gradient: 'from-violet-500 to-purple-600' },
              { icon: Clock, title: '빠른 이수', desc: '효율적인 커리큘럼', gradient: 'from-pink-500 to-rose-500' },
              { icon: Award, title: '즉시 발급', desc: '수료 후 바로 수료증', gradient: 'from-amber-500 to-orange-500' },
            ].map((item, index) => (
              <FadeIn key={item.title} delay={index * 100}>
                <div className="group h-full">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 h-full text-center">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <FadeIn delay={100}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    지금 바로 교육을 시작하세요
                  </h2>
                </FadeIn>
                <FadeIn delay={200}>
                  <p className="text-white/80 mb-8 max-w-xl mx-auto">
                    전문 상담사가 상황에 맞는 최적의 교육과정을 안내해 드립니다
                  </p>
                </FadeIn>
                <FadeIn delay={300}>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a
                      href="http://pf.kakao.com/_stxkUn/chat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-secondary-900 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg hover:scale-105 transform duration-300"
                    >
                      <MessageCircle className="w-5 h-5" />
                      카카오톡 상담
                    </a>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
                    >
                      센터 안내 보기
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </FadeIn>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
