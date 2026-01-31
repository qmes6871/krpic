'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function KakaoFloatingBanner() {
  const handleKakaoClick = () => {
    window.open('http://pf.kakao.com/_stxkUn/chat', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* 내 강의 버튼 */}
      <Link
        href="/my-courses?tab=courses"
        className="
          flex items-center justify-center gap-2
          px-5 py-3
          bg-gradient-to-r from-accent-500 to-accent-600
          hover:from-accent-600 hover:to-accent-700
          text-white font-semibold
          rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
        "
        aria-label="내 강의"
      >
        <BookOpen className="w-6 h-6 flex-shrink-0" />
        <span>내 강의</span>
      </Link>

      {/* 카카오톡 상담 버튼 */}
      <button
        onClick={handleKakaoClick}
        className="
          flex items-center gap-2
          px-5 py-3
          bg-[#FEE500] hover:bg-[#F7DF00]
          text-[#3C1E1E] font-semibold
          rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
        "
        aria-label="카카오톡 상담하기"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="flex-shrink-0"
        >
          <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.17.6-.63 2.19-.72 2.53-.12.43.16.42.33.31.14-.09 2.19-1.49 3.08-2.09.52.08 1.06.12 1.6.12 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
        </svg>
        <span>카카오톡 상담</span>
      </button>
    </div>
  );
}
