'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 세션 ID 생성/조회
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// 사용자 ID 조회 (Supabase 세션에서)
function getUserId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const supabaseAuth = localStorage.getItem('sb-janbisapzgazpadjiniv-auth-token');
    if (supabaseAuth) {
      const parsed = JSON.parse(supabaseAuth);
      return parsed?.user?.id || null;
    }
  } catch {
    return null;
  }
  return null;
}

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 관리자 페이지는 트래킹 제외
    if (pathname.startsWith('/admin')) return;

    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || null,
            sessionId: getSessionId(),
            userId: getUserId(),
          }),
        });
      } catch (error) {
        // 트래킹 실패해도 사용자 경험에 영향 없음
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [pathname]);

  return null;
}
