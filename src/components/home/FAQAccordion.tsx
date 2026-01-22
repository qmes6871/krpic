'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';
import { faqs } from '@/data/faq';

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>('1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-primary-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23102a43' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              <span>자주 묻는 질문</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              궁금한 점이
              <br />
              있으신가요?
            </h2>
            <p className="text-lg text-primary-600 mb-8">
              교육 수강에 관해 자주 묻는 질문들을 모았습니다.
              더 궁금한 점이 있으시면 언제든 문의해 주세요.
            </p>

            {/* Contact Card */}
            <div className="bg-white border border-primary-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-1">
                    추가 문의가 필요하신가요?
                  </h3>
                  <p className="text-sm text-primary-500 mb-3">
                    전문 상담사가 친절히 안내해 드립니다.
                  </p>
                  <a
                    href="tel:1544-0000"
                    className="inline-flex items-center gap-2 text-secondary-600 font-medium hover:text-secondary-700"
                  >
                    1544-0000
                    <span className="text-xs text-primary-400">(평일 09:00~18:00)</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - FAQ List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl border transition-all duration-300 ${
                  openId === faq.id
                    ? 'border-primary-200 shadow-lg'
                    : 'border-primary-100 hover:border-primary-200'
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span
                    className={`font-medium pr-4 transition-colors ${
                      openId === faq.id ? 'text-primary-900' : 'text-primary-700'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      openId === faq.id
                        ? 'bg-primary-900 text-white'
                        : 'bg-primary-100 text-primary-600'
                    }`}
                  >
                    {openId === faq.id ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-primary-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
