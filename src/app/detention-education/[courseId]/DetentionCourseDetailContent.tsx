'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Clock,
  CheckCircle,
  Shield,
  ArrowRight,
  MessageCircle,
  BookOpen,
  FileCheck,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { DetentionCourse } from '@/data/detention-courses';

interface Props {
  course: DetentionCourse;
  otherCourses: DetentionCourse[];
}

export default function DetentionCourseDetailContent({ course, otherCourses }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative py-20 md:py-28 bg-gradient-to-br ${course.gradient} overflow-hidden`}>
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="container-custom relative">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/detention-education"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              구속 수감자 교육으로 돌아가기
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Clock className="w-5 h-5 text-white/80" />
                  <span className="text-white font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <FileCheck className="w-5 h-5 text-white/80" />
                  <span className="text-white font-medium">{course.features.length}개 항목 포함</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="http://pf.kakao.com/_stxkUn/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-primary-900 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  카카오톡 상담 신청
                </a>
                <Link
                  href="/detention-education"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  다른 과정 보기
                </Link>
              </div>
            </motion.div>

            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="text-primary-500 text-sm font-medium mb-2">교육비</div>
                  <div className="text-4xl md:text-5xl font-bold text-primary-900">
                    {course.price.toLocaleString()}
                    <span className="text-2xl">원</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-primary-600">
                    <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-primary-900">법원 양형자료 채택</div>
                      <div className="text-sm">재판부에서 공식 인정</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-primary-600">
                    <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <div className="font-medium text-primary-900">1년간 자유 수강</div>
                      <div className="text-sm">결제일로부터 1년 이용</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-primary-600">
                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <div className="font-medium text-primary-900">24시간 상담 지원</div>
                      <div className="text-sm">카카오톡으로 언제든 문의</div>
                    </div>
                  </div>
                </div>

                <a
                  href="http://pf.kakao.com/_stxkUn/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary-900 hover:bg-primary-800 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  지금 상담 신청하기
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              포함 내역
            </h2>
            <p className="text-primary-600">
              {course.title}에 포함된 모든 혜택을 확인하세요
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {course.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 bg-primary-50 rounded-xl p-4 hover:bg-primary-100 transition-colors"
                >
                  <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-primary-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other Courses Section */}
      <section className="py-16 md:py-24 bg-primary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              다른 교육과정
            </h2>
            <p className="text-primary-600">
              상황에 맞는 다른 교육과정도 확인해 보세요
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {otherCourses.map((otherCourse, index) => (
              <motion.div
                key={otherCourse.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/detention-education/${otherCourse.id}`}>
                  <div className={`bg-gradient-to-br ${otherCourse.gradient} rounded-2xl p-6 text-white hover:scale-[1.02] transition-transform relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                      <h3 className="text-xl font-bold mb-2">{otherCourse.title}</h3>
                      <div className="text-2xl font-bold mb-3">
                        {otherCourse.price.toLocaleString()}원
                      </div>
                      <div className="text-white/80 text-sm mb-4">
                        {otherCourse.features.length}개 항목 포함
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm font-medium">
                        자세히 보기
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              지금 바로 상담 신청하세요
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              전문 상담사가 상황에 맞는 최적의 교육과정을 안내해 드립니다.<br />
              24시간 카카오톡으로 편하게 문의하세요.
            </p>
            <a
              href="http://pf.kakao.com/_stxkUn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-accent-500/25"
            >
              <MessageCircle className="w-5 h-5" />
              카카오톡 상담하기
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
