'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, AlertCircle, BookOpen, ArrowRight, FileText, Clock, Building2, Copy } from 'lucide-react';

interface VirtualAccountInfo {
  bankName: string;
  accountNumber: string;
  customerName: string;
  dueDate: string;
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [courseId, setCourseId] = useState('');
  const [isDetention, setIsDetention] = useState(false);
  const [isVirtualAccount, setIsVirtualAccount] = useState(false);
  const [virtualAccountInfo, setVirtualAccountInfo] = useState<VirtualAccountInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [detentionInfo, setDetentionInfo] = useState({
    institution: '',
    inmateName: '',
    inmateNumber: '',
    courseTitle: '',
  });

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');
      const courseIdParam = searchParams.get('courseId');
      const userIdParam = searchParams.get('userId');

      // 수감자 교육 정보 확인
      const detention = searchParams.get('detention');
      if (detention === 'true') {
        setIsDetention(true);
        setDetentionInfo({
          institution: searchParams.get('institution') || '',
          inmateName: searchParams.get('inmateName') || '',
          inmateNumber: searchParams.get('inmateNumber') || '',
          courseTitle: searchParams.get('courseTitle') || '',
        });
      }

      if (!paymentKey || !orderId || !amount || !courseIdParam || !userIdParam) {
        setStatus('error');
        setErrorMessage('결제 정보가 올바르지 않습니다.');
        return;
      }

      setCourseId(courseIdParam);

      try {
        const response = await fetch('/api/payments/toss/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            courseId: courseIdParam,
            userId: userIdParam,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');

          // 가상계좌인 경우
          if (data.isVirtualAccount && data.virtualAccount) {
            setIsVirtualAccount(true);
            setVirtualAccountInfo(data.virtualAccount);
          }
        } else {
          setStatus('error');
          setErrorMessage(data.error || '결제 승인에 실패했습니다.');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('결제 처리 중 오류가 발생했습니다.');
      }
    };

    confirmPayment();
  }, [searchParams]);

  const copyAccountNumber = () => {
    if (virtualAccountInfo?.accountNumber) {
      navigator.clipboard.writeText(virtualAccountInfo.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-4 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">결제 확인 중...</h1>
          <p className="text-gray-600">잠시만 기다려 주세요.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">결제 실패</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 가상계좌 입금 대기 화면
  if (isVirtualAccount && virtualAccountInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-lg w-full mx-4 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">입금 대기 중</h1>
          <p className="text-gray-600 mb-6">
            아래 계좌로 입금해 주시면 자동으로 수강 등록이 완료됩니다.
          </p>

          {/* 가상계좌 정보 */}
          <div className="bg-blue-50 rounded-xl p-5 mb-6 text-left">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              입금 계좌 정보
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">은행</span>
                <span className="font-bold text-gray-900">{virtualAccountInfo.bankName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">계좌번호</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 font-mono">{virtualAccountInfo.accountNumber}</span>
                  <button
                    onClick={copyAccountNumber}
                    className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                    title="계좌번호 복사"
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">예금주</span>
                <span className="font-bold text-gray-900">{virtualAccountInfo.customerName}</span>
              </div>
            </div>
            {copied && (
              <p className="text-sm text-blue-600 mt-2 text-center">계좌번호가 복사되었습니다!</p>
            )}
          </div>

          {/* 입금 기한 */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-red-700">
              <Clock className="w-5 h-5" />
              <span className="font-medium">입금 기한: {formatDueDate(virtualAccountInfo.dueDate)}</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              기한 내 입금하지 않으면 주문이 자동 취소됩니다.
            </p>
          </div>

          {/* 안내사항 */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-bold text-gray-800 mb-2">안내사항</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 입금 확인 후 자동으로 수강 등록이 완료됩니다.</li>
              <li>• 입금 확인까지 최대 10분 정도 소요될 수 있습니다.</li>
              <li>• 입금자명이 다를 경우 고객센터로 문의해 주세요.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/my-courses"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              내 학습 목록 보기
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-xl transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 수감자 교육 완료 화면
  if (isDetention) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-lg w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
          <p className="text-gray-600 mb-6">
            수감자 교육 신청이 정상적으로 접수되었습니다.
          </p>

          {/* 수감자 정보 */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              신청 정보
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">교육과정:</span>
                <span className="font-medium text-gray-900">{detentionInfo.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">교정기관:</span>
                <span className="font-medium text-gray-900">{detentionInfo.institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">수감자 성함:</span>
                <span className="font-medium text-gray-900">{detentionInfo.inmateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">수감번호:</span>
                <span className="font-medium text-gray-900">{detentionInfo.inmateNumber}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-bold text-yellow-800 mb-2">안내사항</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 교육 자료는 해당 교정기관으로 발송됩니다.</li>
              <li>• 발송까지 영업일 기준 1~3일이 소요됩니다.</li>
              <li>• 교육 진행 관련 문의는 고객센터로 연락해 주세요.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/my-courses"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              내 신청 내역 보기
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-xl transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
        <p className="text-gray-600 mb-8">
          교육 수강이 정상적으로 등록되었습니다.<br />
          지금 바로 학습을 시작할 수 있습니다.
        </p>

        <div className="space-y-3">
          {courseId && (
            <Link
              href={`/learn/${courseId}`}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              <BookOpen className="w-5 h-5" />
              학습 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
          <Link
            href="/my-courses"
            className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-xl transition-colors"
          >
            내 학습 목록 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
