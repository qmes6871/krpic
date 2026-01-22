import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Clock,
  User,
  CheckCircle,
  ArrowLeft,
  Phone,
  Shield,
  ChevronRight,
  BookOpen,
  Award,
  Monitor,
  Play,
  FileCheck,
  MessageCircle,
  Mail,
  Zap,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { categories, getCategoryBySlug } from '@/data/categories';
import { courses, getCourseById, getCoursesByCategory } from '@/data/courses';

interface Props {
  params: Promise<{ category: string; courseId: string }>;
}

export async function generateStaticParams() {
  return courses.map((course) => {
    const category = categories.find((c) => c.id === course.categoryId);
    return {
      category: category?.slug || '',
      courseId: course.id,
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    return {
      title: '과정을 찾을 수 없습니다 - KRPIC',
    };
  }

  return {
    title: `${course.title} - KRPIC 재범방지교육통합센터`,
    description: course.description,
  };
}

const gradientMap: Record<string, string> = {
  'bg-red-600': 'from-red-700 to-red-900',
  'bg-orange-600': 'from-orange-700 to-orange-900',
  'bg-blue-600': 'from-blue-700 to-blue-900',
  'bg-purple-600': 'from-purple-700 to-purple-900',
  'bg-pink-600': 'from-pink-700 to-pink-900',
  'bg-green-600': 'from-green-700 to-green-900',
  'bg-cyan-600': 'from-cyan-700 to-cyan-900',
  'bg-indigo-600': 'from-indigo-700 to-indigo-900',
};

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

export default async function CourseDetailPage({ params }: Props) {
  const { category: categorySlug, courseId } = await params;
  const category = getCategoryBySlug(categorySlug);
  const course = getCourseById(courseId);

  if (!category || !course) {
    notFound();
  }

  const relatedCourses = getCoursesByCategory(category.id).filter(
    (c) => c.id !== courseId
  );

  const gradient = gradientMap[category.color] || 'from-primary-800 to-primary-900';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        {/* Multi-layer Gradient Background */}
        <div className="absolute inset-0">
          {/* Base Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

          {/* Mesh Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-transparent to-pink-500/20" />
          <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400/20 via-transparent to-orange-500/10" />

          {/* Aurora Effect */}
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/10 via-transparent to-black/20" />

          {/* Animated Gradient Blobs */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-yellow-400/30 via-pink-500/20 to-purple-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/30 via-blue-500/20 to-indigo-600/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-emerald-400/20 via-teal-500/10 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />

          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />

          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="container-custom relative">
          {/* Breadcrumb */}
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

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-4">
                <BookOpen className="w-4 h-4" />
                {category.name} 교육
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-white/80 mb-6 leading-relaxed max-w-2xl">
                {course.description}
              </p>

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
                  수강기간 30일
                </span>
              </div>
            </div>

            {/* Price Card - Desktop */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <div className="text-center mb-6">
                  <span className="text-sm text-primary-500">수강료</span>
                  <div className="text-4xl font-bold text-primary-900">
                    {course.price.toLocaleString()}
                    <span className="text-lg font-normal">원</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold py-4 rounded-xl mb-3 transition-all shadow-lg shadow-accent-500/25">
                  수강신청 하기
                </button>
                <a
                  href="tel:1544-0000"
                  className="w-full flex items-center justify-center gap-2 bg-primary-100 text-primary-900 font-semibold py-4 rounded-xl hover:bg-primary-200 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  전화 상담
                </a>

                <div className="mt-6 pt-6 border-t border-primary-100 space-y-3">
                  {[
                    { icon: Shield, text: '법원·검찰 인정 교육' },
                    { icon: Award, text: '수료증 즉시 발급' },
                    { icon: Monitor, text: '온라인 24시간 수강' },
                    { icon: Clock, text: '수강 기간 30일' },
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
          </div>
        </div>
      </section>

      {/* Mobile Price Card */}
      <section className="lg:hidden -mt-6 relative z-10 px-4">
        <div className="container-custom">
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
                법원 인정
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
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 bg-primary-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Features */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-secondary-600" />
                  </div>
                  과정 특징
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {course.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
                    >
                      <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-primary-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  교육 과정
                </h2>
                <div className="space-y-4">
                  {curriculum.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-5 bg-gradient-to-r from-primary-50 to-transparent rounded-2xl hover:from-primary-100 transition-colors group"
                    >
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
                  ))}
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-br from-accent-50 to-secondary-50 border border-accent-200 rounded-3xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-900 text-lg mb-2">수료증 안내</h3>
                    <p className="text-primary-600 leading-relaxed">
                      본 교육과정을 이수하시면 법원 및 검찰에서 인정하는 공인 수료증이 발급됩니다.
                      수료증은 교육 완료 후 즉시 PDF로 발급되며, 출력하여 제출하실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-primary-900 mb-4">상담 문의</h3>
                <div className="space-y-3">
                  {[
                    { icon: Phone, title: '전화 상담', value: '1544-0000', color: 'bg-blue-500' },
                    { icon: Mail, title: '이메일', value: 'support@krpic.co.kr', color: 'bg-violet-500' },
                    { icon: MessageCircle, title: '카카오톡', value: '@krpic', color: 'bg-amber-500' },
                  ].map((contact) => (
                    <div
                      key={contact.title}
                      className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
                    >
                      <div className={`w-10 h-10 ${contact.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <contact.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-primary-500">{contact.title}</div>
                        <div className="font-semibold text-primary-900">{contact.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-6 text-white">
                <h3 className="font-bold mb-4">빠른 안내</h3>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-400" />
                    결제 후 즉시 수강 가능
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-400" />
                    PC, 모바일 모두 지원
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-400" />
                    진도율 자동 저장
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-400" />
                    수료증 PDF 다운로드
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-2">
                관련 교육과정
              </h2>
              <p className="text-primary-600">
                {category.name} 교육의 다른 과정도 살펴보세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedCourses.map((relatedCourse) => (
                <Link
                  key={relatedCourse.id}
                  href={`/education/${categorySlug}/${relatedCourse.id}`}
                  className="group"
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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            지금 바로 교육을 시작하세요
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            전문 상담사가 상황에 맞는 최적의 교육과정을 안내해 드립니다
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:1544-0000"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-accent-500/25"
            >
              <Phone className="w-5 h-5" />
              1544-0000
            </a>
            <Link
              href={`/education/${categorySlug}`}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
