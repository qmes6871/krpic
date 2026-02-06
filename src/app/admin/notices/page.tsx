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
  Bell,
  RefreshCw,
  Gift,
  BookOpen,
  Pin,
  Eye,
  Calendar,
  FileText,
  MessageSquare
} from 'lucide-react';
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  NoticeInput
} from '@/lib/notices/actions';
import { Notice } from '@/types';

const categoryOptions = [
  { value: 'notice', label: '공지', icon: Bell, color: 'bg-blue-100 text-blue-700' },
  { value: 'update', label: '업데이트', icon: RefreshCw, color: 'bg-purple-100 text-purple-700' },
  { value: 'event', label: '이벤트', icon: Gift, color: 'bg-pink-100 text-pink-700' },
  { value: 'guide', label: '이용안내', icon: BookOpen, color: 'bg-green-100 text-green-700' },
];

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<'notice' | 'update' | 'event' | 'guide'>('notice');
  const [formImportant, setFormImportant] = useState(false);
  const [formShowPopup, setFormShowPopup] = useState(false);
  const [formViews, setFormViews] = useState(0);
  const [formDate, setFormDate] = useState('');

  useEffect(() => {
    loadNotices();
  }, []);

  useEffect(() => {
    let filtered = notices;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query)
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter((n) => n.category === filterCategory);
    }

    setFilteredNotices(filtered);
  }, [notices, searchQuery, filterCategory]);

  const loadNotices = async () => {
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices:', error);
      setMessage({ type: 'error', text: '공지사항을 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormCategory('notice');
    setFormImportant(false);
    setFormShowPopup(false);
    setFormViews(0);
    setFormDate(new Date().toISOString().split('T')[0]);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setFormTitle(notice.title);
    setFormContent(notice.content);
    setFormCategory(notice.category as 'notice' | 'update' | 'event' | 'guide');
    setFormImportant(notice.important);
    setFormShowPopup(notice.showPopup || false);
    setFormViews(notice.views);
    setFormDate(notice.date);
    setShowEditModal(true);
  };

  const openDeleteModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setShowDeleteModal(true);
  };

  const handleCreate = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      setMessage({ type: 'error', text: '제목과 내용을 입력해주세요.' });
      return;
    }

    setActionLoading(true);
    const input: NoticeInput = {
      title: formTitle,
      content: formContent,
      category: formCategory,
      important: formImportant,
      showPopup: formShowPopup,
      views: formViews,
      createdAt: formDate ? `${formDate}T00:00:00.000Z` : undefined,
    };

    const result = await createNotice(input);
    if (result.success) {
      setMessage({ type: 'success', text: '공지사항이 등록되었습니다.' });
      setShowCreateModal(false);
      loadNotices();
    } else {
      setMessage({ type: 'error', text: result.error || '등록에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedNotice) return;
    if (!formTitle.trim() || !formContent.trim()) {
      setMessage({ type: 'error', text: '제목과 내용을 입력해주세요.' });
      return;
    }

    setActionLoading(true);
    const input: NoticeInput = {
      title: formTitle,
      content: formContent,
      category: formCategory,
      important: formImportant,
      showPopup: formShowPopup,
      views: formViews,
      createdAt: formDate ? `${formDate}T00:00:00.000Z` : undefined,
    };

    const result = await updateNotice(selectedNotice.id, input);
    if (result.success) {
      setMessage({ type: 'success', text: '공지사항이 수정되었습니다.' });
      setShowEditModal(false);
      loadNotices();
    } else {
      setMessage({ type: 'error', text: result.error || '수정에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedNotice) return;

    setActionLoading(true);
    const result = await deleteNotice(selectedNotice.id);
    if (result.success) {
      setMessage({ type: 'success', text: '공지사항이 삭제되었습니다.' });
      setShowDeleteModal(false);
      loadNotices();
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

  const getCategoryConfig = (category: string) => {
    return categoryOptions.find((c) => c.value === category) || categoryOptions[0];
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
          <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
          <p className="text-gray-500">공지사항을 작성하고 관리합니다</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          새 공지사항
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
            placeholder="제목, 내용으로 검색..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">전체 카테고리</option>
          {categoryOptions.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Notices Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">제목</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">카테고리</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">팝업</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">작성일</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">조회수</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => {
                  const categoryConfig = getCategoryConfig(notice.category);
                  const CategoryIcon = categoryConfig.icon;
                  return (
                    <tr key={notice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {notice.important && (
                            <span className="flex-shrink-0 w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center">
                              <Pin className="w-3 h-3 text-accent-600" />
                            </span>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{notice.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{notice.content.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${categoryConfig.color}`}>
                          <CategoryIcon className="w-3 h-3" />
                          {categoryConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {notice.showPopup ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <MessageSquare className="w-3 h-3" />
                            표시중
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(notice.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          {notice.views.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(notice)}
                            className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                            title="수정"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(notice)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
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
                    {searchQuery || filterCategory !== 'all'
                      ? '검색 결과가 없습니다'
                      : '등록된 공지사항이 없습니다'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Count */}
      <p className="text-sm text-gray-500 text-center">
        총 {filteredNotices.length}건의 공지사항
      </p>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">새 공지사항</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="공지사항 제목을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as 'notice' | 'update' | 'event' | 'guide')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Important & Popup */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">중요 공지</label>
                    <button
                      type="button"
                      onClick={() => setFormImportant(!formImportant)}
                      className={`w-full px-4 py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors ${
                        formImportant
                          ? 'bg-accent-100 border-accent-300 text-accent-700'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Pin className="w-4 h-4" />
                      {formImportant ? '설정됨' : '설정'}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">팝업 표시</label>
                    <button
                      type="button"
                      onClick={() => setFormShowPopup(!formShowPopup)}
                      className={`w-full px-4 py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors ${
                        formShowPopup
                          ? 'bg-green-100 border-green-300 text-green-700'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      {formShowPopup ? '표시중' : '표시'}
                    </button>
                  </div>
                </div>

                {/* Views & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">조회수</label>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        value={formViews}
                        onChange={(e) => setFormViews(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">작성일</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="공지사항 내용을 입력하세요"
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? '등록 중...' : '등록'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">공지사항 수정</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="공지사항 제목을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as 'notice' | 'update' | 'event' | 'guide')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Important & Popup */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">중요 공지</label>
                    <button
                      type="button"
                      onClick={() => setFormImportant(!formImportant)}
                      className={`w-full px-4 py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors ${
                        formImportant
                          ? 'bg-accent-100 border-accent-300 text-accent-700'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Pin className="w-4 h-4" />
                      {formImportant ? '설정됨' : '설정'}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">팝업 표시</label>
                    <button
                      type="button"
                      onClick={() => setFormShowPopup(!formShowPopup)}
                      className={`w-full px-4 py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors ${
                        formShowPopup
                          ? 'bg-green-100 border-green-300 text-green-700'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      {formShowPopup ? '표시중' : '표시'}
                    </button>
                  </div>
                </div>

                {/* Views & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">조회수</label>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        value={formViews}
                        onChange={(e) => setFormViews(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">작성일</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="공지사항 내용을 입력하세요"
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? '수정 중...' : '수정'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedNotice && (
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">공지사항 삭제</h2>
                <p className="text-gray-500 mb-6">
                  <strong>&ldquo;{selectedNotice.title}&rdquo;</strong><br />
                  공지사항을 삭제하시겠습니까?
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
