'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  MessageCircle,
  Clock,
  FileText,
  Building2,
  User,
  Hash,
  ArrowRight,
  Home,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface InmateInfo {
  institution: string;
  name: string;
  number: string;
}

export default function DetentionCompletePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [courseTitle, setCourseTitle] = useState('');
  const [inmateInfo, setInmateInfo] = useState<InmateInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // URL 파라미터에서 수감자 정보 가져오기
    const searchParams = new URLSearchParams(window.location.search);
    const institution = searchParams.get('institution');
    const name = searchParams.get('name');
    const number = searchParams.get('number');
    const title = searchParams.get('title');

    if (institution && name && number) {
      setInmateInfo({
        institution: decodeURIComponent(institution),
        name: decodeURIComponent(name),
        number: decodeURIComponent(number),
      });
    }

    if (title) {
      setCourseTitle(decodeURIComponent(title));
    }

    // 로그인 확인
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [courseId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-green-800" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="container-custom relative text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            교육 신청이 완료되었습니다
          </h1>
          <p className="text-white/80 text-lg">
            재범방지교육통합센터에서 곧 연락드리겠습니다.
          </p>
        </div>
      </section>

      <div className="container-custom py-8 -mt-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 신청 정보 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              신청 정보
            </h2>

            {courseTitle && (
              <div className="mb-4 p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-green-600 font-medium">신청 교육</p>
                <p className="text-lg font-bold text-green-800">{courseTitle}</p>
              </div>
            )}

            {inmateInfo && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">수감중인 교정기관</p>
                    <p className="font-medium text-gray-900">{inmateInfo.institution}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">수감자 성함</p>
                    <p className="font-medium text-gray-900">{inmateInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Hash className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">수감번호</p>
                    <p className="font-medium text-gray-900">{inmateInfo.number}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 진행 절차 안내 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              앞으로의 진행 절차
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">신청 확인 연락</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    영업일 기준 1~2일 내에 담당자가 연락드립니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">교육 내용 전달</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    교정기관을 통해 수감자에게 교육 자료가 전달됩니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">교육 수료 및 소감문 작성</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    수감자가 교육을 이수하고 소감문을 작성합니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">수료증 및 양형자료 발급</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    수료증과 양형자료를 발급하여 재판부에 제출할 수 있도록 안내드립니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 문의 안내 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-600" />
              문의하기
            </h2>
            <p className="text-gray-600 mb-4">
              궁금하신 점이 있으시면 언제든 연락주세요.
            </p>

            <a
              href="http://pf.kakao.com/_stxkUn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors"
            >
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-yellow-900" />
              </div>
              <div>
                <p className="text-xs text-gray-500">카카오톡 문의</p>
                <p className="font-medium text-gray-900">채널톡 상담</p>
              </div>
            </a>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              홈으로
            </Link>
            <Link
              href="/my-courses"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              신청 내역 확인
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
