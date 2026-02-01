import { notFound, redirect } from 'next/navigation';
import { getPublicCourse } from '@/lib/courses/actions';
import { getCategoryBySlug } from '@/data/categories';
import CheckoutContent from '@/components/checkout/CheckoutContent';
import { getUser } from '@/lib/auth/actions';

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CheckoutPage({ params }: Props) {
  const { courseId } = await params;

  // 로그인 체크
  const user = await getUser();
  if (!user) {
    redirect(`/login?redirect=/checkout/${courseId}&message=login_required`);
  }

  const course = await getPublicCourse(courseId);

  if (!course) {
    notFound();
  }

  const category = getCategoryBySlug(course.categoryId);

  return <CheckoutContent course={course} category={category} />;
}
