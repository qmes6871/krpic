'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone, X, CheckCircle2, XCircle } from 'lucide-react';
import { signUp } from '@/lib/auth/actions';
import { translateAuthError } from '@/lib/auth/errors';

// 약관 내용
const termsContent = {
  terms: {
    title: '이용약관',
    content: `제1조 (목적)
이 약관은 재범방지교육통합센터 KRPIC(이하 "센터")가 제공하는 온라인 교육 서비스(이하 "서비스")의 이용조건 및 절차, 센터와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 센터가 제공하는 온라인 재범방지 교육 프로그램 및 관련 서비스를 말합니다.
2. "회원"이란 센터에 개인정보를 제공하여 회원등록을 한 자로서, 센터의 서비스를 이용할 수 있는 자를 말합니다.
3. "아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 정하고 센터가 승인하는 문자와 숫자의 조합을 말합니다.

제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
2. 센터는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.

제4조 (서비스의 제공)
1. 센터는 다음과 같은 서비스를 제공합니다.
   - 온라인 재범방지 교육 프로그램
   - 교육 수료증 발급
   - 교육 관련 상담 서비스
2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.

제5조 (회원의 의무)
1. 회원은 관계법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항을 준수하여야 합니다.
2. 회원은 서비스 이용과 관련하여 다음 각 호의 행위를 하여서는 안 됩니다.
   - 타인의 정보 도용
   - 센터의 저작권 등 지적재산권에 대한 침해
   - 서비스의 안정적 운영을 방해하는 행위`,
  },
  privacy: {
    title: '개인정보처리방침',
    content: `재범방지교육통합센터 KRPIC(이하 "센터")는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.

제1조 (개인정보의 수집 및 이용목적)
센터는 다음의 목적을 위하여 개인정보를 처리합니다.
1. 회원 가입 및 관리
   - 회원제 서비스 이용에 따른 본인확인, 개인식별
   - 회원자격 유지·관리, 서비스 부정이용 방지
2. 서비스 제공
   - 교육 서비스 제공, 수료증 발급
   - 맞춤형 서비스 제공, 본인인증

제2조 (수집하는 개인정보 항목)
센터는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.
1. 필수항목: 이름, 이메일, 연락처, 비밀번호
2. 선택항목: 생년월일, 성별

제3조 (개인정보의 보유 및 이용기간)
1. 센터는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
2. 회원 탈퇴 시 지체 없이 해당 개인정보를 파기합니다.

제4조 (개인정보의 제3자 제공)
센터는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.
1. 이용자가 사전에 동의한 경우
2. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

제5조 (개인정보의 파기)
센터는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.`,
  },
  marketing: {
    title: '마케팅 수신 동의',
    content: `재범방지교육통합센터 KRPIC(이하 "센터")는 회원님께 유익한 정보를 제공하기 위해 마케팅 정보 수신에 대한 동의를 받고 있습니다.

1. 마케팅 정보 수신 목적
   - 신규 교육 과정 안내
   - 할인 및 이벤트 정보 제공
   - 교육 관련 뉴스레터 발송
   - 맞춤형 교육 추천 서비스

2. 수신 방법
   - 이메일
   - SMS/문자 메시지
   - 앱 푸시 알림

3. 수신 동의 철회
   - 마케팅 정보 수신에 동의하신 후에도 언제든지 수신 거부를 하실 수 있습니다.
   - 수신 거부는 마이페이지 > 알림 설정 또는 고객센터를 통해 가능합니다.

4. 유의사항
   - 마케팅 수신 동의는 선택사항이며, 동의하지 않으셔도 서비스 이용에 제한이 없습니다.
   - 단, 동의하지 않으실 경우 유익한 이벤트 및 할인 정보를 받아보실 수 없습니다.`,
  },
};

// 모달 컴포넌트
function TermsModal({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy' | 'marketing';
}) {
  if (!isOpen) return null;

  const content = termsContent[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary-100">
              <h3 className="text-lg font-bold text-primary-900">{content.title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-primary-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <pre className="whitespace-pre-wrap text-sm text-primary-700 font-sans leading-relaxed">
                {content.content}
              </pre>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-primary-100">
              <button
                onClick={onClose}
                className="w-full py-3 bg-primary-900 hover:bg-primary-800 text-white font-semibold rounded-xl transition-colors"
              >
                확인
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 모달 상태
  const [modalType, setModalType] = useState<'terms' | 'privacy' | 'marketing' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreeTerms(newValue);
    setAgreePrivacy(newValue);
    setAgreeMarketing(newValue);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    const result = await signUp(
      formData.email,
      formData.password,
      formData.name,
      formData.phone
    );

    if (result.success) {
      // 회원가입 성공 후 자동 로그인 완료, redirect 또는 홈으로 이동 (쿠키 설정 위해 full refresh)
      window.location.href = redirectTo || '/';
    } else {
      setError(translateAuthError(result.error || ''));
    }

    setIsLoading(false);
  };

  const handleNaverRegister = () => {
    window.location.href = redirectTo ? `/api/auth/naver?redirect=${encodeURIComponent(redirectTo)}` : '/api/auth/naver';
  };

  const handleKakaoRegister = () => {
    window.location.href = redirectTo ? `/api/auth/kakao?redirect=${encodeURIComponent(redirectTo)}` : '/api/auth/kakao';
  };

  // 로그인 링크에 redirect 파라미터 전달
  const loginUrl = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center px-4 py-24 md:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary-500/15 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex flex-col items-center gap-3">
              <div className="relative w-14 h-14">
                <Image
                  src="/images/logo/logo.png"
                  alt="KRPIC"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-900">KRPIC</h1>
                <p className="text-xs text-primary-500">재범방지교육통합센터</p>
              </div>
            </Link>
          </div>

          {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary-900 mb-2">
                  회원가입
                </h2>
                <p className="text-primary-500 text-sm">
                  계정을 만들고 교육을 시작하세요
                </p>
              </div>

              {/* Social Register */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleNaverRegister}
              className="flex items-center justify-center gap-2 py-3 bg-[#03C75A] hover:bg-[#02b351] text-white font-medium rounded-xl transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.5 10.5L6.2 0H0v20h6.5V9.5L13.8 20H20V0h-6.5v10.5z" />
              </svg>
              <span>네이버</span>
            </button>

            <button
              onClick={handleKakaoRegister}
              className="flex items-center justify-center gap-2 py-3 bg-[#FEE500] hover:bg-[#F7DF00] text-[#3C1E1E] font-medium rounded-xl transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.17.6-.63 2.19-.72 2.53-.12.43.16.42.33.31.14-.09 2.19-1.49 3.08-2.09.52.08 1.06.12 1.6.12 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
              </svg>
              <span>카카오</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-primary-200" />
            <span className="text-primary-400 text-sm">이메일로 가입</span>
            <div className="flex-1 h-px bg-primary-200" />
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary-700 mb-1.5">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  className="w-full pl-12 pr-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-primary-900 placeholder:text-primary-400"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1.5">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="이메일을 입력하세요"
                  className="w-full pl-12 pr-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-primary-900 placeholder:text-primary-400"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-primary-700 mb-1.5">
                연락처
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="연락처를 입력하세요"
                  className="w-full pl-12 pr-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-primary-900 placeholder:text-primary-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-12 pr-12 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-primary-900 placeholder:text-primary-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Confirm */}
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-primary-700 mb-1.5">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full pl-12 pr-12 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-primary-900 placeholder:text-primary-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
                >
                  {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* 실시간 비밀번호 검증 */}
              {(formData.password || formData.passwordConfirm) && (
                <div className="mt-3 space-y-2">
                  <div className={`flex items-center gap-2 text-sm ${formData.password.length >= 8 ? 'text-green-600' : 'text-red-500'}`}>
                    {formData.password.length >= 8 ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span>비밀번호 8자 이상 {formData.password.length >= 8 ? '✓' : `(현재 ${formData.password.length}자)`}</span>
                  </div>
                  {formData.passwordConfirm && (
                    <div className={`flex items-center gap-2 text-sm ${formData.password === formData.passwordConfirm ? 'text-green-600' : 'text-red-500'}`}>
                      {formData.password === formData.passwordConfirm ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>비밀번호 일치 {formData.password === formData.passwordConfirm ? '✓' : '✗'}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeAll}
                  onChange={handleAgreeAll}
                  className="w-5 h-5 rounded border-primary-300 text-accent-600 focus:ring-accent-500"
                />
                <span className="font-medium text-primary-900">전체 동의</span>
              </label>

              <div className="pl-2 space-y-2 border-l-2 border-primary-100 ml-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-primary-300 text-accent-600 focus:ring-accent-500"
                  />
                  <span className="text-sm text-primary-600">
                    <span className="text-accent-600">[필수]</span>{' '}
                    <button
                      type="button"
                      onClick={() => setModalType('terms')}
                      className="underline hover:text-primary-900 transition-colors"
                    >
                      이용약관 동의
                    </button>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="w-4 h-4 rounded border-primary-300 text-accent-600 focus:ring-accent-500"
                  />
                  <span className="text-sm text-primary-600">
                    <span className="text-accent-600">[필수]</span>{' '}
                    <button
                      type="button"
                      onClick={() => setModalType('privacy')}
                      className="underline hover:text-primary-900 transition-colors"
                    >
                      개인정보처리방침 동의
                    </button>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                    className="w-4 h-4 rounded border-primary-300 text-accent-600 focus:ring-accent-500"
                  />
                  <span className="text-sm text-primary-600">
                    <span className="text-primary-400">[선택]</span>{' '}
                    <button
                      type="button"
                      onClick={() => setModalType('marketing')}
                      className="underline hover:text-primary-900 transition-colors"
                    >
                      마케팅 수신 동의
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-accent-500/25 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : '회원가입'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-primary-600 text-sm">
              이미 계정이 있으신가요?{' '}
              <Link href={loginUrl} className="text-accent-600 hover:text-accent-700 font-semibold">
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-white/50 text-sm mt-6">
          가입에 문제가 있으신가요?{' '}
          <a
            href="http://pf.kakao.com/_stxkUn/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white font-medium"
          >
            고객센터 문의
          </a>
        </p>
      </motion.div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType || 'terms'}
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
