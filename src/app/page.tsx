import HeroSection from '@/components/home/HeroSection';
import CourseIntro from '@/components/home/CourseIntro';
import StatsCounter from '@/components/home/StatsCounter';
import ExpertSection from '@/components/home/ExpertSection';
import Testimonials from '@/components/home/Testimonials';
import FAQAccordion from '@/components/home/FAQAccordion';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CourseIntro />
      <StatsCounter />
      <ExpertSection />
      <Testimonials />
      <FAQAccordion />
      <CTASection />
    </>
  );
}
