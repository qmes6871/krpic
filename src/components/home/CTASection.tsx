'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, CheckCircle, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900" />

      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/90 mb-8">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span>지금 바로 시작하세요</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              새로운 시작,
              <br className="md:hidden" />
              <span className="bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">
                {' '}KRPIC
              </span>
              와 함께
            </h2>

            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              전문 상담사가 여러분의 성공적인 교육 이수와 사회 복귀를 도와드립니다.
              지금 바로 첫 걸음을 내딛어 보세요.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
              {['법원 인정 공인교육', '100% 온라인 수강', '수료증 즉시 발급'].map(
                (benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-white/80"
                  >
                    <CheckCircle className="w-5 h-5 text-secondary-400" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </motion.div>
                )
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/education"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-900 font-semibold rounded-xl overflow-hidden transition-all hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5"
              >
                <span>수강신청 하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:1544-0000"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                <Phone className="w-5 h-5" />
                <span>1544-0000</span>
              </a>
            </div>

            {/* Trust Text */}
            <p className="text-white/50 text-sm mt-8">
              평일 09:00~18:00 상담 가능 · 주말/공휴일 온라인 접수
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
