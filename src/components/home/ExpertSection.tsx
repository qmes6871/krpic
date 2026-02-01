'use client';

/* eslint-disable @next/next/no-img-element */
import { Scale, Brain, Shield, Award, CheckCircle } from 'lucide-react';
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
              <strong className="text-primary-900">공인자격 심리상담사</strong>가<br className="hidden md:block" />
              양형을 위해 한 자리에 모였습니다.
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Image Section */}
          <FadeIn delay={100} direction="right">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary-200 via-primary-200 to-secondary-200 rounded-3xl blur-2xl opacity-50" />
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-primary-100">
                <div className="aspect-[4/3] relative">
                  <img
                    src="/images/lawyer-kim-optimized.jpg"
                    alt="전문 변호사"
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
                      <div className="text-white font-bold text-lg">유나이트 김 후 변호사</div>
                      <div className="text-white/80 text-sm">대한변호사협회 등록</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Content Section */}
          <div className="space-y-6">
            <FadeIn delay={200}>
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Scale className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary-900 mb-2">법률사무소 유나이트 변호사</h3>
                    <p className="text-primary-600 leading-relaxed mb-3">
                      대한변호사협회에 등록된 법률사무소와 함께<br />
                      양형에 유리한 교육 수료증을 발급해 드립니다.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-sm text-primary-700 bg-white px-3 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 text-secondary-500" />
                        양형 자료 활용
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-primary-700 bg-white px-3 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 text-secondary-500" />
                        법원 제출 가능
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-gradient-to-br from-secondary-50 to-accent-50 rounded-2xl p-6 border border-secondary-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary-900 mb-2">심리상담 전문가</h3>
                    <p className="text-primary-600 leading-relaxed mb-3">
                      국가공인 자격을 보유한 심리상담사가<br />
                      체계적인 재범방지 교육 프로그램을 운영합니다.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-sm text-primary-700 bg-white px-3 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 text-secondary-500" />
                        공인 자격 보유
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-primary-700 bg-white px-3 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 text-secondary-500" />
                        전문 상담 지원
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-900 rounded-2xl p-5 text-center">
                  <Award className="w-8 h-8 text-accent-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">1500+</div>
                  <div className="text-white/70 text-sm">성공 사례</div>
                </div>
                <div className="bg-secondary-600 rounded-2xl p-5 text-center">
                  <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-white/70 text-sm">실제 양형자료 채택</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
