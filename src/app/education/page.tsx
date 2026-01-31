import { Metadata } from 'next';
import { categories } from '@/data/categories';
import { getPublicCourses, PublicCourse } from '@/lib/courses/actions';
import EducationPageContent from '@/components/education/EducationPageContent';

export const metadata: Metadata = {
  title: '재범방지교육 - KRPIC 재범방지교육통합센터',
  description: '음주운전, 폭력범죄, 성범죄 등 다양한 재범방지교육 과정을 제공합니다.',
};

export const revalidate = 60; // 60초마다 재검증

export default async function EducationPage() {
  // Supabase에서 모든 활성화된 코스 가져오기
  const allCourses = await getPublicCourses();

  // 카테고리별로 그룹화
  const coursesByCategory: Record<string, PublicCourse[]> = {};
  categories.forEach((category) => {
    coursesByCategory[category.id] = allCourses.filter(
      (course) => course.categoryId === category.slug
    );
  });

  return (
    <EducationPageContent
      categories={categories}
      coursesByCategory={coursesByCategory}
    />
  );
}
