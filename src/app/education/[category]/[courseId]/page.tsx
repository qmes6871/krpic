import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug } from '@/data/categories';
import { courses, getCourseById, getCoursesByCategory } from '@/data/courses';
import CourseDetailContent from '@/components/education/CourseDetailContent';

interface Props {
  params: Promise<{ category: string; courseId: string }>;
}

export async function generateStaticParams() {
  return courses.map((course) => {
    const category = categories.find((c) => c.id === course.categoryId);
    return {
      category: category?.slug || '',
      courseId: course.id,
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const course = getCourseById(courseId);

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
  const course = getCourseById(courseId);

  if (!category || !course) {
    notFound();
  }

  const relatedCourses = getCoursesByCategory(category.id).filter(
    (c) => c.id !== courseId
  );

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
