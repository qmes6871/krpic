'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { signIn } from '@/lib/auth/actions';
import { translateAuthError } from '@/lib/auth/errors';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('회원가입이 완료되었습니다. 로그인해주세요.');
    }
    if (searchParams.get('message') === 'login_required') {
      setError('수강신청을 하시려면 로그인이 필요합니다.');
    }
    const oauthError = searchParams.get('error');
    if (oauthError) {
      const errorMessages: Record<string, string> = {
        naver_auth_failed: '네이버 로그인에 실패했습니다.',
        kakao_auth_failed: '카카오 로그인에 실패했습니다.',
        no_code: '인증 코드를 받지 못했습니다.',
        token_failed: '인증 토큰 발급에 실패했습니다.',
        user_info_failed: '사용자 정보를 가져오지 못했습니다.',
        create_user_failed: '계정 생성에 실패했습니다.',
        session_failed: '세션 생성에 실패했습니다.',
        unknown: '알 수 없는 오류가 발생했습니다.',
      };
      setError(errorMessages[oauthError] || '로그인 중 오류가 발생했습니다.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      // redirect 파라미터가 있으면 해당 페이지로 이동
      const redirectTo = searchParams.get('redirect');
      // 쿠키가 제대로 적용되도록 전체 페이지 새로고침
      window.location.href = redirectTo || '/';
    } else {
      setError(translateAuthError(result.error || ''));
    }

    setIsLoading(false);
  };

  const handleNaverLogin = () => {
    const redirectTo = searchParams.get('redirect');
    window.location.href = redirectTo ? `/api/auth/naver?redirect=${encodeURIComponent(redirectTo)}` : '/api/auth/naver';
  };

  const handleKakaoLogin = () => {
    const redirectTo = searchParams.get('redirect');
    window.location.href = redirectTo ? `/api/auth/kakao?redirect=${encodeURIComponent(redirectTo)}` : '/api/auth/kakao';
  };

  // 회원가입 링크에 redirect 파라미터 전달
  const registerUrl = searchParams.get('redirect')
    ? `/register?redirect=${encodeURIComponent(searchParams.get('redirect')!)}`
    : '/register';

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

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
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
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary-900 mb-2">
              로그인
            </h2>
            <p className="text-primary-500 text-sm">
              계정에 로그인하여 교육을 시작하세요
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                {successMessage}
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1.5">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className="w-full pl-12 pr-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-primary-900 placeholder:text-primary-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-primary-300 text-accent-600 focus:ring-accent-500"
                />
                <span className="text-primary-600">로그인 상태 유지</span>
              </label>
              <Link href="/forgot-password" className="text-accent-600 hover:text-accent-700 font-medium">
                비밀번호 찾기
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-primary-200" />
            <span className="text-primary-400 text-sm">간편 로그인</span>
            <div className="flex-1 h-px bg-primary-200" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleNaverLogin}
              className="flex items-center justify-center gap-2 py-3 bg-[#03C75A] hover:bg-[#02b351] text-white font-medium rounded-xl transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.5 10.5L6.2 0H0v20h6.5V9.5L13.8 20H20V0h-6.5v10.5z" />
              </svg>
              <span>네이버</span>
            </button>

            <button
              onClick={handleKakaoLogin}
              className="flex items-center justify-center gap-2 py-3 bg-[#FEE500] hover:bg-[#F7DF00] text-[#3C1E1E] font-medium rounded-xl transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.17.6-.63 2.19-.72 2.53-.12.43.16.42.33.31.14-.09 2.19-1.49 3.08-2.09.52.08 1.06.12 1.6.12 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
              </svg>
              <span>카카오</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-primary-600 text-sm">
              아직 회원이 아니신가요?{' '}
              <Link href={registerUrl} className="text-accent-600 hover:text-accent-700 font-semibold">
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-white/50 text-sm mt-6">
          로그인에 문제가 있으신가요?{' '}
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
