'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Phone, X, MessageCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PHONE_NUMBER = '010-6283-7752';

export default function KakaoFloatingBanner() {
  const [isMobile, setIsMobile] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleKakaoClick = () => {
    window.open('http://pf.kakao.com/_stxkUn/chat', '_blank');
  };

  const handlePhoneClick = () => {
    if (isMobile) {
      window.location.href = `tel:${PHONE_NUMBER.replace(/-/g, '')}`;
    } else {
      setShowPhoneModal(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* 모바일 토글 버튼 */}
        {isMobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="
              flex items-center justify-center
              w-12 h-12
              bg-primary-600 hover:bg-primary-700
              text-white
              rounded-full shadow-lg
              transition-all duration-300
            "
            aria-label={isExpanded ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isExpanded ? (
              <ChevronDown className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </button>
        )}

        {/* 플로팅 버튼들 - PC에서는 항상 표시, 모바일에서는 토글 */}
        <AnimatePresence>
          {(!isMobile || isExpanded) && (
            <motion.div
              initial={isMobile ? { opacity: 0, y: 20, scale: 0.9 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
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

              {/* 24시 전화상담 버튼 */}
              <button
                onClick={handlePhoneClick}
                className="
                  flex items-center gap-2
                  px-5 py-3
                  bg-gradient-to-r from-green-500 to-green-600
                  hover:from-green-600 hover:to-green-700
                  text-white font-semibold
                  rounded-full shadow-lg hover:shadow-xl
                  transition-all duration-300 ease-in-out
                "
                aria-label="24시 전화상담"
              >
                <Phone className="w-6 h-6 flex-shrink-0" />
                <span>24시 전화상담</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PC용 전화번호 모달 */}
      {showPhoneModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
          onClick={() => setShowPhoneModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">24시 전화상담</h3>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-500 mb-2">상담 전화번호</p>
              <p className="text-2xl font-bold text-gray-900">{PHONE_NUMBER}</p>
              <p className="text-sm text-gray-500 mt-4">24시간 상담 가능합니다</p>
            </div>
            <button
              onClick={() => setShowPhoneModal(false)}
              className="w-full mt-4 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
