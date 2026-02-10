'use client';

/* eslint-disable @next/next/no-img-element */
import { Scale, Brain, Shield, Award } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

export default function ExpertSection() {
  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-secondary-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary-100/50 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              전문가와 함께하세요
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              법률과 심리, 최고의 전문가가 함께합니다
            </h2>
            <p className="text-primary-600 max-w-3xl mx-auto text-lg leading-relaxed">
              <strong className="text-primary-900">대한변호사협회 등록 법률사무소 변호사</strong>와{' '}
              <strong className="text-primary-900">KAC인증 심리상담사</strong>가<br className="hidden md:block" />
              양형을 위해 한 자리에 모였습니다.
            </p>
          </div>
        </FadeIn>

        {/* Expert Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Lawyer Card */}
          <FadeIn delay={100} direction="up">
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-primary-200 to-primary-300 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-primary-100">
                <div className="aspect-[4/5] relative">
                  <img
                    src="/images/lawyer-kim-optimized.jpg"
                    alt="김후 변호사"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center 20%' }}
                  />
                </div>
                <div className="p-5 bg-gradient-to-r from-primary-900 to-primary-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Scale className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">김후 변호사</div>
                      <div className="text-white/80 text-sm">법률사무소 유나이트</div>
                      <div className="text-accent-300 text-xs mt-0.5">대한변호사협회 등록</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Counselor Card */}
          <FadeIn delay={200} direction="up">
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-secondary-200 to-secondary-300 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-secondary-100">
                <div className="aspect-[4/5] relative">
                  <img
                    src="/images/counselor-kim-taehoon.png"
                    alt="김태훈 심리상담사"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center 15%' }}
                  />
                </div>
                <div className="p-5 bg-gradient-to-r from-secondary-600 to-secondary-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">김태훈 심리상담사</div>
                      <div className="text-white/80 text-sm">재범방지교육 전문</div>
                      <div className="text-accent-300 text-xs mt-0.5">KAC인증 자격 (KAC13239)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Stats */}
        <FadeIn delay={300}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-primary-900 rounded-2xl p-5 text-center">
              <Award className="w-8 h-8 text-accent-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1500+</div>
              <div className="text-white/70 text-sm">성공 사례</div>
            </div>
            <div className="bg-secondary-600 rounded-2xl p-5 text-center">
              <Shield className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-white/70 text-sm">양형자료 채택</div>
            </div>
            <div className="bg-primary-800 rounded-2xl p-5 text-center">
              <Scale className="w-8 h-8 text-accent-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">법률사무소</div>
              <div className="text-white/70 text-sm">대한변협 등록</div>
            </div>
            <div className="bg-secondary-500 rounded-2xl p-5 text-center">
              <Brain className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">KAC인증</div>
              <div className="text-white/70 text-sm">공인 심리상담</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
