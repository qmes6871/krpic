'use client';

import { motion } from 'framer-motion';
import { Clock, CreditCard, CheckCircle, XCircle, MessageCircle, Sparkles, Shield } from 'lucide-react';

export default function PolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-accent-400" />
              SERVICE POLICY
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              서비스 제공 기간 &<br className="md:hidden" /> 환불 정책 안내
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              KRPIC 교육 서비스는 수강자의 권리 보호와 투명한 운영을 위해<br className="hidden md:block" />
              명확한 이용 기간과 환불 규정을 운영합니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-900/5 to-transparent" />

        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Service Period Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-primary-900/5 border border-primary-100 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-6 md:p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">서비스 제공 기간</h2>
                      <p className="text-white/80">결제일로부터 1년간 자유 수강</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8">
                  <ul className="space-y-4">
                    {[
                      '모든 교육 프로그램은 온라인 수강 방식으로 제공되며, 결제 완료 후 즉시 수강 가능합니다.',
                      <>각 교육 과정의 수강 가능 기간은 <strong className="text-secondary-600">결제일로부터 1년</strong>입니다.</>,
                      '수강 기간 동안에는 반복 수강 및 재열람이 자유롭게 가능합니다.',
                      '개인 사정으로 수강이 어려운 경우, 필요 시 고객센터를 통해 별도 상담 및 지원을 요청하실 수 있습니다.',
                      '시스템 점검·장애 등 불가피한 사유로 서비스 이용이 제한되는 경우, 공지사항 및 개별 안내를 통해 신속히 안내드립니다.',
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3 text-primary-600"
                      >
                        <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-secondary-600" />
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Refund Policy Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-primary-900/5 border border-primary-100 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-6 md:p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">환불 정책</h2>
                      <p className="text-white/80">공정하고 투명한 환불 기준 운영</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 space-y-6">
                  {/* 전액 환불 가능 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="relative bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200/50 overflow-hidden group hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-emerald-800">전액 환불 가능</h3>
                      </div>
                      <ul className="space-y-3 text-emerald-700">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>콘텐츠 열람 이후에는 단순 변심 환불 불가</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>KRPIC의 시스템 오류로 서비스 이용이 불가능한 경우, 원인 확인 후 전액 환불 처리됩니다.</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>

                  {/* 환불 불가 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="relative bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-6 border border-rose-200/50 overflow-hidden group hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                          <XCircle className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-rose-800">환불 불가</h3>
                      </div>
                      <ul className="space-y-3 text-rose-700">
                        <li className="flex items-start gap-2">
                          <span className="text-rose-400 mt-1">•</span>
                          <span>교육 과정 수료증이 이미 발급된 경우에는 환불이 불가합니다.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose-400 mt-1">•</span>
                          <span>타인의 계정 도용, 계정 공유 등 부정 이용이 확인된 경우, 서비스 이용이 제한되며 환불이 불가합니다.</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>

                  {/* 환불 신청 방법 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 overflow-hidden group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-blue-800">환불 신청 방법</h3>
                      </div>
                      <p className="text-blue-700 leading-relaxed">
                        고객센터 또는 카카오톡 채널을 통해 환불 신청 후, 담당자 확인을 거쳐
                        결제 수단에 따라 환불이 진행됩니다.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl p-6 md:p-8 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
                <div className="relative flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-accent-400" />
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    ※ 상기 내용은 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령을 준수하며,<br className="hidden md:block" />
                    세부 기준은 KRPIC 내부 운영 정책에 따라 조정될 수 있습니다.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
