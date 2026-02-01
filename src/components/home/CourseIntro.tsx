'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wine,
  ShieldAlert,
  Wallet,
  UserX,
  Dices,
  Pill,
  Monitor,
  Scale,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { categories } from '@/data/categories';
import { getCoursesByCategory } from '@/data/courses';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wine,
  ShieldAlert,
  Wallet,
  UserX,
  Dices,
  Pill,
  Monitor,
  Scale,
};

const colorGradientMap: Record<string, string> = {
  'bg-red-500': 'from-red-500 to-red-600',
  'bg-orange-500': 'from-orange-500 to-orange-600',
  'bg-yellow-500': 'from-yellow-500 to-amber-600',
  'bg-pink-500': 'from-pink-500 to-rose-600',
  'bg-purple-500': 'from-purple-500 to-purple-600',
  'bg-indigo-500': 'from-indigo-500 to-indigo-600',
  'bg-blue-500': 'from-blue-500 to-blue-600',
  'bg-green-500': 'from-green-500 to-emerald-600',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function CourseIntro() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-primary-50/50 to-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>8개 전문 교육과정 운영</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-900 mb-4">
            맞춤형 <span className="gradient-text">재범방지교육</span>
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            양형자료 및 감형자료가 필요하신 분을 위해 준비했습니다
          </p>
        </motion.div>

        {/* Equal Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.filter(c => !c.hidden).map((category) => {
            const Icon = iconMap[category.icon];
            const gradient = colorGradientMap[category.color] || 'from-primary-500 to-primary-600';
            const courses = getCoursesByCategory(category.id);

            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link
                  href={`/education/${category.slug}`}
                  className="group relative block h-full"
                >
                  <div className="relative h-full bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-primary-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    {/* Gradient Header */}
                    <div className={`relative bg-gradient-to-br ${gradient} p-5 md:p-6 overflow-hidden`}>
                      {/* Gradient Orb */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                      <div className="relative">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                          {Icon && <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6">
                      <h3 className="font-bold text-primary-900 text-lg md:text-xl mb-2 group-hover:text-secondary-600 transition-colors">
                        {category.name}
                      </h3>

                      <p className="text-primary-500 text-sm line-clamp-2 mb-4 min-h-[40px]">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-sm text-secondary-600 font-medium">
                          <BookOpen className="w-4 h-4" />
                          {courses.length}개 과정
                        </span>

                        <div className="w-8 h-8 md:w-9 md:h-9 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-900 transition-all duration-300">
                          <ArrowRight className="w-4 h-4 text-primary-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Gradient Line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-900 to-primary-800 text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-primary-900/20 hover:-translate-y-1 transition-all duration-300 group"
          >
            <span>통합센터 안내</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
