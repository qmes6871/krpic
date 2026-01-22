'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Award, TrendingUp, ThumbsUp, Sparkles } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 2328,
    suffix: '+',
    label: '누적 수강생',
    description: '신뢰받는 교육 프로그램',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Award,
    value: 2282,
    suffix: '+',
    label: '수료증 발급',
    description: '공인 수료증 즉시 발급',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: TrendingUp,
    value: 109,
    suffix: '+',
    label: '일일 접속자',
    description: '활발한 학습 커뮤니티',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: ThumbsUp,
    value: 98,
    suffix: '%',
    label: '수료율',
    description: '높은 수료 성공률',
    color: 'from-orange-500 to-orange-600',
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      <span className="text-accent-400">{suffix}</span>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span>신뢰할 수 있는 교육 성과</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            숫자로 보는 <span className="text-accent-400">KRPIC</span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>

                {/* Number */}
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-white/60">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
