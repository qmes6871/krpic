'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  CreditCard,
  CheckCircle,
  User,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  X,
  Loader2,
  Building2,
  Hash,
} from 'lucide-react';
import { PublicCourse } from '@/lib/courses/actions';
import { Category } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { loadTossPayments, TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';

interface Props {
  course: PublicCourse;
  category?: Category;
}

type ModalType = 'terms' | 'privacy' | null;

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export default function CheckoutContent({ course, category }: Props) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    agreement: true,
    inmateInstitution: '',
    inmateName: '',
    inmateNumber: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [error, setError] = useState('');
  const [widgetsReady, setWidgetsReady] = useState(false);
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=/checkout/${course.id}`);
        return;
      }

      setIsAuthenticated(true);
      setUserId(user.id);
      setFormData({
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone || '',
        email: user.email || '',
        agreement: true,
        inmateInstitution: '',
        inmateName: '',
        inmateNumber: '',
      });
    };

    checkAuth();
  }, [course.id, router]);

  // 토스페이먼츠 위젯 초기화
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const initTossPayments = async () => {
      try {
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        const widgets = tossPayments.widgets({
          customerKey: userId,
        });

        await widgets.setAmount({
          currency: 'KRW',
          value: course.price,
        });

        await Promise.all([
          widgets.renderPaymentMethods({
            selector: '#payment-method',
            variantKey: 'DEFAULT',
          }),
          widgets.renderAgreement({
            selector: '#agreement',
            variantKey: 'AGREEMENT',
          }),
        ]);

        widgetsRef.current = widgets;
        setWidgetsReady(true);
      } catch (error) {
        console.error('토스페이먼츠 초기화 실패:', error);
        setError('결제 모듈 로딩에 실패했습니다. 페이지를 새로고침 해주세요.');
      }
    };

    initTossPayments();
  }, [isAuthenticated, userId, course.price]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.email) {
      setError('주문자 정보를 모두 입력해주세요.');
      return;
    }

    if (course.categoryId === 'detention') {
      if (!formData.inmateInstitution || !formData.inmateName || !formData.inmateNumber) {
        setError('수감자 정보를 모두 입력해주세요.');
        return;
      }
    }

    if (!widgetsRef.current) {
      setError('결제 모듈이 로딩되지 않았습니다. 페이지를 새로고침 해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      // orderId: 영문, 숫자, -, _ 만 허용, 6~64자
      const orderId = `KRPIC-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://krpic.co.kr';

      // 성공 URL에 courseId와 userId 포함
      const baseParams = new URLSearchParams({
        courseId: course.id,
        userId: userId,
      });

      // 수감자 교육인 경우 추가 정보 포함
      if (course.categoryId === 'detention') {
        baseParams.set('detention', 'true');
        baseParams.set('institution', formData.inmateInstitution);
        baseParams.set('inmateName', formData.inmateName);
        baseParams.set('inmateNumber', formData.inmateNumber);
        baseParams.set('courseTitle', course.title);
      }

      const successUrl = `${siteUrl}/payment/success?${baseParams.toString()}`;

      await widgetsRef.current.requestPayment({
        orderId,
        orderName: course.title,
        customerName: formData.name,
        customerEmail: formData.email,
        customerMobilePhone: formData.phone.replace(/-/g, ''),
        successUrl,
        failUrl: `${siteUrl}/payment/fail`,
      });
    } catch (error: any) {
      console.error('결제 요청 실패:', error);
      if (error.code === 'USER_CANCEL') {
        setError('결제가 취소되었습니다.');
      } else {
        setError(error.message || '결제 요청 중 오류가 발생했습니다.');
      }
      setIsProcessing(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">로그인 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

        <div className="container-custom relative">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  홈
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li>
                <Link href="/education" className="hover:text-white transition-colors">
                  재범방지교육
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li>
                <Link
                  href={`/education/${course.categoryId}/${course.id}`}
                  className="hover:text-white transition-colors"
                >
                  {course.title}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li className="text-white font-medium">결제하기</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">결제하기</h1>
          <p className="text-white/70">안전하고 빠른 결제를 진행해 주세요.</p>
        </div>
      </section>

      <div className="container-custom py-8 -mt-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                주문 정보
              </h2>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  {category && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded mb-1 inline-block">
                      {category.name}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                주문자 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="이름을 입력하세요"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="010-0000-0000"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inmate Info - Only for detention courses */}
            {course.categoryId === 'detention' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  수감자 정보
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  수감자 교육 진행을 위해 아래 정보를 정확히 입력해주세요.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      수감중인 교정기관 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="inmateInstitution"
                        value={formData.inmateInstitution}
                        onChange={handleInputChange}
                        placeholder="예: 서울구치소, 수원구치소"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      수감자 성함 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="inmateName"
                        value={formData.inmateName}
                        onChange={handleInputChange}
                        placeholder="수감자의 실명을 입력하세요"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      수감번호 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="inmateNumber"
                        value={formData.inmateNumber}
                        onChange={handleInputChange}
                        placeholder="수감번호를 입력하세요"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method - Toss Payments Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                결제 수단
              </h2>
              <div id="payment-method" className="min-h-[200px]">
                {!widgetsReady && (
                  <div className="flex items-center justify-center h-[200px]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Agreement - Toss Payments Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div id="agreement">
                {!widgetsReady && (
                  <div className="flex items-center justify-center h-[100px]">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Additional Terms */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-sm text-gray-600">
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
                  >
                    이용약관
                  </button>
                  {' '}및{' '}
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
                  >
                    개인정보 처리방침
                  </button>
                  을 확인해 주세요.
                </span>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">결제 금액</h2>

              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>상품 금액</span>
                  <span>{course.price.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>할인 금액</span>
                  <span className="text-red-500">0원</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="font-bold text-gray-900">총 결제 금액</span>
                <span className="text-2xl font-bold text-blue-600">
                  {course.price.toLocaleString()}원
                </span>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isProcessing || !widgetsReady}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  `${course.price.toLocaleString()}원 결제하기`
                )}
              </button>

              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    결제 완료 후 즉시 학습을 시작할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>토스페이먼츠 안전결제</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                {activeModal === 'terms' ? '이용약관' : '개인정보 처리방침'}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              {activeModal === 'terms' ? (
                <div className="prose prose-sm max-w-none text-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">제1조 (목적)</h3>
                  <p className="mb-4">
                    본 약관은 KRPIC 재범방지교육통합센터(이하 &quot;회사&quot;)가 제공하는 온라인 교육 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">제2조 (정의)</h3>
                  <p className="mb-2">본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>&quot;서비스&quot;란 회사가 제공하는 온라인 재범방지교육 프로그램을 의미합니다.</li>
                    <li>&quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 의미합니다.</li>
                    <li>&quot;콘텐츠&quot;란 서비스 내에서 제공되는 교육 영상, 자료, 텍스트 등 모든 정보를 의미합니다.</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">제3조 (서비스 이용)</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>서비스는 결제 완료 후 즉시 이용 가능합니다.</li>
                    <li>서비스 이용 기간은 결제일로부터 1년입니다.</li>
                    <li>이용자는 서비스를 타인에게 양도하거나 공유할 수 없습니다.</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">제4조 (환불 정책)</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>콘텐츠 열람 전: 전액 환불 가능</li>
                    <li>콘텐츠 열람 후: 단순 변심에 의한 환불 불가</li>
                    <li>수료증 발급 후: 환불 불가</li>
                    <li>회사 귀책 사유로 서비스 이용이 불가능한 경우: 전액 환불</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">제5조 (저작권)</h3>
                  <p className="mb-4">
                    서비스 내 모든 콘텐츠의 저작권은 회사에 있으며, 이용자는 회사의 사전 동의 없이 콘텐츠를 복제, 배포, 전송할 수 없습니다.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">제6조 (면책조항)</h3>
                  <p className="mb-4">
                    회사는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다. 단, 회사는 서비스 정상화를 위해 최선을 다하며, 장기간 중단 시 이용자에게 보상 방안을 제공합니다.
                  </p>

                  <p className="text-sm text-gray-500 mt-6">
                    본 약관은 2025년 1월 1일부터 시행됩니다.
                  </p>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">1. 개인정보 수집 항목</h3>
                  <p className="mb-2">회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다.</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>필수 항목: 이름, 연락처, 이메일 주소</li>
                    <li>결제 시: 결제 정보(카드번호, 계좌번호 등은 결제 대행사에서 처리)</li>
                    <li>자동 수집: 접속 IP, 쿠키, 서비스 이용 기록</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">2. 개인정보 수집 및 이용 목적</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>서비스 제공 및 계약 이행</li>
                    <li>본인 확인 및 부정 이용 방지</li>
                    <li>수료증 발급 및 교육 이력 관리</li>
                    <li>고객 상담 및 민원 처리</li>
                    <li>서비스 개선 및 통계 분석</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">3. 개인정보 보유 및 이용 기간</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>회원 탈퇴 시까지 (단, 관련 법령에 따라 일정 기간 보관)</li>
                    <li>전자상거래법에 따른 계약/결제 기록: 5년</li>
                    <li>소비자 불만/분쟁 처리 기록: 3년</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">4. 개인정보의 제3자 제공</h3>
                  <p className="mb-4">
                    회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의한 요청이 있는 경우는 예외로 합니다.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">5. 개인정보 처리 위탁</h3>
                  <p className="mb-4">
                    회사는 원활한 서비스 제공을 위해 결제 대행, 문자 발송 등의 업무를 외부 업체에 위탁할 수 있으며, 위탁 시 관련 법령에 따라 안전하게 관리합니다.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">6. 이용자의 권리</h3>
                  <p className="mb-2">이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>개인정보 열람, 정정, 삭제 요청</li>
                    <li>개인정보 처리 정지 요청</li>
                    <li>동의 철회</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">7. 개인정보 보호책임자</h3>
                  <ul className="list-none mb-4 space-y-1">
                    <li>담당부서: 고객지원팀</li>
                    <li>연락처: 카카오톡 채널 또는 고객센터</li>
                  </ul>

                  <p className="text-sm text-gray-500 mt-6">
                    본 개인정보 처리방침은 2025년 1월 1일부터 시행됩니다.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
