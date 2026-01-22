'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { reviews } from '@/data/reviews';

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-primary-900 overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-secondary-400 font-medium mb-2 block">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              수강생 <span className="text-accent-400">후기</span>
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center group"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center group"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scrollable Cards */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-4 md:px-8 lg:px-16 pb-4 snap-x snap-mandatory"
      >
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex-shrink-0 w-[340px] md:w-[400px] snap-center"
          >
            <div className="h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 relative group hover:border-white/20 transition-colors">
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/10" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-accent-400 fill-accent-400'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/80 leading-relaxed mb-6 line-clamp-4">
                &ldquo;{review.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {review.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-white">{review.author}</div>
                  <div className="text-sm text-white/50">{review.courseTitle}</div>
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 via-secondary-500 to-accent-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="container-custom mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto text-center"
        >
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              4.9<span className="text-accent-400">/5</span>
            </div>
            <div className="text-white/50 text-sm">평균 평점</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              98<span className="text-accent-400">%</span>
            </div>
            <div className="text-white/50 text-sm">추천률</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              2,328<span className="text-accent-400">+</span>
            </div>
            <div className="text-white/50 text-sm">수강생</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
