'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  X,
  User,
  BookOpen,
  CreditCard,
  CheckCircle2,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { getEnrollments, updateEnrollment, deleteEnrollment } from '@/lib/admin/actions';
import { Enrollment, Profile, Course } from '@/types/admin';

type EnrollmentWithRelations = Enrollment & { user: Profile; course: Course };

function EnrollmentsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [enrollments, setEnrollments] = useState<EnrollmentWithRelations[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<EnrollmentWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>(initialStatus);
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithRelations | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadEnrollments();
  }, []);

  useEffect(() => {
    let filtered = enrollments;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.user?.name?.toLowerCase().includes(query) ||
          e.user?.email?.toLowerCase().includes(query) ||
          e.course?.title?.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((e) => e.status === filterStatus);
    }

    if (filterPayment !== 'all') {
      filtered = filtered.filter((e) => e.payment_status === filterPayment);
    }

    setFilteredEnrollments(filtered);
  }, [enrollments, searchQuery, filterStatus, filterPayment]);

  const loadEnrollments = async () => {
    try {
      const data = await getEnrollments();
      setEnrollments(data);
    } catch (error) {
      console.error('Failed to load enrollments:', error);
      setMessage({ type: 'error', text: '수강 신청 목록을 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      pending: { label: '대기중', color: 'text-yellow-700', bg: 'bg-yellow-100' },
      approved: { label: '승인', color: 'text-green-700', bg: 'bg-green-100' },
      rejected: { label: '거절', color: 'text-red-700', bg: 'bg-red-100' },
      completed: { label: '완료', color: 'text-blue-700', bg: 'bg-blue-100' }
    };
    return configs[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-100' };
  };

  const getPaymentConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      unpaid: { label: '미결제', color: 'text-red-700', bg: 'bg-red-100' },
      paid: { label: '결제완료', color: 'text-green-700', bg: 'bg-green-100' },
      refunded: { label: '환불', color: 'text-gray-700', bg: 'bg-gray-100' }
    };
    return configs[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-100' };
  };

  const handleUpdateStatus = async (enrollment: EnrollmentWithRelations, status: string) => {
    setActionLoading(true);
    const result = await updateEnrollment(enrollment.id, { status: status as Enrollment['status'] });
    if (result.success) {
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollment.id ? { ...e, status: status as Enrollment['status'] } : e))
      );
      setShowDetailModal(false);
      setMessage({ type: 'success', text: '상태가 변경되었습니다.' });
    } else {
      setMessage({ type: 'error', text: result.error || '상태 변경에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const handleUpdatePayment = async (enrollment: EnrollmentWithRelations, paymentStatus: string) => {
    setActionLoading(true);
    const result = await updateEnrollment(enrollment.id, { payment_status: paymentStatus as Enrollment['payment_status'] });
    if (result.success) {
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollment.id ? { ...e, payment_status: paymentStatus as Enrollment['payment_status'] } : e))
      );
      setShowDetailModal(false);
      setMessage({ type: 'success', text: '결제 상태가 변경되었습니다.' });
    } else {
      setMessage({ type: 'error', text: result.error || '상태 변경에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedEnrollment) return;

    setActionLoading(true);
    const result = await deleteEnrollment(selectedEnrollment.id);
    if (result.success) {
      setEnrollments((prev) => prev.filter((e) => e.id !== selectedEnrollment.id));
      setShowDeleteModal(false);
      setMessage({ type: 'success', text: '수강 신청이 삭제되었습니다.' });
    } else {
      setMessage({ type: 'error', text: result.error || '삭제에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
              message.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">수강 신청 관리</h1>
        <p className="text-gray-500">수강 신청을 확인하고 승인/거절합니다</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="회원명, 이메일, 프로그램명으로 검색..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체 상태</option>
            <option value="pending">대기중</option>
            <option value="approved">승인</option>
            <option value="rejected">거절</option>
            <option value="completed">완료</option>
          </select>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체 결제</option>
            <option value="unpaid">미결제</option>
            <option value="paid">결제완료</option>
            <option value="refunded">환불</option>
          </select>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">신청자</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">프로그램</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">신청일</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">상태</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">결제</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEnrollments.length > 0 ? (
                filteredEnrollments.map((enrollment) => {
                  const statusConfig = getStatusConfig(enrollment.status);
                  const paymentConfig = getPaymentConfig(enrollment.payment_status);
                  return (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{enrollment.user?.name || '이름 없음'}</p>
                            <p className="text-sm text-gray-500">{enrollment.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{enrollment.course?.title || '프로그램 없음'}</p>
                        <p className="text-sm text-gray-500">{formatPrice(enrollment.course?.price || 0)}원</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {formatDate(enrollment.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                          {enrollment.status === 'pending' && <Clock className="w-3 h-3" />}
                          {enrollment.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {enrollment.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${paymentConfig.bg} ${paymentConfig.color}`}>
                          <CreditCard className="w-3 h-3" />
                          {paymentConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {enrollment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(enrollment, 'approved')}
                                disabled={actionLoading}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                title="승인"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(enrollment, 'rejected')}
                                disabled={actionLoading}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                title="거절"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setSelectedEnrollment(enrollment);
                              setShowDetailModal(true);
                            }}
                            className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                            title="상세보기"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEnrollment(enrollment);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || filterStatus !== 'all' || filterPayment !== 'all'
                      ? '검색 결과가 없습니다'
                      : '수강 신청이 없습니다'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Count */}
      <p className="text-sm text-gray-500 text-center">
        총 {filteredEnrollments.length}건의 수강 신청
      </p>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedEnrollment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">수강 신청 상세</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">신청자 정보</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{selectedEnrollment.user?.name || '이름 없음'}</span>
                    </div>
                    <p className="text-sm text-gray-600">{selectedEnrollment.user?.email}</p>
                    {selectedEnrollment.user?.phone && (
                      <p className="text-sm text-gray-600">{selectedEnrollment.user.phone}</p>
                    )}
                  </div>
                </div>

                {/* Course Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">프로그램 정보</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{selectedEnrollment.course?.title || '프로그램 없음'}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      가격: {formatPrice(selectedEnrollment.course?.price || 0)}원
                    </p>
                  </div>
                </div>

                {/* Enrollment Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">신청 정보</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">신청일</span>
                      <span className="text-sm font-medium">{formatDate(selectedEnrollment.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">결제 금액</span>
                      <span className="text-sm font-medium">{formatPrice(selectedEnrollment.payment_amount)}원</span>
                    </div>
                    {selectedEnrollment.notes && (
                      <div>
                        <span className="text-sm text-gray-600">메모</span>
                        <p className="text-sm mt-1 p-2 bg-white rounded-lg">{selectedEnrollment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Controls */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">상태 변경</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedEnrollment, 'pending')}
                      disabled={actionLoading || selectedEnrollment.status === 'pending'}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedEnrollment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700'
                      }`}
                    >
                      대기중
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedEnrollment, 'approved')}
                      disabled={actionLoading || selectedEnrollment.status === 'approved'}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedEnrollment.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedEnrollment, 'rejected')}
                      disabled={actionLoading || selectedEnrollment.status === 'rejected'}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedEnrollment.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
                      }`}
                    >
                      거절
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedEnrollment, 'completed')}
                      disabled={actionLoading || selectedEnrollment.status === 'completed'}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedEnrollment.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      완료
                    </button>
                  </div>
                </div>

                {/* Payment Controls */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">결제 상태 변경</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleUpdatePayment(selectedEnrollment, 'unpaid')}
                      disabled={actionLoading || selectedEnrollment.payment_status === 'unpaid'}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedEnrollment.payment_status === 'unpaid'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
                      }`}
                    >
                      미결제
                    </button>
                    <button
                      onClick={() => handleUpdatePayment(selectedEnrollment, 'paid')}
                      disabled={actionLoading || selectedEnrollment.payment_status === 'paid'}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedEnrollment.payment_status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      결제완료
                    </button>
                    <button
                      onClick={() => handleUpdatePayment(selectedEnrollment, 'refunded')}
                      disabled={actionLoading || selectedEnrollment.payment_status === 'refunded'}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedEnrollment.payment_status === 'refunded'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      환불
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedEnrollment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">수강 신청 삭제</h2>
                <p className="text-gray-500 mb-6">
                  <strong>{selectedEnrollment.user?.name || '회원'}</strong>님의<br />
                  <strong>{selectedEnrollment.course?.title}</strong> 수강 신청을<br />
                  정말 삭제하시겠습니까?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-12 bg-gray-200 rounded" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EnrollmentsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EnrollmentsContent />
    </Suspense>
  );
}
