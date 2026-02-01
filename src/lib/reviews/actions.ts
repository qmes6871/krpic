'use server';

import { createClient } from '@/lib/supabase/server';
import { Review } from '@/types';

export interface ReviewInput {
  author: string;
  courseTitle: string;
  category: string;
  content: string;
  rating: number;
  verified: boolean;
  helpful?: number;
}

// 후기 목록 조회
export async function getReviews(): Promise<Review[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch reviews:', error);
    return [];
  }

  return data.map((review: any) => ({
    id: review.id,
    author: review.author,
    courseTitle: review.course_title,
    category: review.category,
    content: review.content,
    rating: review.rating,
    date: review.created_at.split('T')[0],
    helpful: review.helpful || 0,
    verified: review.verified,
  }));
}

// 후기 상세 조회
export async function getReviewById(id: string): Promise<Review | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Failed to fetch review:', error);
    return null;
  }

  return {
    id: data.id,
    author: data.author,
    courseTitle: data.course_title,
    category: data.category,
    content: data.content,
    rating: data.rating,
    date: data.created_at.split('T')[0],
    helpful: data.helpful || 0,
    verified: data.verified,
  };
}

// 도움됨 증가
export async function incrementReviewHelpful(id: string): Promise<void> {
  const supabase = await createClient();

  await supabase.rpc('increment_review_helpful', { review_id: id });
}

// 후기 생성 (관리자용)
export async function createReview(input: ReviewInput): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      author: input.author,
      course_title: input.courseTitle,
      category: input.category,
      content: input.content,
      rating: input.rating,
      verified: input.verified,
      helpful: input.helpful || 0,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Failed to create review:', error);
    return { success: false, error: '후기 등록에 실패했습니다.' };
  }

  return { success: true, id: data.id };
}

// 후기 수정 (관리자용)
export async function updateReview(
  id: string,
  input: ReviewInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('reviews')
    .update({
      author: input.author,
      course_title: input.courseTitle,
      category: input.category,
      content: input.content,
      rating: input.rating,
      verified: input.verified,
      helpful: input.helpful ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to update review:', error);
    return { success: false, error: '후기 수정에 실패했습니다.' };
  }

  return { success: true };
}

// 후기 삭제 (관리자용)
export async function deleteReview(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete review:', error);
    return { success: false, error: '후기 삭제에 실패했습니다.' };
  }

  return { success: true };
}

// 후기 통계
export async function getReviewStats(): Promise<{
  total: number;
  averageRating: string;
  recommendRate: number;
  ratingDistribution: { rating: number; count: number; percentage: number }[];
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('rating');

  if (error || !data || data.length === 0) {
    return {
      total: 0,
      averageRating: '0',
      recommendRate: 0,
      ratingDistribution: [5, 4, 3, 2, 1].map(r => ({ rating: r, count: 0, percentage: 0 })),
    };
  }

  const total = data.length;
  const averageRating = (data.reduce((sum: number, r: any) => sum + r.rating, 0) / total).toFixed(1);
  const recommendRate = Math.round((data.filter((r: any) => r.rating >= 4).length / total) * 100);

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: data.filter((r: any) => r.rating === rating).length,
    percentage: Math.round((data.filter((r: any) => r.rating === rating).length / total) * 100),
  }));

  return {
    total,
    averageRating,
    recommendRate,
    ratingDistribution,
  };
}
