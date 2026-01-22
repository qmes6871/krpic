import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Clock,
  User,
  CheckCircle,
  ArrowRight,
  Shield,
  Award,
  Monitor,
  Zap,
  ChevronRight,
  BookOpen,
  Phone,
} from 'lucide-react';
import { categories, getCategoryBySlug } from '@/data/categories';
import { getCoursesByCategory } from '@/data/courses';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: '카테고리를 찾을 수 없습니다 - KRPIC',
    };
  }

  return {
    title: `${category.name} 교육 - KRPIC 재범방지교육통합센터`,
    description: category.description,
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

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const courses = getCoursesByCategory(category.id);
  const gradient = gradientMap[category.color] || 'from-primary-800 to-primary-900';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-white/70">
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
              <li className="text-white font-medium">{category.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-6">
                <BookOpen className="w-4 h-4" />
                {courses.length}개 교육과정 운영 중
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {category.name} 교육
              </h1>

              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                {category.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:1544-0000"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  상담 신청
                </a>
                <Link
                  href="/education"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all"
                >
                  전체 교육 보기
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { icon: Shield, value: '법원 인정', label: '공인 수료증 발급' },
                { icon: Monitor, value: '온라인', label: '24시간 수강 가능' },
                { icon: Award, value: '즉시 발급', label: '수료증 자동 발급' },
                { icon: Zap, value: '전문 강사', label: '체계적인 교육' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all"
                >
                  <stat.icon className="w-7 h-7 text-white mb-3" />
                  <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stats */}
      <section className="lg:hidden -mt-8 relative z-10 px-4">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '법원 인정', label: '공인 수료증' },
              { value: '온라인', label: '24시간 수강' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-4 shadow-lg text-center"
              >
                <div className="text-lg font-bold text-primary-900">{stat.value}</div>
                <div className="text-primary-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 px-4 bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 text-sm font-medium mb-4">
              교육과정 선택
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              나에게 맞는 교육을 선택하세요
            </h2>
            <p className="text-primary-600 max-w-2xl mx-auto">
              전문 강사진이 설계한 체계적인 교육 프로그램으로 성공적인 이수를 지원합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {courses.map((course, index) => (
              <Link
                key={course.id}
                href={`/education/${categorySlug}/${course.id}`}
                className="group"
              >
                <div className="h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-primary-100 transition-all duration-300 hover:-translate-y-2">
                  {/* Course Header */}
                  <div className={`bg-gradient-to-br ${gradient} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {course.instructor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course Body */}
                  <div className="p-6">
                    <p className="text-primary-600 mb-6 line-clamp-2">
                      {course.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {course.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-primary-700">
                          <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 text-secondary-600" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                      <div>
                        <span className="text-sm text-primary-500">수강료</span>
                        <div className="text-2xl font-bold text-primary-900">
                          {course.price.toLocaleString()}원
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 px-5 py-3 bg-primary-900 text-white font-medium rounded-xl group-hover:bg-primary-800 transition-colors">
                        자세히 보기
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
                {category.name} 교육 특징
              </h2>
              <p className="text-primary-600">
                KRPIC만의 차별화된 교육 서비스를 경험하세요
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: '법원·검찰 인정', desc: '공인 재범방지교육 수료증', color: 'bg-blue-500' },
                { icon: Monitor, title: '온라인 수강', desc: '언제 어디서나 24시간', color: 'bg-violet-500' },
                { icon: User, title: '전문 강사진', desc: '체계적인 커리큘럼', color: 'bg-pink-500' },
                { icon: Award, title: '즉시 발급', desc: '수료 후 바로 수료증', color: 'bg-amber-500' },
              ].map((item) => (
                <div key={item.title} className="group text-center">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-primary-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-primary-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            지금 바로 교육을 시작하세요
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            전문 상담사가 상황에 맞는 최적의 교육과정을 안내해 드립니다
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:1544-0000"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-accent-500/25"
            >
              <Phone className="w-5 h-5" />
              1544-0000 상담 신청
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              센터 안내 보기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
