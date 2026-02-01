import { createClient } from '@/lib/supabase/server';
import { CheckCircle, XCircle, Shield, Calendar, User, Award } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function VerifyPage({ params }: PageProps) {
  const { code } = await params;
  const supabase = await createClient();

  // 인증 정보 조회
  const { data: verification, error } = await supabase
    .from('certificate_verifications')
    .select('*')
    .eq('code', code)
    .single();

  // 조회 성공 시 verified_count 증가
  if (verification && !error) {
    await supabase
      .from('certificate_verifications')
      .update({ verified_count: (verification.verified_count || 0) + 1 })
      .eq('id', verification.id);
  }

  const isValid = !!verification && !error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-xl font-bold text-slate-800">재범방지교육통합센터</h1>
          </Link>
        </div>

        {/* 인증 결과 카드 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 상태 헤더 */}
          <div className={`p-6 ${isValid ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className="flex items-center justify-center gap-3">
              {isValid ? (
                <>
                  <CheckCircle className="w-10 h-10 text-white" />
                  <span className="text-2xl font-bold text-white">인증 완료</span>
                </>
              ) : (
                <>
                  <XCircle className="w-10 h-10 text-white" />
                  <span className="text-2xl font-bold text-white">인증 실패</span>
                </>
              )}
            </div>
          </div>

          {/* 내용 */}
          <div className="p-6">
            {isValid ? (
              <>
                <div className="text-center mb-6">
                  <p className="text-slate-600">
                    이 수료증은 <strong>재범방지교육통합센터</strong>에서
                    <br />정식으로 발급한 문서입니다.
                  </p>
                </div>

                <div className="space-y-4 bg-slate-50 rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">성명</p>
                      <p className="font-semibold text-slate-800">{verification.user_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">수료증 종류</p>
                      <p className="font-semibold text-slate-800">{verification.certificate_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">수료일</p>
                      <p className="font-semibold text-slate-800">
                        {new Date(verification.completion_date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">인증번호</p>
                      <p className="font-mono text-sm text-slate-800">{verification.code}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-sm text-green-700 text-center">
                    본 인증은 {verification.verified_count + 1}회 조회되었습니다.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">
                  해당 인증번호로 등록된 수료증을 찾을 수 없습니다.
                </p>
                <p className="text-sm text-slate-500">
                  인증번호를 다시 확인하시거나,
                  <br />수료증 발급 기관에 문의해 주세요.
                </p>

                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">
                    입력된 코드: <span className="font-mono">{code}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            문의: 재범방지교육통합센터
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            홈페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
