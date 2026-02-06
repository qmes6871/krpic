'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Bell, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NoticePopupProps {
  id: string;
  title: string;
  content: string;
}

const STORAGE_KEY = 'notice_popup_closed';

export default function NoticePopup({ id, title, content }: NoticePopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 오늘 닫기를 눌렀는지 확인
    const closedData = localStorage.getItem(STORAGE_KEY);
    if (closedData) {
      const { noticeId, expiry } = JSON.parse(closedData);
      if (noticeId === id && new Date().getTime() < expiry) {
        return; // 아직 유효하면 팝업 안 보여줌
      }
    }
    // 약간의 딜레이 후 팝업 표시
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, [id]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseToday = () => {
    // 24시간 후 만료
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ noticeId: id, expiry }));
    setIsOpen(false);
  };

  // 내용 미리보기 (처음 200자)
  const previewContent = content.length > 200 ? content.substring(0, 200) + '...' : content;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-900 to-primary-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/80 text-sm font-medium">공지사항</span>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary-900 mb-4 leading-tight">
                  {title}
                </h2>
                <div className="text-primary-600 text-sm leading-relaxed whitespace-pre-line mb-6">
                  {previewContent}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/notice/${id}`}
                    onClick={handleClose}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-900 hover:bg-primary-800 text-white font-medium rounded-xl transition-colors"
                  >
                    자세히 보기
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleCloseToday}
                    className="flex-1 px-4 py-3 border border-primary-200 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-colors"
                  >
                    오늘 하루 보지 않기
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
