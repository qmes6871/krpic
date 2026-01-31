import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/data/categories';
import { getPublicCourse, getPublicCoursesByCategory } from '@/lib/courses/actions';
import CourseDetailContent from '@/components/education/CourseDetailContent';

interface Props {
  params: Promise<{ category: string; courseId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const course = await getPublicCourse(courseId);

  if (!course) {
    return {
      title: '과정을 찾을 수 없습니다 - KRPIC',
    };
  }

  return {
    title: `${course.title} - KRPIC 재범방지교육통합센터`,
    description: course.description,
  };
}

export const dynamic = 'force-dynamic'; // 항상 최신 데이터 가져오기

const gradientMap: Record<string, string> = {
  'bg-red-500': 'from-red-600 to-red-800',
  'bg-orange-500': 'from-orange-600 to-orange-800',
  'bg-yellow-500': 'from-yellow-600 to-yellow-800',
  'bg-pink-500': 'from-pink-600 to-pink-800',
  'bg-purple-500': 'from-purple-600 to-purple-800',
  'bg-indigo-500': 'from-indigo-600 to-indigo-800',
  'bg-blue-500': 'from-blue-600 to-blue-800',
  'bg-green-500': 'from-green-600 to-green-800',
};

export default async function CourseDetailPage({ params }: Props) {
  const { category: categorySlug, courseId } = await params;
  const category = getCategoryBySlug(categorySlug);

  // Supabase에서 코스 정보 가져오기
  const course = await getPublicCourse(courseId);

  if (!category || !course) {
    notFound();
  }

  // 같은 카테고리의 관련 코스 가져오기
  const allCategoryCoursese = await getPublicCoursesByCategory(categorySlug);
  const relatedCourses = allCategoryCoursese.filter((c) => c.id !== courseId);

  const gradient = gradientMap[category.color] || 'from-primary-800 to-primary-900';

  return (
    <CourseDetailContent
      category={category}
      course={course}
      relatedCourses={relatedCourses}
      categorySlug={categorySlug}
      gradient={gradient}
    />
  );
}
