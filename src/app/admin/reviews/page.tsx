'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Star,
  MessageSquare,
  BadgeCheck,
  ThumbsUp,
  Calendar
} from 'lucide-react';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  ReviewInput
} from '@/lib/reviews/actions';
import { Review } from '@/types';
import { categories } from '@/data/categories';

const categoryOptions = [
  { value: 'all', label: '전체' },
  ...categories.map(cat => ({ value: cat.slug, label: cat.name })),
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formAuthor, setFormAuthor] = useState('');
  const [formCategory, setFormCategory] = useState('drunk-driving');
  const [formContent, setFormContent] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formVerified, setFormVerified] = useState(true);
  const [formHelpful, setFormHelpful] = useState(0);

  // 카테고리 이름 가져오기
  const getCategoryName = (categorySlug: string) => {
    return categories.find((c) => c.slug === categorySlug)?.name || categorySlug;
  };

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    let filtered = reviews;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.author.toLowerCase().includes(query) ||
          getCategoryName(r.category).toLowerCase().includes(query) ||
          r.content.toLowerCase().includes(query)
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter((r) => r.category === filterCategory);
    }

    setFilteredReviews(filtered);
  }, [reviews, searchQuery, filterCategory]);

  const loadReviews = async () => {
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setMessage({ type: 'error', text: '후기를 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormAuthor('');
    setFormCategory('drunk-driving');
    setFormContent('');
    setFormRating(5);
    setFormVerified(true);
    setFormHelpful(0);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (review: Review) => {
    setSelectedReview(review);
    setFormAuthor(review.author);
    setFormCategory(review.category);
    setFormContent(review.content);
    setFormRating(review.rating);
    setFormVerified(review.verified);
    setFormHelpful(review.helpful);
    setShowEditModal(true);
  };

  const openDeleteModal = (review: Review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const handleCreate = async () => {
    if (!formAuthor.trim() || !formContent.trim()) {
      setMessage({ type: 'error', text: '모든 필수 항목을 입력해주세요.' });
      return;
    }

    setActionLoading(true);
    const input: ReviewInput = {
      author: formAuthor,
      courseTitle: getCategoryName(formCategory) + ' 교육',
      category: formCategory,
      content: formContent,
      rating: formRating,
      verified: formVerified,
      helpful: formHelpful,
    };

    const result = await createReview(input);
    if (result.success) {
      setMessage({ type: 'success', text: '후기가 등록되었습니다.' });
      setShowCreateModal(false);
      loadReviews();
    } else {
      setMessage({ type: 'error', text: result.error || '등록에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedReview) return;
    if (!formAuthor.trim() || !formContent.trim()) {
      setMessage({ type: 'error', text: '모든 필수 항목을 입력해주세요.' });
      return;
    }

    setActionLoading(true);
    const input: ReviewInput = {
      author: formAuthor,
      courseTitle: getCategoryName(formCategory) + ' 교육',
      category: formCategory,
      content: formContent,
      rating: formRating,
      verified: formVerified,
      helpful: formHelpful,
    };

    const result = await updateReview(selectedReview.id, input);
    if (result.success) {
      setMessage({ type: 'success', text: '후기가 수정되었습니다.' });
      setShowEditModal(false);
      loadReviews();
    } else {
      setMessage({ type: 'error', text: result.error || '수정에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedReview) return;

    setActionLoading(true);
    const result = await deleteReview(selectedReview.id);
    if (result.success) {
      setMessage({ type: 'success', text: '후기가 삭제되었습니다.' });
      setShowDeleteModal(false);
      loadReviews();
    } else {
      setMessage({ type: 'error', text: result.error || '삭제에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Auto-hide message
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">수강생 후기 관리</h1>
          <p className="text-gray-500">수강생 후기를 관리합니다</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          새 후기
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="작성자, 카테고리, 내용으로 검색..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {categoryOptions.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">작성자</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">카테고리</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">내용</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">평점</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">작성일</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{review.author}</span>
                        {review.verified && (
                          <BadgeCheck className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
                        {getCategoryName(review.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 text-sm line-clamp-2 max-w-xs">{review.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">({review.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(review.date)}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-gray-400">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-xs">{review.helpful}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(review)}
                          className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                          title="수정"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(review)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || filterCategory !== 'all'
                      ? '검색 결과가 없습니다'
                      : '등록된 후기가 없습니다'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Count */}
      <p className="text-sm text-gray-500 text-center">
        총 {filteredReviews.length}건의 후기
      </p>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {showCreateModal ? '새 후기' : '후기 수정'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Author & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">작성자</label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      placeholder="예: 김**"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rating & Helpful & Verified */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">평점</label>
                    <div className="flex items-center gap-1 px-3 py-3 border border-gray-200 rounded-xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              star <= formRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">좋아요 수</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={formHelpful}
                        onChange={(e) => setFormHelpful(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">인증 여부</label>
                    <button
                      type="button"
                      onClick={() => setFormVerified(!formVerified)}
                      className={`w-full px-4 py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors ${
                        formVerified
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <BadgeCheck className="w-4 h-4" />
                      {formVerified ? '인증' : '미인증'}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">후기 내용</label>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="후기 내용을 입력하세요"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                    }}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={showCreateModal ? handleCreate : handleUpdate}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? (showCreateModal ? '등록 중...' : '수정 중...') : (showCreateModal ? '등록' : '수정')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedReview && (
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">후기 삭제</h2>
                <p className="text-gray-500 mb-6">
                  <strong>{selectedReview.author}</strong>님의 후기를<br />
                  삭제하시겠습니까?
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
