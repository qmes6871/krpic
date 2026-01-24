'use client';

import Link from 'next/link';
import {
  Clock,
  User,
  CheckCircle,
  ArrowLeft,
  Shield,
  ChevronRight,
  BookOpen,
  Award,
  Monitor,
  Play,
  MessageCircle,
  Zap,
  Calendar,
} from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';
import { Category, Course } from '@/types';

interface Props {
  category: Category;
  course: Course;
  relatedCourses: Course[];
  categorySlug: string;
  gradient: string;
}

const curriculum = [
  {
    title: '오리엔테이션',
    description: '교육 안내 및 학습 목표 설정',
    icon: Play,
  },
  {
    title: '이론 교육',
    description: '핵심 개념 및 사례 학습',
    icon: BookOpen,
  },
  {
    title: '실습 및 토론',
    description: '상황별 대처 방법 학습',
    icon: MessageCircle,
  },
  {
    title: '수료 평가',
    description: '학습 내용 확인 및 수료증 발급',
    icon: Award,
  },
];

export default function CourseDetailContent({
  category,
  course,
  relatedCourses,
  categorySlug,
  gradient,
}: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        {/* Multi-layer Gradient Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-transparent to-pink-500/20" />
          <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400/20 via-transparent to-orange-500/10" />
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/10 via-transparent to-black/20" />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-yellow-400/30 via-pink-500/20 to-purple-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/30 via-blue-500/20 to-indigo-600/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-emerald-400/20 via-teal-500/10 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
          <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="container-custom relative">
          {/* Breadcrumb */}
          <FadeIn delay={0}>
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-white/70 flex-wrap">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    홈
                  </Link>
                </li>
                <ChevronRight className="w-4 h-4" />
                <li>
                  <Link href="/education" className="hover:text-white transition-colors">
                    재범방지교육
                  </Link>
                </li>
                <ChevronRight className="w-4 h-4" />
                <li>
                  <Link
                    href={`/education/${categorySlug}`}
                    className="hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
                <ChevronRight className="w-4 h-4" />
                <li className="text-white font-medium">{course.title}</li>
              </ol>
            </nav>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <FadeIn delay={100}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-4">
                  <BookOpen className="w-4 h-4" />
                  {category.name} 교육
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {course.title}
                </h1>
              </FadeIn>

              <FadeIn delay={300}>
                <p className="text-lg text-white/80 mb-6 leading-relaxed max-w-2xl">
                  {course.description}
                </p>
              </FadeIn>

              <FadeIn delay={400}>
                <div className="flex flex-wrap gap-6 text-white/80">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {course.instructor}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    1년간 자유 수강
                  </span>
                </div>
              </FadeIn>
            </div>

            {/* Price Card - Desktop */}
            <FadeIn delay={300} direction="left">
              <div className="hidden lg:block">
                <div className="bg-white rounded-3xl p-6 shadow-xl">
                  <div className="text-center mb-6">
                    <span className="text-sm text-primary-500">수강료</span>
                    <div className="text-4xl font-bold text-primary-900">
                      {course.price.toLocaleString()}
                      <span className="text-lg font-normal">원</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold py-4 rounded-xl mb-3 transition-all shadow-lg shadow-accent-500/25 hover:scale-[1.02]">
                    수강신청 하기
                  </button>
                  <a
                    href="http://pf.kakao.com/_stxkUn/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-primary-100 text-primary-900 font-semibold py-4 rounded-xl hover:bg-primary-200 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    카카오톡 상담
                  </a>

                  <div className="mt-6 pt-6 border-t border-primary-100 space-y-3">
                    {[
                      { icon: Shield, text: '법원·검찰 채택 문서' },
                      { icon: Award, text: '수료증 즉시 발급' },
                      { icon: Monitor, text: '온라인 24시간 수강' },
                      { icon: Clock, text: '1년간 자유 수강' },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3 text-primary-600">
                        <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-secondary-600" />
                        </div>
                        <span className="text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mobile Price Card */}
      <section className="lg:hidden -mt-6 relative z-10 px-4">
        <div className="container-custom">
          <FadeIn>
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-primary-500">수강료</span>
                  <div className="text-2xl font-bold text-primary-900">
                    {course.price.toLocaleString()}원
                  </div>
                </div>
                <button className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-accent-500/25">
                  수강신청
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-primary-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  법원 양형자료 채택
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  즉시 발급
                </span>
                <span className="flex items-center gap-1">
                  <Monitor className="w-4 h-4" />
                  온라인
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 bg-primary-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Features */}
              <FadeIn>
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-secondary-600" />
                    </div>
                    과정 특징
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.features.map((feature, index) => (
                      <FadeIn key={index} delay={index * 50}>
                        <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                          <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-primary-700 font-medium">{feature}</span>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Curriculum */}
              <FadeIn delay={100}>
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    교육 과정
                  </h2>
                  <div className="space-y-4">
                    {curriculum.map((item, index) => (
                      <FadeIn key={index} delay={index * 100}>
                        <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-primary-50 to-transparent rounded-2xl hover:from-primary-100 transition-colors group">
                          <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg`}>
                            <item.icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-secondary-600 bg-secondary-100 px-2 py-0.5 rounded">
                                STEP {String(index + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <h3 className="font-bold text-primary-900 text-lg">{item.title}</h3>
                            <p className="text-primary-500 text-sm">{item.description}</p>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Important Notice */}
              <FadeIn delay={200}>
                <div className="bg-gradient-to-br from-accent-50 to-secondary-50 border border-accent-200 rounded-3xl p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-900 text-lg mb-2">수료증 안내</h3>
                      <p className="text-primary-600 leading-relaxed">
                        본 교육과정을 이수하시면 법원 및 검찰에서 인정하는 수료증이 발급됩니다.
                        수료증은 교육 완료 후 즉시 PDF로 발급되며, 출력하여 제출하실 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block space-y-6">
              {/* Quick Info */}
              <FadeIn delay={300} direction="left">
                <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-6 text-white">
                  <h3 className="font-bold mb-4">빠른 안내</h3>
                  <ul className="space-y-3 text-sm text-white/80">
                    {[
                      '결제 후 즉시 수강 가능',
                      'PC, 모바일 모두 지원',
                      '진도율 자동 저장',
                      '수료증 PDF 다운로드',
                    ].map((text, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-accent-400" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="container-custom">
            <FadeIn>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-2">
                  관련 교육과정
                </h2>
                <p className="text-primary-600">
                  {category.name} 교육의 다른 과정도 살펴보세요
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedCourses.map((relatedCourse, index) => (
                <FadeIn key={relatedCourse.id} delay={index * 100}>
                  <Link
                    href={`/education/${categorySlug}/${relatedCourse.id}`}
                    className="group block h-full"
                  >
                    <div className="h-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-primary-100 transition-all duration-300 hover:-translate-y-1">
                      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-primary-900 mb-2 group-hover:text-secondary-600 transition-colors">
                        {relatedCourse.title}
                      </h3>
                      <p className="text-sm text-primary-600 mb-4 line-clamp-2">
                        {relatedCourse.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                        <span className="text-lg font-bold text-primary-900">
                          {relatedCourse.price.toLocaleString()}원
                        </span>
                        <span className="text-sm text-primary-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {relatedCourse.duration}
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              지금 바로 교육을 시작하세요
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              전문 상담사가 상황에 맞는 최적의 교육과정을 안내해 드립니다
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="http://pf.kakao.com/_stxkUn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-accent-500/25 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                카카오톡 상담
              </a>
              <Link
                href={`/education/${categorySlug}`}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                목록으로 돌아가기
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
