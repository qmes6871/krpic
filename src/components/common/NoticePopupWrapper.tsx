'use client';

import { useState, useEffect } from 'react';
import NoticePopup from './NoticePopup';
import { getNotices } from '@/lib/notices/actions';

interface Notice {
  id: string;
  title: string;
  content: string;
  important: boolean;
}

export default function NoticePopupWrapper() {
  const [popupNotice, setPopupNotice] = useState<Notice | null>(null);

  useEffect(() => {
    async function fetchPopupNotice() {
      try {
        const notices = await getNotices();
        // showPopup이 true인 공지 가져오기
        const popupNotice = notices.find((n) => n.showPopup);
        if (popupNotice) {
          setPopupNotice(popupNotice);
        }
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      }
    }
    fetchPopupNotice();
  }, []);

  if (!popupNotice) return null;

  return (
    <NoticePopup
      id={popupNotice.id}
      title={popupNotice.title}
      content={popupNotice.content}
    />
  );
}
