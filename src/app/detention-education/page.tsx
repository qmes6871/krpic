'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  CheckCircle,
  Phone,
  Shield,
  BookOpen,
  Users,
  Heart,
  Target,
  ArrowRight,
  Briefcase,
  MessageCircle,
  Award,
  Zap,
  FileCheck,
  Mail,
  Building2,
} from 'lucide-react';

const courses = [
  {
    id: 'detention-basic',
    title: '구속 수감자 기본 교육과정',
    description: '수감 중인 분들을 위한 기본 재범방지교육 프로그램입니다. 자기 성찰과 사회 복귀 준비를 돕습니다.',
    price: 80000,
    duration: '16시간',
    features: ['자기 성찰 교육', '법률 상식', '사회 복귀 준비', '상담 연계'],
    gradient: 'from-blue-500 to-blue-600',
    icon: BookOpen,
  },
  {
    id: 'detention-counseling',
    title: '심리 상담 연계 교육과정',
    description: '전문 상담사와 함께하는 심리 상담이 포함된 교육 프로그램입니다.',
    price: 120000,
    duration: '24시간',
    features: ['1:1 심리 상담', '그룹 치료', '가족 상담 연계', '사후 관리'],
    gradient: 'from-violet-500 to-purple-600',
    icon: Heart,
  },
  {
    id: 'detention-job',
    title: '직업 재활 교육과정',
    description: '출소 후 안정적인 사회 복귀를 위한 직업 재활 교육 프로그램입니다.',
    price: 100000,
    duration: '20시간',
    features: ['직업 탐색', '이력서 작성', '면접 준비', '취업 연계'],
    gradient: 'from-emerald-500 to-teal-600',
    icon: Briefcase,
  },
];

const steps = [
  {
    number: '01',
    title: '상담 신청',
    description: '전화 또는 이메일로 상담을 신청하시면 담당자가 연락드립니다.',
    icon: Phone,
  },
  {
    number: '02',
    title: '교육 배정',
    description: '상담 결과에 따라 적합한 교육과정이 배정됩니다.',
    icon: FileCheck,
  },
  {
    number: '03',
    title: '교육 수강',
    description: '교정시설 내에서 온라인 또는 오프라인으로 교육을 수강합니다.',
    icon: BookOpen,
  },
  {
    number: '04',
    title: '수료 및 사후관리',
    description: '교육 이수 후 수료증이 발급되며, 필요시 사후 상담이 제공됩니다.',
    icon: Award,
  },
];

export default function DetentionEducationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <Image
          src="/krpic/images/detention/hero.jpg"
          alt="구속 수감자 교육"
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
                  <Shield className="w-4 h-4 text-accent-400" />
                  구속 수감자 전문 교육
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  새로운 시작을 위한,<br />
                  <span className="bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">
                    맞춤형 교육
                  </span>
                </h1>

                <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
                  수감 중이신 분들의 성공적인 사회 복귀를 위한
                  체계적이고 전문적인 재범방지교육 프로그램을 제공합니다.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="tel:1544-0000"
                    className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40"
                  >
                    <Phone className="w-5 h-5" />
                    상담 신청하기
                  </a>
                  <Link
                    href="/education"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    <BookOpen className="w-5 h-5" />
                    전체 교육과정 보기
                  </Link>
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
                  { value: '법원 인정', label: '공인 수료증 발급', icon: Shield },
                  { value: '1:1 상담', label: '전문 상담사 배정', icon: Users },
                  { value: '3개', label: '맞춤 교육 과정', icon: BookOpen },
                  { value: '24시간', label: '온라인 학습 지원', icon: Clock },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all"
                  >
                    <stat.icon className="w-8 h-8 text-accent-400 mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
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
              { value: '법원 인정', label: '공인 수료증' },
              { value: '1:1 상담', label: '전문 상담사' },
              { value: '3개', label: '맞춤 교육 과정' },
              { value: '24시간', label: '온라인 학습' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-4 shadow-lg text-center"
              >
                <div className="text-xl font-bold text-primary-900">{stat.value}</div>
                <div className="text-primary-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section - Bento Style */}
      <section className="py-20 px-4 bg-primary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 text-sm font-medium mb-4">
              맞춤형 교육과정
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-900 mb-4">
              상황에 맞는 교육과정을 선택하세요
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              전문가가 설계한 체계적인 프로그램으로 성공적인 사회 복귀를 지원합니다
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-primary-100 transition-all duration-300 hover:-translate-y-2">
                  {/* Course Header */}
                  <div className={`bg-gradient-to-br ${course.gradient} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                        <course.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                    </div>
                  </div>

                  {/* Course Body */}
                  <div className="p-6">
                    <p className="text-primary-600 mb-6">
                      {course.description}
                    </p>

                    <ul className="space-y-3 mb-6">
                      {course.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-primary-700">
                          <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 text-secondary-600" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                      <div>
                        <span className="text-sm text-primary-500">교육비</span>
                        <div className="text-2xl font-bold text-primary-900">
                          {course.price.toLocaleString()}원
                        </div>
                      </div>
                      <button className="inline-flex items-center gap-2 px-5 py-3 bg-primary-900 text-white font-medium rounded-xl hover:bg-primary-800 transition-colors group-hover:gap-3">
                        상담 신청
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              이용 절차
            </h2>
            <p className="text-primary-600 max-w-2xl mx-auto">
              구속 수감자 교육은 아래 절차에 따라 진행됩니다
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-primary-200 -translate-x-1/2 z-0" />
                  )}

                  <div className="bg-primary-50 rounded-2xl p-6 hover:bg-primary-100 transition-all relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-900 to-primary-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-bold text-secondary-600 mb-2">STEP {step.number}</div>
                    <h3 className="font-bold text-primary-900 text-lg mb-2">{step.title}</h3>
                    <p className="text-primary-600 text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              KRPIC만의 특별한 지원
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              구속 수감자의 성공적인 사회 복귀를 위해 다양한 지원을 제공합니다
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Shield, title: '법원 인정 수료증', desc: '재판부에서 공식 인정하는 수료증 발급', gradient: 'from-blue-500 to-blue-600' },
              { icon: Users, title: '1:1 전문 상담', desc: '전문 상담사의 맞춤형 상담 제공', gradient: 'from-violet-500 to-purple-600' },
              { icon: Target, title: '사후 관리', desc: '출소 후에도 지속적인 관리 지원', gradient: 'from-pink-500 to-rose-500' },
              { icon: Zap, title: '유연한 학습', desc: '교정시설 내 온/오프라인 학습', gradient: 'from-emerald-500 to-teal-600' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 text-sm font-medium mb-4">
                  상담 안내
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
                  궁금하신 점이 있으신가요?
                </h2>
                <p className="text-primary-600 mb-8 text-lg">
                  구속 수감자 교육에 대해 궁금하신 점이 있으시면
                  전문 상담사에게 문의해 주세요. 친절하게 안내해 드립니다.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Phone, title: '전화 상담', value: '1544-0000', sub: '평일 09:00~18:00', color: 'bg-blue-500' },
                    { icon: Mail, title: '이메일', value: 'support@krpic.co.kr', sub: '24시간 접수', color: 'bg-violet-500' },
                    { icon: MessageCircle, title: '카카오톡', value: '@krpic', sub: '실시간 상담', color: 'bg-amber-500' },
                  ].map((contact) => (
                    <div
                      key={contact.title}
                      className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
                    >
                      <div className={`w-12 h-12 ${contact.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <contact.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-primary-900">{contact.title}</div>
                        <div className="text-secondary-600">{contact.value}</div>
                      </div>
                      <div className="text-sm text-primary-400">{contact.sub}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-3xl p-8 md:p-10 text-white"
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  지금 바로 상담 신청하세요
                </h3>
                <p className="text-white/80 mb-8">
                  구속 수감자 교육 전문 상담사가 상황에 맞는 최적의 교육과정을 안내해 드립니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:1544-0000"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-secondary-900 font-semibold rounded-xl hover:bg-secondary-50 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    1544-0000
                  </a>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                  >
                    센터 안내 보기
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
