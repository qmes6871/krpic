'use server';

import { createClient } from '@/lib/supabase/server';
import { Course as AdminCourse } from '@/types/admin';

export interface PublicCourse {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  duration: string;
  instructor: string;
  features: string[];
  detailImages: string[];
  videoUrl: string | null;
}

// Supabase Course를 프론트엔드 Course 형식으로 변환
function transformCourse(course: Partial<AdminCourse> & { id: string; title: string; category: string; price: number }): PublicCourse {
  return {
    id: course.id,
    categoryId: course.category, // DB의 category는 slug로 저장됨
    title: course.title,
    description: course.description || '',
    thumbnail: course.thumbnail || '',
    price: course.price || 0,
    duration: course.duration || '1시간',
    instructor: course.instructor || '전문 상담사',
    features: Array.isArray(course.features) ? course.features : [],
    detailImages: Array.isArray(course.detail_images) ? course.detail_images : [],
    videoUrl: course.video_url || null,
  };
}

// 모든 활성화된 코스 가져오기
export async function getPublicCourses(): Promise<PublicCourse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }

  return (data as AdminCourse[]).map(transformCourse);
}

// 카테고리별 활성화된 코스 가져오기
export async function getPublicCoursesByCategory(categorySlug: string): Promise<PublicCourse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('category', categorySlug)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch courses by category:', error);
    return [];
  }

  return (data as AdminCourse[]).map(transformCourse);
}

// 단일 코스 가져오기
export async function getPublicCourse(courseId: string): Promise<PublicCourse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Failed to fetch course:', error);
    return null;
  }

  return transformCourse(data as AdminCourse);
}
