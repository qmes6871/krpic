import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { detentionCourses, getDetentionCourseById } from '@/data/detention-courses';
import { siteConfig } from '@/lib/seo/config';
import DetentionCourseDetailContent from './DetentionCourseDetailContent';

interface Props {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const course = getDetentionCourseById(courseId);

  if (!course) {
    return {
      title: '과정을 찾을 수 없습니다 - KRPIC',
    };
  }

  return {
    title: `${course.title} | 구속수감자 교육 - KRPIC 재범방지교육통합센터`,
    description: course.description,
    keywords: ['구속수감자 교육', course.title, '수감자 재범방지교육', '양형자료'],
    openGraph: {
      title: `${course.title} | KRPIC 재범방지교육통합센터`,
      description: course.description,
      url: `${siteConfig.url}/detention-education/${courseId}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/detention-education/${courseId}`,
    },
  };
}

export function generateStaticParams() {
  return detentionCourses.map((course) => ({
    courseId: course.id,
  }));
}

export default async function DetentionCourseDetailPage({ params }: Props) {
  const { courseId } = await params;
  const course = getDetentionCourseById(courseId);

  if (!course) {
    notFound();
  }

  const otherCourses = detentionCourses.filter((c) => c.id !== courseId);

  return (
    <DetentionCourseDetailContent course={course} otherCourses={otherCourses} />
  );
}
