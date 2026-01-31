'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen,
  User,
  LogOut,
  Mail,
  Phone,
  Calendar,
  PlayCircle,
  Clock,
  ChevronRight,
  GraduationCap,
  Settings,
  FileText,
  X,
  Lock,
  Eye,
  EyeOff,
  Save,
  Award,
  Download,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { translateAuthError } from '@/lib/auth/errors';
import CertificateGenerator from '@/components/certificate/CertificateGenerator';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

interface EnrolledCourse {
  id: string;
  courseId: string;
  title: string;
  category: string;
  thumbnail: string | null;
  enrolledAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  progressPercentage: number;
  completedAt: string | null;
  certificateNumber: string | null;
}

// 회원정보 수정 모달
function EditProfileModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdate: (name: string, phone: string) => void;
}) {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, phone: user.phone });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      data: { name: formData.name, phone: formData.phone },
    });

    if (updateError) {
      setError(translateAuthError(updateError.message));
    } else {
      onUpdate(formData.name, formData.phone);
      onClose();
    }
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">회원정보 수정</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="연락처를 입력하세요"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSaving ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// 비밀번호 변경 모달
function ChangePasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ password: '', confirmPassword: '' });
      setError('');
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setIsSaving(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: formData.password,
    });

    if (updateError) {
      setError(translateAuthError(updateError.message));
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">비밀번호 변경</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-900 font-medium">비밀번호가 변경되었습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">새 비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="8자 이상 입력하세요"
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="비밀번호를 다시 입력하세요"
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? '변경 중...' : '변경하기'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function MyCoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'profile'>('courses');
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedEnrollmentForCertificate, setSelectedEnrollmentForCertificate] = useState<string | null>(null);

  // URL 파라미터에서 탭 설정
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'profile') {
      setActiveTab('profile');
    } else if (tab === 'courses') {
      setActiveTab('courses');
    }
  }, [searchParams]);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/login');
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || '회원',
        phone: authUser.user_metadata?.phone || '',
        createdAt: authUser.created_at,
      });

      // 수강 신청 목록 조회
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (enrollments) {
        const courses: EnrolledCourse[] = enrollments.map((enrollment: any) => {
          const videoDuration = enrollment.video_duration_seconds || 0;
          const maxWatched = enrollment.max_watched_position || 0;
          const progressPercentage = videoDuration > 0 ? Math.round((maxWatched / videoDuration) * 100) : 0;

          return {
            id: enrollment.id,
            courseId: enrollment.course_id,
            title: enrollment.course?.title || '프로그램 없음',
            category: enrollment.course?.category || '',
            thumbnail: enrollment.course?.thumbnail,
            enrolledAt: enrollment.created_at,
            status: enrollment.status,
            paymentStatus: enrollment.payment_status,
            progressPercentage,
            completedAt: enrollment.completed_at,
            certificateNumber: enrollment.certificate_number,
          };
        });
        setEnrolledCourses(courses);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleProfileUpdate = (name: string, phone: string) => {
    if (user) {
      setUser({ ...user, name, phone });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 pt-24 pb-12">
        <div className="container-custom">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {user?.name}님, 안녕하세요!
              </h1>
              <p className="text-white/70 text-sm mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container-custom">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                activeTab === 'courses'
                  ? 'text-primary-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                내 강의
              </span>
              {activeTab === 'courses' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                activeTab === 'profile'
                  ? 'text-primary-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                마이페이지
              </span>
              {activeTab === 'profile' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {activeTab === 'courses' ? (
          <div>
            {/* 수강 중인 강의 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">수강 중인 강의</h2>

              {enrolledCourses.filter(c => c.status !== 'completed').length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    수강 중인 교육이 없습니다
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    재범방지교육을 신청하고 학습을 시작하세요.
                  </p>
                  <Link
                    href="/education"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    <GraduationCap className="w-5 h-5" />
                    교육 둘러보기
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {enrolledCourses.filter(c => c.status !== 'completed').map((course) => {
                    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
                      pending: { label: '승인 대기', color: 'text-yellow-700', bg: 'bg-yellow-100' },
                      approved: { label: '수강 중', color: 'text-green-700', bg: 'bg-green-100' },
                      rejected: { label: '승인 거절', color: 'text-red-700', bg: 'bg-red-100' },
                      completed: { label: '교육 완료', color: 'text-blue-700', bg: 'bg-blue-100' },
                    };
                    const paymentConfig: Record<string, { label: string; color: string; bg: string }> = {
                      unpaid: { label: '미결제', color: 'text-red-700', bg: 'bg-red-100' },
                      paid: { label: '결제완료', color: 'text-green-700', bg: 'bg-green-100' },
                      refunded: { label: '환불', color: 'text-gray-700', bg: 'bg-gray-100' },
                    };
                    const status = statusConfig[course.status] || statusConfig.pending;
                    const payment = paymentConfig[course.paymentStatus] || paymentConfig.unpaid;
                    const canLearn = course.status === 'approved' && course.paymentStatus === 'paid';

                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                                {status.label}
                              </span>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${payment.bg} ${payment.color}`}>
                                {payment.label}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(course.enrolledAt).toLocaleDateString('ko-KR')}
                              </span>
                            </div>

                            {/* Progress Bar */}
                            {canLearn && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                  <span>진도율</span>
                                  <span className="font-medium text-primary-600">{course.progressPercentage}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                                    style={{ width: `${course.progressPercentage}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          {canLearn && (
                            <div className="flex items-center">
                              <Link
                                href={`/learn/${course.courseId}`}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
                              >
                                <PlayCircle className="w-5 h-5" />
                                {course.progressPercentage > 0 ? '이어서 학습' : '학습하기'}
                              </Link>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 수료한 강의 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                수료한 교육
              </h2>
              {enrolledCourses.filter(c => c.status === 'completed').length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    아직 수료한 교육이 없습니다.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {enrolledCourses.filter(c => c.status === 'completed').map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              수료 완료
                            </span>
                            {course.certificateNumber && (
                              <span className="text-xs text-gray-500">
                                {course.certificateNumber}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              수료일: {course.completedAt
                                ? new Date(course.completedAt).toLocaleDateString('ko-KR')
                                : new Date(course.enrolledAt).toLocaleDateString('ko-KR')
                              }
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => setSelectedEnrollmentForCertificate(course.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-medium rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-md"
                          >
                            <Download className="w-5 h-5" />
                            수료증 다운로드
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl">
            {/* 프로필 정보 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                회원 정보
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">이름</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">이메일</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">연락처</p>
                    <p className="font-medium text-gray-900">{user?.phone || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">가입일</p>
                    <p className="font-medium text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 계정 관리 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-600" />
                계정 관리
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-gray-700">회원정보 수정</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-gray-700">비밀번호 변경</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-red-50 transition-colors text-left"
                >
                  <span className="text-red-600 flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    로그아웃
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 모달 */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
      {selectedEnrollmentForCertificate && (
        <CertificateGenerator
          enrollmentId={selectedEnrollmentForCertificate}
          onClose={() => setSelectedEnrollmentForCertificate(null)}
        />
      )}
    </div>
  );
}

export default function MyCoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    }>
      <MyCoursesContent />
    </Suspense>
  );
}
