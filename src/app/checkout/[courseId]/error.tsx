'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Checkout Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-lg">
        <h2 className="text-xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800 font-mono whitespace-pre-wrap break-words">
            {error.message}
          </p>
          {error.stack && (
            <details className="mt-2">
              <summary className="text-xs text-red-600 cursor-pointer">상세 정보</summary>
              <pre className="text-xs text-red-700 mt-2 overflow-auto max-h-40">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
        <button
          onClick={() => reset()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
