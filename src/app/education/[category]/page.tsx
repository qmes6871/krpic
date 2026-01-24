import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug } from '@/data/categories';
import { getCoursesByCategory } from '@/data/courses';
import CategoryPageContent from '@/components/education/CategoryPageContent';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: '카테고리를 찾을 수 없습니다 - KRPIC',
    };
  }

  return {
    title: `${category.name} 교육 - KRPIC 재범방지교육통합센터`,
    description: category.description,
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

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const courses = getCoursesByCategory(category.id);
  const gradient = gradientMap[category.color] || 'from-primary-800 to-primary-900';

  return (
    <CategoryPageContent
      category={category}
      courses={courses}
      categorySlug={categorySlug}
      gradient={gradient}
    />
  );
}
