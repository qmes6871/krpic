import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserEnrollment, getCommonVideoUrls } from '@/lib/enrollments/actions';
import { getPublicCourse } from '@/lib/courses/actions';
import { getCategoryBySlug } from '@/data/categories';
import LearnPageContent from '@/components/learn/LearnPageContent';

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function LearnPage({ params }: Props) {
  const { courseId } = await params;

  // 인증 확인
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/learn/${courseId}`);
  }

  // 코스 정보 조회
  const course = await getPublicCourse(courseId);
  if (!course) {
    notFound();
  }

  // 수강 등록 확인
  const enrollment = await getUserEnrollment(courseId);
  if (!enrollment) {
    // 수강 등록이 없으면 결제 페이지로 이동
    redirect(`/checkout/${courseId}`);
  }

  // 승인되지 않은 수강
  if (enrollment.status === 'pending') {
    redirect(`/my-courses?message=pending`);
  }

  if (enrollment.status === 'rejected') {
    redirect(`/my-courses?message=rejected`);
  }

  const category = getCategoryBySlug(course.categoryId);

  // 공통 영상 URL 가져오기
  const commonVideoUrls = await getCommonVideoUrls();

  return (
    <LearnPageContent
      course={course}
      category={category}
      enrollment={enrollment}
      commonVideoUrls={commonVideoUrls}
    />
  );
}
