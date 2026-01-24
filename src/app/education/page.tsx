import { Metadata } from 'next';
import { categories } from '@/data/categories';
import { getCoursesByCategory } from '@/data/courses';
import EducationPageContent from '@/components/education/EducationPageContent';

export const metadata: Metadata = {
  title: '재범방지교육 - KRPIC 재범방지교육통합센터',
  description: '음주운전, 폭력범죄, 성범죄 등 다양한 재범방지교육 과정을 제공합니다.',
};

export default function EducationPage() {
  // 각 카테고리별 강의 데이터 준비
  const coursesByCategory: Record<string, ReturnType<typeof getCoursesByCategory>> = {};
  categories.forEach((category) => {
    coursesByCategory[category.id] = getCoursesByCategory(category.id);
  });

  return (
    <EducationPageContent
      categories={categories}
      coursesByCategory={coursesByCategory}
    />
  );
}
