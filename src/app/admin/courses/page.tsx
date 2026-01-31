'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  BookOpen,
  DollarSign,
  Clock,
  Tag,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  XCircle
} from 'lucide-react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '@/lib/admin/actions';
import { Course } from '@/types/admin';
import { categories } from '@/data/categories';
import { uploadImage, uploadMultipleImages } from '@/lib/supabase/storage';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 이미지 업로드 관련 상태
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [detailFiles, setDetailFiles] = useState<File[]>([]);
  const [detailPreviews, setDetailPreviews] = useState<string[]>([]);
  const [existingDetailImages, setExistingDetailImages] = useState<string[]>([]);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const detailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query)
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter((c) => c.category === filterCategory);
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, filterCategory]);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setMessage({ type: 'error', text: '프로그램 목록을 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (slug: string) => {
    const category = categories.find((c) => c.slug === slug);
    return category?.name || slug;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // 썸네일 파일 선택 핸들러
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setMessage({ type: 'error', text: `파일 크기가 너무 큽니다. (최대 50MB, 현재: ${(file.size / 1024 / 1024).toFixed(1)}MB)` });
        return;
      }
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 상세 이미지 파일 선택 핸들러
  const handleDetailFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const validFiles: File[] = [];
      const oversizedFiles: string[] = [];

      files.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
          oversizedFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
        } else {
          validFiles.push(file);
        }
      });

      if (oversizedFiles.length > 0) {
        setMessage({ type: 'error', text: `일부 파일이 너무 큽니다 (최대 50MB): ${oversizedFiles.join(', ')}` });
      }

      if (validFiles.length > 0) {
        setDetailFiles(prev => [...prev, ...validFiles]);

        validFiles.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setDetailPreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    }
  };

  // 새로 추가한 상세 이미지 삭제
  const removeNewDetailImage = (index: number) => {
    setDetailFiles(prev => prev.filter((_, i) => i !== index));
    setDetailPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // 기존 상세 이미지 삭제
  const removeExistingDetailImage = (index: number) => {
    setExistingDetailImages(prev => prev.filter((_, i) => i !== index));
  };

  // 이미지 상태 초기화
  const resetImageStates = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
    setDetailFiles([]);
    setDetailPreviews([]);
    setExistingDetailImages([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setActionLoading(true);

    try {
      // 썸네일 업로드
      let thumbnailUrl = selectedCourse?.thumbnail || '';
      if (thumbnailFile) {
        const result = await uploadImage(thumbnailFile, 'thumbnails');
        if (result.url) {
          thumbnailUrl = result.url;
        } else {
          setMessage({ type: 'error', text: `썸네일 업로드 실패: ${result.error}` });
          setActionLoading(false);
          return;
        }
      }

      // 새 상세 이미지 업로드
      let newDetailUrls: string[] = [];
      if (detailFiles.length > 0) {
        const result = await uploadMultipleImages(detailFiles, 'details');
        newDetailUrls = result.urls;
        if (result.errors.length > 0) {
          setMessage({ type: 'error', text: `일부 이미지 업로드 실패: ${result.errors.join(', ')}` });
        }
      }

      // 기존 이미지 + 새 이미지 합치기
      const allDetailImages = [...existingDetailImages, ...newDetailUrls];

      // features를 줄바꿈으로 분리하여 배열로 변환
      const featuresText = formData.get('features') as string;
      const features = featuresText
        ? featuresText.split('\n').map(f => f.trim()).filter(f => f.length > 0)
        : [];

      const courseData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        price: parseInt(formData.get('price') as string) || 0,
        duration: formData.get('duration') as string,
        thumbnail: thumbnailUrl,
        instructor: formData.get('instructor') as string || '전문 상담사',
        features,
        detail_images: allDetailImages,
        video_url: (formData.get('video_url') as string) || null,
        is_active: formData.get('is_active') === 'on'
      };

      if (isEditing && selectedCourse) {
        const result = await updateCourse(selectedCourse.id, courseData);
        if (result.success) {
          // DB에서 새로 로드하여 최신 데이터 반영
          await loadCourses();
          setShowModal(false);
          resetImageStates();
          setMessage({ type: 'success', text: '프로그램이 수정되었습니다.' });
        } else {
          setMessage({ type: 'error', text: result.error || '수정에 실패했습니다.' });
        }
      } else {
        const result = await createCourse(courseData);
        if (result.success && result.data) {
          // DB에서 새로 로드하여 최신 데이터 반영
          await loadCourses();
          setShowModal(false);
          resetImageStates();
          setMessage({ type: 'success', text: '프로그램이 등록되었습니다.' });
        } else {
          setMessage({ type: 'error', text: result.error || '등록에 실패했습니다.' });
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage({ type: 'error', text: '오류가 발생했습니다.' });
    }

    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;

    setActionLoading(true);
    const result = await deleteCourse(selectedCourse.id);
    if (result.success) {
      setCourses((prev) => prev.filter((c) => c.id !== selectedCourse.id));
      setShowDeleteModal(false);
      setMessage({ type: 'success', text: '프로그램이 삭제되었습니다.' });
    } else {
      setMessage({ type: 'error', text: result.error || '삭제에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const handleToggleActive = async (course: Course) => {
    setActionLoading(true);
    const result = await updateCourse(course.id, { is_active: !course.is_active });
    if (result.success) {
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, is_active: !c.is_active } : c))
      );
      setMessage({ type: 'success', text: `프로그램이 ${course.is_active ? '비활성화' : '활성화'}되었습니다.` });
    } else {
      setMessage({ type: 'error', text: result.error || '상태 변경에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const openCreateModal = () => {
    setSelectedCourse(null);
    setIsEditing(false);
    resetImageStates();
    setShowModal(true);
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setIsEditing(true);
    // 기존 이미지 설정
    setThumbnailPreview(course.thumbnail || '');
    setExistingDetailImages(course.detail_images || []);
    setThumbnailFile(null);
    setDetailFiles([]);
    setDetailPreviews([]);
    setShowModal(true);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">교육 프로그램 관리</h1>
          <p className="text-gray-500">교육 프로그램을 등록하고 관리합니다</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          프로그램 등록
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="프로그램명으로 검색..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">전체 카테고리</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                course.is_active ? 'border-gray-100' : 'border-red-200 bg-red-50/50'
              }`}
            >
              {/* Thumbnail */}
              {course.thumbnail ? (
                <div className="h-40 bg-gray-200">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/50" />
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                  {!course.is_active && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                      비활성
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {course.description || '설명 없음'}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
                    <Tag className="w-3 h-3" />
                    {getCategoryName(course.category)}
                  </span>
                  {course.duration && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                    <DollarSign className="w-3 h-3" />
                    {formatPrice(course.price)}원
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(course)}
                    disabled={actionLoading}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      course.is_active
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {course.is_active ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        비활성화
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        활성화
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => openEditModal(course)}
                    className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            {searchQuery || filterCategory !== 'all'
              ? '검색 결과가 없습니다'
              : '등록된 프로그램이 없습니다'}
          </div>
        )}
      </div>

      {/* Total Count */}
      <p className="text-sm text-gray-500 text-center">
        총 {filteredCourses.length}개의 프로그램
      </p>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? '프로그램 수정' : '프로그램 등록'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    프로그램명 *
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedCourse?.title || ''}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="프로그램명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    설명
                  </label>
                  <textarea
                    name="description"
                    defaultValue={selectedCourse?.description || ''}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="프로그램 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    카테고리 *
                  </label>
                  <select
                    name="category"
                    defaultValue={selectedCourse?.category || ''}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      가격 (원)
                    </label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={selectedCourse?.price || 0}
                      min="0"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      교육 시간
                    </label>
                    <input
                      type="text"
                      name="duration"
                      defaultValue={selectedCourse?.duration || ''}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="예: 2시간"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    강사명
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    defaultValue={selectedCourse?.instructor || '전문 상담사'}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="전문 상담사"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    교육 영상 URL
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    defaultValue={selectedCourse?.video_url || ''}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/video.mp4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    온라인 학습용 영상 URL을 입력하세요 (MP4 권장)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    썸네일 이미지
                  </label>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors overflow-hidden"
                  >
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="썸네일 미리보기"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">클릭하여 썸네일 업로드</span>
                        <span className="text-xs text-gray-400 mt-1">권장: 800x600px</span>
                      </>
                    )}
                  </div>
                  {thumbnailPreview && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThumbnailFile(null);
                        setThumbnailPreview('');
                      }}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      썸네일 삭제
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    포함 항목 (줄바꿈으로 구분)
                  </label>
                  <textarea
                    name="features"
                    defaultValue={selectedCourse?.features?.join('\n') || ''}
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="재범방지교육 수료증&#10;인지행동개선훈련 교육 수료증&#10;준법의식교육 수료증"
                  />
                  <p className="text-xs text-gray-400 mt-1">한 줄에 하나씩 입력하세요</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    상세 이미지
                  </label>
                  <input
                    ref={detailInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDetailFilesChange}
                    className="hidden"
                  />

                  {/* 기존 상세 이미지 */}
                  {existingDetailImages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">기존 이미지</p>
                      <div className="grid grid-cols-3 gap-2">
                        {existingDetailImages.map((url, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <img
                              src={url}
                              alt={`기존 이미지 ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingDetailImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 새로 추가할 이미지 미리보기 */}
                  {detailPreviews.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">새 이미지</p>
                      <div className="grid grid-cols-3 gap-2">
                        {detailPreviews.map((preview, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <img
                              src={preview}
                              alt={`새 이미지 ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewDetailImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => detailInputRef.current?.click()}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    <ImageIcon className="w-5 h-5" />
                    상세 이미지 추가
                  </button>
                  <p className="text-xs text-gray-400 mt-1">상세페이지 과정 특징 아래에 표시됩니다</p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    defaultChecked={selectedCourse?.is_active ?? true}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">
                    프로그램 활성화 (비활성화 시 사용자에게 표시되지 않음)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? '저장 중...' : isEditing ? '수정' : '등록'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedCourse && (
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">프로그램 삭제</h2>
                <p className="text-gray-500 mb-6">
                  <strong>{selectedCourse.title}</strong> 프로그램을 정말 삭제하시겠습니까?<br />
                  관련된 수강 신청도 함께 삭제됩니다.
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
