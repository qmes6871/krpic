'use client';

export default function KakaoFloatingBanner() {
  const handleClick = () => {
    // 카카오톡 채널 링크로 변경하세요
    window.open('http://pf.kakao.com/_stxkUn/chat', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        px-5 py-3
        bg-[#FEE500] hover:bg-[#F7DF00]
        text-[#3C1E1E] font-semibold
        rounded-full shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
      "
      aria-label="카카오톡 상담하기"
    >
      {/* 카카오톡 아이콘 */}
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
  );
}
