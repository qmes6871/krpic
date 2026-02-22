'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Package,
} from 'lucide-react';
import { getAdminCertificateTemplates, generateAdminCertificate, generateBulkCertificates, getCoursesForCertificates } from '@/lib/admin/actions';
import { CertificateTemplate } from '@/data/certificateTemplates';
import JSZip from 'jszip';

interface CourseOption {
  id: string;
  title: string;
  category: string;
  certificates: string[] | null;
}

export default function AdminCertificatesPage() {
  const [studentName, setStudentName] = useState('');
  const [issueDate, setIssueDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [certificatesByCategory, setCertificatesByCategory] = useState<Record<string, CertificateTemplate[]>>({});
  const [allCertificates, setAllCertificates] = useState<CertificateTemplate[]>([]);
  const [selectedCertificates, setSelectedCertificates] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 상품별 발급 관련 상태
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const [activeTab, setActiveTab] = useState<'course' | 'manual'>('course');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesData, coursesData] = await Promise.all([
        getAdminCertificateTemplates(),
        getCoursesForCertificates(),
      ]);

      setCertificatesByCategory(templatesData.byCategory);
      setAllCertificates(templatesData.all);

      if (coursesData.success && coursesData.courses) {
        setCourses(coursesData.courses);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setMessage({ type: 'error', text: '데이터를 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const toggleCertificate = (id: string) => {
    setSelectedCertificates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllInCategory = (category: string) => {
    const categoryIds = certificatesByCategory[category]?.map((c) => c.id) || [];
    const allSelected = categoryIds.every((id) => selectedCertificates.has(id));

    setSelectedCertificates((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        categoryIds.forEach((id) => next.delete(id));
      } else {
        categoryIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const downloadPdf = (base64: string, fileName: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSingleGenerate = async (certificate: CertificateTemplate) => {
    if (!studentName.trim()) {
      setMessage({ type: 'error', text: '수강생 성명을 입력해주세요.' });
      return;
    }

    setGeneratingId(certificate.id);

    try {
      const result = await generateAdminCertificate(certificate.id, studentName, issueDate);
      if (result.success && result.pdfBase64 && result.fileName) {
        downloadPdf(result.pdfBase64, result.fileName);
        setMessage({ type: 'success', text: `${certificate.name} 다운로드 완료` });
      } else {
        setMessage({ type: 'error', text: result.error || 'PDF 생성에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'PDF 생성 중 오류가 발생했습니다.' });
    }

    setGeneratingId(null);
  };

  const handleBulkGenerate = async () => {
    if (!studentName.trim()) {
      setMessage({ type: 'error', text: '수강생 성명을 입력해주세요.' });
      return;
    }

    if (selectedCertificates.size === 0) {
      setMessage({ type: 'error', text: '발급할 증명서를 선택해주세요.' });
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateBulkCertificates(
        Array.from(selectedCertificates),
        studentName,
        issueDate
      );

      if (result.success && result.results && result.results.length > 0) {
        // ZIP 파일 생성
        const zip = new JSZip();

        for (const item of result.results) {
          const byteCharacters = atob(item.pdfBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          zip.file(item.fileName, byteArray);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `재범방지교육통합센터_${studentName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setMessage({ type: 'success', text: `${result.results.length}개의 증명서가 ZIP 파일로 다운로드되었습니다.` });
      } else {
        setMessage({ type: 'error', text: result.error || 'PDF 생성에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'PDF 생성 중 오류가 발생했습니다.' });
    }

    setIsGenerating(false);
  };

  // 상품별 일괄 발급
  const handleCourseGenerate = async () => {
    if (!studentName.trim()) {
      setMessage({ type: 'error', text: '수강생 성명을 입력해주세요.' });
      return;
    }

    if (!selectedCourse) {
      setMessage({ type: 'error', text: '상품을 선택해주세요.' });
      return;
    }

    const course = courses.find(c => c.id === selectedCourse);
    if (!course || !course.certificates || course.certificates.length === 0) {
      setMessage({ type: 'error', text: '선택한 상품에 설정된 증명서가 없습니다.' });
      return;
    }

    setIsGeneratingCourse(true);

    try {
      const result = await generateBulkCertificates(
        course.certificates,
        studentName,
        issueDate
      );

      if (result.success && result.results && result.results.length > 0) {
        // ZIP 파일 생성
        const zip = new JSZip();

        for (const item of result.results) {
          const byteCharacters = atob(item.pdfBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          zip.file(item.fileName, byteArray);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${course.title}_${studentName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setMessage({ type: 'success', text: `${result.results.length}개의 증명서가 다운로드되었습니다. (${course.title})` });
      } else {
        setMessage({ type: 'error', text: result.error || 'PDF 생성에 실패했습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'PDF 생성 중 오류가 발생했습니다.' });
    }

    setIsGeneratingCourse(false);
  };

  // 선택한 상품의 증명서 목록 가져오기
  const getSelectedCourseCertificates = () => {
    if (!selectedCourse) return [];
    const course = courses.find(c => c.id === selectedCourse);
    if (!course || !course.certificates) return [];

    return course.certificates
      .map(certId => allCertificates.find(c => c.id === certId))
      .filter((c): c is CertificateTemplate => c !== undefined);
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
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
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
              message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">증명서 발급</h1>
        <p className="text-gray-500">수강생 정보를 입력하고 상품을 선택하면 자동으로 증명서가 발급됩니다</p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              수강생 성명
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              발급일자
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tab Selection */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('course')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'course'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            상품별 일괄 발급
          </div>
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'manual'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            개별 선택 발급
          </div>
        </button>
      </div>

      {/* 상품별 일괄 발급 */}
      {activeTab === 'course' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">상품 선택</h2>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4" />
                교육 상품
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">상품을 선택하세요</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.certificates?.length || 0}개 증명서)
                  </option>
                ))}
              </select>
            </div>

            {/* 선택한 상품의 증명서 미리보기 */}
            {selectedCourse && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">발급될 증명서 목록:</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {getSelectedCourseCertificates().map((cert) => (
                    <div key={cert.id} className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{cert.name}</span>
                      {cert.id.includes('-completion') && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                          수료증
                        </span>
                      )}
                    </div>
                  ))}
                  {getSelectedCourseCertificates().length === 0 && (
                    <p className="text-sm text-gray-500">설정된 증명서가 없습니다.</p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleCourseGenerate}
              disabled={isGeneratingCourse || !selectedCourse || !studentName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingCourse ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  상품 증명서 일괄 다운로드
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 개별 선택 발급 */}
      {activeTab === 'manual' && (
        <>
          {/* Bulk Generate Button */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {selectedCertificates.size > 0
                  ? `${selectedCertificates.size}개의 증명서가 선택됨`
                  : '증명서를 선택하거나 개별 다운로드 버튼을 클릭하세요'}
              </p>
              <button
                onClick={handleBulkGenerate}
                disabled={isGenerating || selectedCertificates.size === 0 || !studentName.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    선택한 증명서 일괄 다운로드
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Certificate List */}
          <div className="space-y-4">
            {Object.entries(certificatesByCategory).map(([category, certificates]) => {
              const isExpanded = expandedCategories.has(category);
              const categoryIds = certificates.map((c) => c.id);
              const selectedCount = categoryIds.filter((id) => selectedCertificates.has(id)).length;
              const allSelected = selectedCount === categoryIds.length && categoryIds.length > 0;

              return (
                <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Category Header */}
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100 cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center gap-3">
                      <button className="p-1">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      <FolderOpen className="w-5 h-5 text-primary-600" />
                      <span className="font-semibold text-gray-900">{category}</span>
                      <span className="text-sm text-gray-500">({certificates.length}개)</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAllInCategory(category);
                      }}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        allSelected
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {allSelected ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>

                  {/* Certificate Items */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-gray-100">
                          {certificates.map((cert) => (
                            <div
                              key={cert.id}
                              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={selectedCertificates.has(cert.id)}
                                  onChange={() => toggleCertificate(cert.id)}
                                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{cert.name}</p>
                                  <p className="text-sm text-gray-500">{cert.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {cert.id.includes('-completion') && (
                                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                        수료증 (QR코드/직인)
                                      </span>
                                    )}
                                    {cert.isGuide && (
                                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                        가이드 문서
                                      </span>
                                    )}
                                    {cert.isEditable && (
                                      <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                                        편집 가능
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleSingleGenerate(cert)}
                                disabled={generatingId !== null || !studentName.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {generatingId === cert.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                                다운로드
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
