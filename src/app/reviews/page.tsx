'use client';

import { useState, useEffect } from 'react';
import {
  Quote,
  ThumbsUp,
  BadgeCheck,
  MessageSquare,
  Sparkles,
  Star
} from 'lucide-react';
import { getReviews, getReviewStats, incrementReviewHelpful } from '@/lib/reviews/actions';
import { Review } from '@/types';
import { categories } from '@/data/categories';
import FadeIn from '@/components/common/FadeIn';

function getCategoryName(categorySlug: string): string {
  return categories.find((c) => c.slug === categorySlug)?.name || categorySlug;
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays <= 7) return `${diffDays}일 전`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)}주 전`;
  return `${Math.floor(diffDays / 30)}개월 전`;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: '0',
    recommendRate: 0,
    ratingDistribution: [] as { rating: number; count: number; percentage: number }[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reviewsData, statsData] = await Promise.all([
        getReviews(),
        getReviewStats(),
      ]);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    await incrementReviewHelpful(reviewId);
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
    );
  };

  // 최신순으로 정렬
  const sortedReviews = [...reviews].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const bestReviews = [...reviews].sort((a, b) => b.helpful - a.helpful).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          </div>
          <div className="relative h-full flex items-center">
            <div className="container-custom">
              <div className="max-w-3xl md:max-w-none md:text-center md:mx-auto">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
                  <MessageSquare className="w-4 h-4" />
                  실제 수강생들의 생생한 후기
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  수강생 <span className="text-accent-400">후기</span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 md:max-w-2xl md:mx-auto">
                  KRPIC 재범방지교육을 수강한 분들의 진솔한 이야기를 확인해 보세요
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="animate-pulse grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-white rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="container-custom">
            <div className="max-w-3xl md:max-w-none md:text-center md:mx-auto">
              <FadeIn delay={0}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
                  <MessageSquare className="w-4 h-4" />
                  실제 수강생들의 생생한 후기
                </span>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  수강생 <span className="text-accent-400">후기</span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="text-lg md:text-xl text-white/80 md:max-w-2xl md:mx-auto">
                  KRPIC 재범방지교육을 수강한 분들의 진솔한 이야기를 확인해 보세요
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Floating Cards */}
      <section className="relative -mt-20 z-10 px-4">
        <div className="container-custom">
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* Total Reviews */}
            <FadeIn delay={0}>
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-primary-900/5 border border-primary-100">
                <div className="flex items-center gap-2 text-secondary-500 mb-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">전체 후기</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary-900">
                  {stats.total}
                  <span className="text-lg text-primary-400">개</span>
                </div>
              </div>
            </FadeIn>

            {/* Recommend Rate */}
            <FadeIn delay={100}>
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-primary-900/5 border border-primary-100">
                <div className="flex items-center gap-2 text-green-500 mb-2">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">추천률</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary-900">
                  {stats.recommendRate}
                  <span className="text-lg text-primary-400">%</span>
                </div>
              </div>
            </FadeIn>

            {/* Verified Reviews */}
            <FadeIn delay={200}>
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-primary-900/5 border border-primary-100">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <BadgeCheck className="w-5 h-5" />
                  <span className="text-sm font-medium">인증 후기</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary-900">
                  100
                  <span className="text-lg text-primary-400">%</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Best Reviews */}
      {bestReviews.length > 0 && (
        <section className="py-12 px-4 bg-gradient-to-b from-white to-primary-50">
          <div className="container-custom">
            <FadeIn>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-primary-900 flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-accent-500" />
                  베스트 후기
                </h2>
                <p className="text-primary-600 mt-2">가장 도움이 된 후기들을 확인해보세요</p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
              {bestReviews.map((review, index) => (
                <FadeIn key={review.id} delay={index * 150}>
                  <div className="group relative h-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-400 via-secondary-400 to-accent-400 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                    <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-primary-100 h-full">
                      {/* Best Badge */}
                      <div className="absolute -top-3 -right-3">
                        <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          #{index + 1} BEST
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {review.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-primary-900 flex items-center gap-2">
                            {review.author}
                            {review.verified && (
                              <BadgeCheck className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div className="text-sm text-primary-500">{getCategoryName(review.category)}</div>
                        </div>
                      </div>

                      <p className="text-primary-700 leading-relaxed mb-4 line-clamp-4">
                        &ldquo;{review.content}&rdquo;
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                        <span className="text-sm text-primary-400">
                          {formatRelativeDate(review.date)}
                        </span>
                        <div className="flex items-center gap-1 text-secondary-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm font-medium">{review.helpful}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-12 px-4">
        <div className="container-custom">
          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedReviews.map((review) => (
              <div key={review.id} className="group h-full">
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-primary-100 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {review.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-primary-900 flex items-center gap-1.5">
                          {review.author}
                          {review.verified && (
                            <BadgeCheck className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="text-xs text-primary-400">
                          {formatRelativeDate(review.date)}
                        </div>
                      </div>
                    </div>
                    <Quote className="w-6 h-6 text-primary-200 group-hover:text-accent-300 transition-colors" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-primary-700 leading-relaxed flex-1 mb-4">
                    {review.content}
                  </p>

                  {/* Footer */}
                  <div className="pt-4 border-t border-primary-100 flex items-center justify-between">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary-100 text-primary-600">
                      {getCategoryName(review.category)}
                    </span>
                    <button
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center gap-1.5 text-primary-400 hover:text-secondary-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{review.helpful}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedReviews.length === 0 && (
            <FadeIn>
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 text-primary-200 mx-auto mb-4" />
                <p className="text-primary-500">등록된 후기가 없습니다.</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container-custom">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-8 md:p-12">
              {/* Background Decoration */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
              </div>

              <div className="relative text-center max-w-2xl mx-auto">
                <FadeIn delay={100}>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    여러분의 이야기를 들려주세요
                  </h2>
                </FadeIn>
                <FadeIn delay={200}>
                  <p className="text-white/70 mb-8">
                    교육을 수료하신 후 솔직한 후기를 남겨주시면<br className="hidden md:block" />
                    다른 수강생들에게 큰 도움이 됩니다.
                  </p>
                </FadeIn>
                <FadeIn delay={300}>
                  <button className="inline-flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-300">
                    <MessageSquare className="w-5 h-5" />
                    후기 작성하기
                  </button>
                </FadeIn>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
