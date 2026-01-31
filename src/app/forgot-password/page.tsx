'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '@/lib/auth/actions';
import { translateAuthError } from '@/lib/auth/errors';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await resetPassword(email);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(translateAuthError(result.error || ''));
    }

    setIsLoading(false);
  };

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
          href="/login"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>로그인으로 돌아가기</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-3">
              <div className="relative w-14 h-14">
                <Image
                  src="/krpic/images/logo/logo.png"
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

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary-900 mb-2">
                  비밀번호 찾기
                </h2>
                <p className="text-primary-500 text-sm">
                  가입하신 이메일을 입력하시면<br />
                  비밀번호 재설정 링크를 보내드립니다.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="가입하신 이메일을 입력하세요"
                      className="w-full pl-12 pr-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-primary-900 placeholder:text-primary-400"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '처리 중...' : '재설정 링크 받기'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-primary-900 mb-2">
                  이메일을 확인하세요
                </h2>
                <p className="text-primary-500 text-sm mb-6">
                  <span className="font-medium text-primary-700">{email}</span>으로<br />
                  비밀번호 재설정 링크를 발송했습니다.
                </p>
                <p className="text-primary-400 text-xs mb-6">
                  이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setError('');
                  }}
                  className="text-accent-600 hover:text-accent-700 font-medium text-sm"
                >
                  다른 이메일로 다시 시도
                </button>
              </div>
            </>
          )}

          {/* Login Link */}
          <div className="text-center mt-8 pt-6 border-t border-primary-100">
            <p className="text-primary-600 text-sm">
              비밀번호가 기억나셨나요?{' '}
              <Link href="/login" className="text-accent-600 hover:text-accent-700 font-semibold">
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-white/50 text-sm mt-6">
          계정 복구에 문제가 있으신가요?{' '}
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
