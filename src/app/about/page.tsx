'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  Monitor,
  Heart,
  Users,
  Target,
  Award,
  FileCheck,
  ArrowRight,
  MessageCircle,
  Clock,
  Shield,
  BookOpen,
  Scale,
  Play,
  Zap,
  BadgeCheck
} from 'lucide-react';

const features = [
  {
    icon: Monitor,
    title: '온라인 학습부터 수료증까지',
    description:
      '시간과 장소에 구애받지 않고 온라인 학습이 가능하며, 평가를 거친 뒤 자동으로 수료증이 발급되는 편리한 시스템을 제공하여 접근성과 효율성을 강화했습니다.',
  },
  {
    icon: Heart,
    title: '비난보다 회복을 우선하는 철학',
    description:
      '단순히 처벌에 그치지 않고, 회복과 긍정적 변화를 중심에 둔 교육 철학을 바탕으로 인간 존엄성과 재사회화의 기회를 존중합니다.',
  },
  {
    icon: Users,
    title: '전문가가 설계한 신뢰 있는 과정',
    description:
      '범죄 심리, 상담, 법률, 사회복지 등 다양한 분야의 전문가들이 참여해 구성한 커리큘럼으로, 실질적 효과와 높은 신뢰성을 보장합니다.',
  },
  {
    icon: Target,
    title: '재범 방지를 위한 실질 교육',
    description:
      '형식적인 강의가 아니라 실제 생활 속에서 활용할 수 있는 실천형 교육을 통해 재범 가능성을 줄이고, 수강자의 행동 변화를 이끌어내는 현실적인 프로그램을 운영합니다.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <Image
          src="/krpic/images/about/hero.jpg"
          alt="KRPIC 재범방지교육통합센터"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-900/60" />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-accent-400 rounded-full animate-ping" />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary-400 rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/5 w-2 h-2 bg-white/50 rounded-full animate-ping animation-delay-2000" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm mb-6">
                  <Building2 className="w-4 h-4 text-accent-400" />
                  재범 방지를 위한 전문기관
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ lineHeight: 1.2 }}>
                  새로운 출발을 위해,<br />
                  <span className="bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">
                    당신과 동행
                  </span>합니다.
                </h1>

                <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
                  저희 재범방지교육통합센터는 재범 예방과 건전한 사회 복귀를 돕기 위해
                  체계적이고 전문적인 교육 프로그램을 제공하는 신뢰할 수 있는 센터입니다.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/education"
                    className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40"
                  >
                    <Play className="w-5 h-5" />
                    교육과정 둘러보기
                  </Link>
                  <a
                    href="http://pf.kakao.com/_stxkUn/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    카카오톡 상담
                  </a>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:grid grid-cols-2 gap-4"
              >
                {[
                  { value: '10년+', label: '교육 운영 경력', icon: Building2 },
                  { value: '50명+', label: '전문 상담사', icon: Users },
                  { value: '16개', label: '교육 과정', icon: BookOpen },
                  { value: '98%', label: '수료율', icon: Award },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all"
                  >
                    <stat.icon className="w-8 h-8 text-accent-400 mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stats */}
      <section className="lg:hidden -mt-16 relative z-10 px-4">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '10년+', label: '교육 운영 경력' },
              { value: '50명+', label: '전문 상담사' },
              { value: '16개', label: '교육 과정' },
              { value: '98%', label: '수료율' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-4 shadow-lg text-center"
              >
                <div className="text-2xl font-bold text-primary-900">{stat.value}</div>
                <div className="text-primary-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Bento Grid */}
      <section className="py-20 px-4 bg-primary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 text-sm font-medium mb-4">
              KRPIC 재범방지교육통합센터
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-900 mb-4">
              모두의 새로운 출발을 위해,
            </h2>
            <p className="text-xl text-secondary-600 font-medium">
              정의와 치유의 교육을 이어갑니다.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {/* Feature 1 - Large */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 group"
            >
              <div className="h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <Monitor className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{features[0].title}</h3>
                  <p className="text-white/80 leading-relaxed text-lg">
                    {features[0].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <div className="h-full bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{features[1].title}</h3>
                  <p className="text-white/80 leading-relaxed">
                    {features[1].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group"
            >
              <div className="h-full bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{features[2].title}</h3>
                  <p className="text-white/80 leading-relaxed">
                    {features[2].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 4 - Large */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 group"
            >
              <div className="h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 translate-x-1/3" />
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{features[3].title}</h3>
                  <p className="text-white/80 leading-relaxed text-lg">
                    {features[3].description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expert Network Section */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-100/30 via-secondary-100/30 to-accent-100/30 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 text-sm font-medium mb-4">
              <Scale className="w-4 h-4" />
              전문가와 함께하세요
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              법률과 심리, 최고의 전문가가 함께합니다
            </h2>
            <p className="text-primary-600 max-w-2xl mx-auto">
              양형에 유리한 수료증 발급을 위해 각 분야 전문가들이 협력합니다
            </p>
          </motion.div>

          {/* 유나이트 로고 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="bg-[#3D2B1F] rounded-3xl shadow-xl p-10 flex flex-col items-center text-center">
              <div className="w-36 h-36 flex items-center justify-center mb-5">
                <Image
                  src="/krpic/images/unite-logo.png"
                  alt="법률사무소 유나이트"
                  width={144}
                  height={144}
                  className="object-contain"
                />
              </div>
              <div className="text-2xl font-bold text-white mb-1">법률사무소 유나이트</div>
              <div className="text-white/70">대한변호사협회 등록 법률사무소</div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 변호사 카드 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="h-full bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Scale className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">법률사무소 유나이트</h3>
                  <p className="text-white/60 text-sm mb-4">대한변호사협회 등록</p>

                  <p className="text-white/80 leading-relaxed mb-6">
                    대한변호사협회에 등록된 법률사무소 변호사와 함께<br />
                    양형에 유리한 교육 수료증을 발급해 드립니다.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <BadgeCheck className="w-4 h-4 text-accent-400" />
                      양형 자료 활용
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <BadgeCheck className="w-4 h-4 text-accent-400" />
                      법원 제출 가능
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 심리상담사 카드 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-full bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">심리상담 전문가</h3>
                  <p className="text-white/60 text-sm mb-4">국가공인 자격 보유</p>

                  <p className="text-white/80 leading-relaxed mb-6">
                    국가공인 자격을 보유한 심리상담사가<br />
                    체계적인 재범방지 교육 프로그램을 운영합니다.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <BadgeCheck className="w-4 h-4 text-white" />
                      공인 자격 보유
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <BadgeCheck className="w-4 h-4 text-white" />
                      전문 상담 지원
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 성과 지표 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { value: '1500+', label: '성공 사례', color: 'bg-primary-900' },
              { value: '100%', label: '양형자료 채택', color: 'bg-secondary-600' },
              { value: '10년+', label: '교육 운영 경력', color: 'bg-accent-500' },
              { value: '98%', label: '수료율', color: 'bg-violet-600' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`${stat.color} rounded-2xl p-5 text-center text-white`}
              >
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - 감형 교육 */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-5" />
        </div>

        <div className="container-custom relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-400 text-sm font-medium mb-6">
              <Scale className="w-4 h-4" />
              민·형사 사건 감형 교육
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto" style={{ lineHeight: 1.2 }}>
              감형 교육은{' '}
              <span className="bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">
                반성을 말로만 하는 것이 아니라,
              </span>
              <br />행동으로 보여주는 과정입니다.
            </h2>

            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              지금 수료증을 통해 책임 있는 태도를 직접 증명해보세요.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {[
              { icon: Scale, title: '법원 양형자료 채택', desc: '재판부에서 공식 인정하는 수료증', gradient: 'from-blue-500 to-blue-600' },
              { icon: Shield, title: '경찰,검찰 양형자료까지', desc: '검찰 단계에서도 유리한 자료', gradient: 'from-violet-500 to-purple-600' },
              { icon: Zap, title: '즉시 발급', desc: '수료 직후 바로 수료증 발급', gradient: 'from-amber-500 to-orange-500' },
              { icon: Monitor, title: '온라인 수강', desc: '24시간 언제 어디서나 학습', gradient: 'from-emerald-500 to-teal-600' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-accent-500/20 to-secondary-500/20 border border-accent-500/30 rounded-2xl p-6 md:p-8 mb-12 max-w-3xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">필수 안내</h3>
                <p className="text-white/80 leading-relaxed">
                  민·형사 사건에서의 감형 교육과 수료증 제출은 이제 선택이 아닌{' '}
                  <span className="text-accent-400 font-bold">필수</span>입니다.
                  전문적인 교육 이수를 통해 진정성 있는 반성의 태도를 보여주세요.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/education"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:-translate-y-0.5"
            >
              <FileCheck className="w-5 h-5" />
              교육과정 보기
            </Link>
            <a
              href="http://pf.kakao.com/_stxkUn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              카카오톡 상담
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why KRPIC - Cards */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              왜 <span className="text-secondary-600">KRPIC</span>인가요?
            </h2>
            <p className="text-primary-600 max-w-2xl mx-auto">
              KRPIC만의 차별화된 서비스로 수강생의 성공적인 사회 복귀를 지원합니다
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: BadgeCheck, title: '법원·검찰 채택 문서', desc: '채택된 수료증 발급', color: 'bg-blue-500' },
              { icon: Clock, title: '24시간 학습', desc: '언제 어디서나 수강 가능', color: 'bg-violet-500' },
              { icon: Users, title: '전문 상담', desc: '1:1 맞춤 상담 지원', color: 'bg-pink-500' },
              { icon: Zap, title: '즉시 발급', desc: '수료 후 바로 수료증 발급', color: 'bg-amber-500' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-primary-100 transition-all duration-300 hover:-translate-y-2 text-center h-full">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-primary-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-primary-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="container-custom relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4 text-accent-400" />
              <span>언제든 편하게 연락하세요</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              문의하기
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              교육에 관해 궁금한 점이 있으시면 언제든지 문의해 주세요.<br className="hidden md:block" />
              전문 상담사가 친절히 안내해 드립니다.
            </p>
          </motion.div>

          {/* 24시간 상담 안내 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-r from-accent-500/20 to-secondary-500/20 border border-accent-500/30 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                24시간 언제든 상담 가능
              </h3>
              <p className="text-white/70 leading-relaxed">
                새벽이든, 주말이든 상관없이 카카오톡으로 편하게 문의하세요.<br />
                전문 상담사가 빠르게 답변드리겠습니다.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <a
              href="http://pf.kakao.com/_stxkUn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-accent-500/25 hover:-translate-y-1 transition-all duration-300 group"
            >
              <MessageCircle className="w-5 h-5" />
              <span>카카오톡 상담하기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
