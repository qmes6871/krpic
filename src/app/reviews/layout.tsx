import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '수강생 후기 - KRPIC 재범방지교육통합센터',
  description: 'KRPIC 재범방지교육을 수강한 수강생들의 생생한 후기를 확인하세요. 실제 수강생들의 진솔한 이야기와 평가를 통해 교육의 효과를 확인해 보세요.',
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
