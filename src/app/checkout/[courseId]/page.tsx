import { notFound } from 'next/navigation';
import { getPublicCourse } from '@/lib/courses/actions';
import { getCategoryBySlug } from '@/data/categories';
import CheckoutContent from '@/components/checkout/CheckoutContent';

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CheckoutPage({ params }: Props) {
  const { courseId } = await params;
  const course = await getPublicCourse(courseId);

  if (!course) {
    notFound();
  }

  const category = getCategoryBySlug(course.categoryId);

  return <CheckoutContent course={course} category={category} />;
}
