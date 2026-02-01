'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  CheckCircle,
  ClipboardList,
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
  Building2,
} from 'lucide-react';

const courses = [
  {
    id: 'detention-basic',
    title: '수감자 교육 기본과정',
    price: 150000,
    duration: '1시간',
    features: [
      '재범방지교육 수료증',
      '인지행동개선훈련 교육 수료증',
      '준법의식교육 수료증',
      '재범방지교육통합센터 교육내용 증명서',
      '재범방지교육 상세 교육과정 증명서',
      '인지행동개선훈련 상세 교육과정 증명서',
      '준법의식교육 상세 교육과정 증명서',
      '재범 위험 종합 관리 평가 증명서',
    ],
    gradient: 'from-blue-500 to-blue-600',
    icon: BookOpen,
  },
  {
    id: 'detention-efficient',
    title: '수감자 교육 효율과정',
    price: 250000,
    duration: '1시간',
    features: [
      '재범방지교육 수료증',
      '인지행동개선훈련 교육 수료증',
      '준법의식교육 수료증',
      '재범방지교육통합센터 교육내용 증명서',
      '재범방지교육 상세 교육과정 증명서',
      '인지행동개선훈련 상세 교육과정 증명서',
      '준법의식교육 상세 교육과정 증명서',
      '심리상담사와 편지를 통한 상담',
      '심리상담사 종합 소견서',
      '심리상담 소감문 제출 (대필 양식 제공)',
      '형사사건 전문 변호사와 편지를 통한 상담',
      '변호사 상담 증명서 [위법공포(違法恐怖) 내용 첨부]',
      '재범 위험 종합 관리 평가 증명서',
    ],
    gradient: 'from-violet-500 to-purple-600',
    icon: Heart,
    popular: true,
  },
  {
    id: 'detention-integrated',
    title: '수감자 교육 통합과정',
    price: 350000,
    duration: '1시간',
    features: [
      '재범방지교육 수료증',
      '인지행동개선훈련 교육 수료증',
      '준법의식교육 수료증',
      '재범방지교육통합센터 교육내용 증명서',
      '재범방지교육 상세 교육과정 증명서',
      '인지행동개선훈련 상세 교육과정 증명서',
      '준법의식교육 상세 교육과정 증명서',
      '심리상담사와 편지를 통한 상담',
      '심리상담사 종합 소견서',
      '심리상담 소감문 제출 (간편대필 양식 제공)',
      '형사사건 전문 변호사와 편지를 통한 상담',
      '변호사 상담 증명서 [위법공포(違法恐怖) 내용 첨부]',
      '재범방지교육통합센터 서명 탄원서 1부 제출',
      '재범방지교육통합센터 서명 소견서 1부 제출',
      '재범방지교육·인지행동개선·준법의식 각 이수 소감문 제출 (간편대필 양식 제공)',
      '재범방지를 위한 준법생활 계획서',
      '반성문 1회 대필 (분량은 사건에 따라 상이)',
      '효과적인 반성문 작성 가이드 양식',
      '재범 위험 종합 관리 평가 증명서',
    ],
    gradient: 'from-emerald-500 to-teal-600',
    icon: Briefcase,
  },
];

const steps = [
  {
    number: '01',
    title: '교육 신청',
    description: '수감자의 보호자가 교육을 신청합니다.',
    icon: ClipboardList,
  },
  {
    number: '02',
    title: '교육 내용 전달',
    description: '교육 배정 후 교육 내용을 수감자에게 전달합니다.',
    icon: FileCheck,
  },
  {
    number: '03',
    title: '수료증 발급',
    description: '수감자의 교육 소감문을 받아 수료증 및 증명서를 발급합니다.',
    icon: BookOpen,
  },
  {
    number: '04',
    title: '양형자료 제출',
    description: '재범방지교육통합센터에서 발급한 양형자료를 재판부에 제출합니다.',
    icon: Award,
  },
];

export default function DetentionEducationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <Image
          src="/images/detention/hero.jpg"
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
                    href="http://pf.kakao.com/_stxkUn/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40"
                  >
                    <MessageCircle className="w-5 h-5" />
                    카카오톡 상담
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
                  { value: '법원 양형자료 채택', label: '수료증 발급', icon: Shield },
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
              { value: '법원 양형자료 채택', label: '수료증' },
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div style={{ opacity: 1, transform: 'translate3d(0px, 0px, 0px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out' }}>
              <Link className="group block h-full" href="/education/detention/b5ff4ad3-d24b-457a-a0ab-d1d0866a73bf">
                <div className="h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-primary-100 transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-gradient-to-br from-primary-800 to-primary-900 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-white text-xs font-semibold">양형자료 8종 포함</span>
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">수감자 교육 기본과정</h3>
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />1시간</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />전문 상담사</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-primary-600 mb-6 line-clamp-2">구속 수감자를 위한 기본 재범방지교육 과정입니다.</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-sm text-primary-700">
                        <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-secondary-600" />
                        </div>
                        재범방지교육 수료증
                      </li>
                      <li className="flex items-center gap-2 text-sm text-primary-700">
                        <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-secondary-600" />
                        </div>
                        인지행동개선훈련 교육 수료증
                      </li>
                      <li className="flex items-center gap-2 text-sm text-primary-700">
                        <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-secondary-600" />
                        </div>
                        준법의식교육 수료증
                      </li>
                    </ul>
                    <div className="mb-6 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">+ 외 5개 양형자료 더 포함</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                      <div>
                        <span className="text-sm text-primary-500">수강료</span>
                        <div className="text-2xl font-bold text-primary-900">150,000원</div>
                      </div>
                      <div className="inline-flex items-center gap-2 px-5 py-3 bg-primary-900 text-white font-medium rounded-xl group-hover:bg-primary-800 transition-colors">
                        자세히 보기
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div style={{ opacity: 1, transform: 'translate3d(0px, 0px, 0px)', transition: 'opacity 0.6s ease-out 100ms, transform 0.6s ease-out' }}>
              <Link className="group block h-full" href="/education/detention/30361769-10d2-42bf-a8fb-11cf04c6d38c">
                <div className="h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-primary-100 transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-gradient-to-br from-primary-800 to-primary-900 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-white text-xs font-semibold">양형자료 13종 포함</span>
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">수감자 교육 효율과정</h3>
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />1시간</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />전문 상담사</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-primary-600 mb-6 line-clamp-2">구속 수감자를 위한 심화 교육과 전문 상담을 포함한 효율 과정입니다.</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-sm text-primary-700">
                        <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-secondary-600" />
                        </div>
                        재범방지교육 수료증
                      </li>
                      <li className="flex items-center gap-2 text-sm text-primary-700">
                        <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-secondary-600" />
                        </div>
                        인지행동개선훈련 교육 수료증
                      </li>
                      <li className="flex items-center gap-2 text-sm text-primary-700">
                        <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-secondary-600" />
                        </div>
                        준법의식교육 수료증
                      </li>
                    </ul>
                    <div className="mb-6 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">+ 외 10개 양형자료 더 포함</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                      <div>
                        <span className="text-sm text-primary-500">수강료</span>
                        <div className="text-2xl font-bold text-primary-900">250,000원</div>
                      </div>
                      <div className="inline-flex items-center gap-2 px-5 py-3 bg-primary-900 text-white font-medium rounded-xl group-hover:bg-primary-800 transition-colors">
                        자세히 보기
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="md:col-span-2 max-w-lg mx-auto w-full" style={{ opacity: 1, transform: 'translate3d(0px, 0px, 0px)', transition: 'opacity 0.6s ease-out 200ms, transform 0.6s ease-out' }}>
              <Link className="group block h-full" href="/education/detention/e0fa5755-037a-4755-aa8f-9e380cb91844">
                <div className="h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-primary-100 transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-gradient-to-br from-primary-800 to-primary-900 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-white text-xs font-semibold">양형자료 19종 포함</span>
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">수감자 교육 통합과정</h3>
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />1시간</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />전문 상담사</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-primary-600 mb-6 line-clamp-2">구속 수감자를 위한 종합 교육 프로그램으로 모든 지원을 포함합니다.</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-sm text-primary-700">
                        <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-secondary-600" />
                        </div>
                        재범방지교육 수료증
                      </li>
                      <li className="flex items-center gap-2 text-sm text-primary-700">
                        <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-secondary-600" />
                        </div>
                        인지행동개선훈련 교육 수료증
                      </li>
                      <li className="flex items-center gap-2 text-sm text-primary-700">
                        <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-secondary-600" />
                        </div>
                        준법의식교육 수료증
                      </li>
                    </ul>
                    <div className="mb-6 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">+ 외 16개 양형자료 더 포함</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                      <div>
                        <span className="text-sm text-primary-500">수강료</span>
                        <div className="text-2xl font-bold text-primary-900">350,000원</div>
                      </div>
                      <div className="inline-flex items-center gap-2 px-5 py-3 bg-primary-900 text-white font-medium rounded-xl group-hover:bg-primary-800 transition-colors">
                        자세히 보기
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
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
              { icon: Shield, title: '법원 양형자료 채택 수료증', desc: '재판부에서 공식 인정하는 수료증 발급', gradient: 'from-blue-500 to-blue-600' },
              { icon: Users, title: '1:1 전문 상담', desc: '전문 상담사의 맞춤형 상담 제공', gradient: 'from-violet-500 to-purple-600' },
              { icon: Target, title: '사후 관리', desc: '출소 후에도 지속적인 관리 지원', gradient: 'from-pink-500 to-rose-500' },
              { icon: Zap, title: '유연한 학습', desc: '수감자 환경에 맞는 오프라인 학습', gradient: 'from-emerald-500 to-teal-600' },
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

                <div className="bg-secondary-50 border border-secondary-200 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-primary-900 text-lg mb-2">24시간 카카오톡 상담</h4>
                  <p className="text-primary-600 text-sm mb-4">
                    새벽이든, 주말이든 편하게 문의하세요.<br />
                    전문 상담사가 빠르게 답변드립니다.
                  </p>
                  <a
                    href="http://pf.kakao.com/_stxkUn/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-secondary-600 hover:bg-secondary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    카카오톡 상담하기
                  </a>
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
                    href="http://pf.kakao.com/_stxkUn/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-secondary-900 font-semibold rounded-xl hover:bg-secondary-50 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    카카오톡 상담
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
