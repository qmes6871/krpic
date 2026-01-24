'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Award, Users, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-primary-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-main.jpg"
          alt="전문 교육"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Multi-layer gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/95 to-primary-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-primary-900/50" />

        {/* Animated gradient accent */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-accent-500/30 to-transparent rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-secondary-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <div className="container-custom relative z-10 pt-20 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content - 7 columns */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 mt-4 md:mt-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-400"></span>
              </span>
              <span className="text-sm font-medium text-white/90">
                법원·검찰·경찰 재범방지 교육기관
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6" style={{ lineHeight: 1.1 }}
            >
              새로운 시작
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-accent-400 via-accent-300 to-secondary-400 bg-clip-text text-transparent">
                  KRPIC
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full"
                />
              </span>
              과 함께
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-xl"
            >
              대한변호사협회 등록된 법률사무소 유나이트 변호사 · 공신자격이 있는<br />
              심리상담사가 양형을 위해 한 자리에 모였습니다.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                href="/education"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-accent-500/30 hover:-translate-y-1"
              >
                <span className="relative z-10">수강신청 하기</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/reviews" className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
                <span>수강생 후기</span>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-x-8 gap-y-4 mt-4 md:mt-0"
            >
              {[
                { icon: Shield, text: '100% 온라인 수강' },
                { icon: Award, text: '수료증 즉시 발급' },
                { icon: Clock, text: '24시간 학습 가능' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-secondary-400" />
                  </div>
                  <span className="text-sm font-medium text-white/70">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Stats Card - 5 columns */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 hidden lg:block perspective-1000"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-500/20 via-secondary-500/20 to-accent-500/20 rounded-3xl blur-xl opacity-50" />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">실시간 현황</h3>
                        <p className="text-white/50 text-sm">Live Statistics</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-500/20 rounded-full">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-400"></span>
                      </span>
                      <span className="text-secondary-400 text-xs font-medium">LIVE</span>
                    </div>
                  </div>

                  {/* Main Stat */}
                  <div className="mb-6">
                    <div className="text-6xl font-bold text-white mb-1">
                      2,328<span className="text-accent-400">+</span>
                    </div>
                    <p className="text-white/60">누적 수강생</p>
                  </div>

                  {/* Sub Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div className="bg-white/5 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-white mb-1">98%</div>
                      <div className="text-white/50 text-sm">수료율</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-white mb-1">4.9</div>
                      <div className="text-white/50 text-sm flex items-center gap-1">
                        평균 평점
                        <Sparkles className="w-3 h-3 text-accent-400" />
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-6 space-y-3">
                    {['법원 양형자료 채택', '전문 상담사 지원', '모바일 완벽 지원'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-secondary-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge - Bottom Left */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 -bottom-4 bg-white rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-primary-900 font-bold">2,282+</div>
                    <div className="text-primary-500 text-xs">수료증 발급</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge - Top Right */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 -top-4 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold text-sm">법원 양형자료 채택</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
