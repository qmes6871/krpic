'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  FileText,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  Send,
  Eye,
  XCircle,
} from 'lucide-react';
import {
  getUploadedCertificates,
  deleteCertificateFile,
  getEnrollmentCertificateConfig,
  getIssuedCertificates,
  issueCertificate,
  revokeCertificate,
  previewCertificateForAdmin,
  UploadedCertificates,
  IssuedCertificates,
} from '@/lib/admin/actions';
import { allCertificates, CertificateTemplate, getCertificatesForCourse } from '@/data/certificateTemplates';

// 수료증 ID 목록 (자동 발급 - 수료 시 즉시 다운로드 가능)
const COMPLETION_CERTIFICATE_IDS = [
  'recidivism-prevention-completion',
  'cbt-completion',
  'law-compliance-completion',
  'drunk-driving-completion',
  'violence-completion',
  'property-completion',
  'sexual-completion',
  'gambling-completion',
  'drugs-completion',
  'digital-completion',
];

// 발급 처리가 필요한 증명서 ID 목록 (관리자가 발급처리해야 수강생이 다운로드 가능)
const ISSUABLE_CERTIFICATE_IDS = [
  // === 공통 증명서 ===
  'risk-assessment',
  'center-education',
  'center-opinion',
  'petition',
  'risk-management-diary',
  'change-report',
  'counselor-petition',
  'counseling-reflection',
  'completion-reflections',
  'detailed-course-certificate',
  'life-plan',

  // === 카테고리별 교육내용 증명서 ===
  'drunk-driving-certificate',
  'violence-certificate',
  'property-certificate',
  'sexual-certificate',
  'gambling-certificate',
  'drugs-certificate',
  'digital-certificate',
  'law-compliance-certificate',
  'cbt-certificate',
];

interface Props {
  enrollmentId: string;
  studentName: string;
  onClose: () => void;
}

export default function CertificateUploadModal({ enrollmentId, studentName, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedCerts, setUploadedCerts] = useState<UploadedCertificates>({});
  const [issuedCerts, setIssuedCerts] = useState<IssuedCertificates>({});
  const [certificates, setCertificates] = useState<CertificateTemplate[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [issuingId, setIssuingId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);

  // 수료증인지 확인 (자동 발급)
  const isCompletionCert = (certId: string) => COMPLETION_CERTIFICATE_IDS.includes(certId);

  // 발급 처리가 필요한 증명서인지 확인
  const isIssuableCert = (certId: string) => ISSUABLE_CERTIFICATE_IDS.includes(certId);

  useEffect(() => {
    loadCertificates();
  }, [enrollmentId]);

  const loadCertificates = async () => {
    setIsLoading(true);

    // 코스 증명서 설정, 업로드된 증명서, 발급된 증명서 동시 조회
    const [configResult, uploadedResult, issuedResult] = await Promise.all([
      getEnrollmentCertificateConfig(enrollmentId),
      getUploadedCertificates(enrollmentId),
      getIssuedCertificates(enrollmentId),
    ]);

    // 코스에 설정된 증명서 목록으로 필터링 (가이드 제외)
    if (configResult.success && configResult.data) {
      const { courseCertificates, courseCategory } = configResult.data;
      const courseCerts = getCertificatesForCourse(
        courseCertificates.length > 0 ? courseCertificates : null,
        courseCategory
      ).filter(cert => !cert.isGuide);
      setCertificates(courseCerts);
    } else {
      // 실패 시 기본 전체 목록 (가이드 제외)
      setCertificates(allCertificates.filter(cert => !cert.isGuide));
    }

    if (uploadedResult.success && uploadedResult.data) {
      setUploadedCerts(uploadedResult.data);
    }

    if (issuedResult.success && issuedResult.data) {
      setIssuedCerts(issuedResult.data);
    }

    setIsLoading(false);
  };

  const handleUploadClick = (certId: string) => {
    setSelectedCertId(certId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCertId) return;

    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'PDF 파일만 업로드 가능합니다.' });
      return;
    }

    setUploadingId(selectedCertId);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('enrollmentId', enrollmentId);
      formData.append('certificateId', selectedCertId);
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-certificate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        setUploadedCerts((prev) => ({
          ...prev,
          [selectedCertId]: result.data,
        }));
        setMessage({ type: 'success', text: '증명서가 업로드되었습니다.' });
      } else {
        setMessage({ type: 'error', text: result.error || '업로드에 실패했습니다.' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: '업로드 중 오류가 발생했습니다.' });
    }

    setUploadingId(null);
    setSelectedCertId(null);
    e.target.value = '';
  };

  const handleDelete = async (certId: string) => {
    if (!confirm('이 증명서를 삭제하시겠습니까?')) return;

    setDeletingId(certId);
    setMessage(null);

    const result = await deleteCertificateFile(enrollmentId, certId);

    if (result.success) {
      setUploadedCerts((prev) => {
        const { [certId]: removed, ...rest } = prev;
        return rest;
      });
      setMessage({ type: 'success', text: '증명서가 삭제되었습니다.' });
    } else {
      setMessage({ type: 'error', text: result.error || '삭제에 실패했습니다.' });
    }

    setDeletingId(null);
  };

  const handleIssue = async (certId: string) => {
    setIssuingId(certId);
    setMessage(null);

    const result = await issueCertificate(enrollmentId, certId);

    if (result.success) {
      setIssuedCerts((prev) => ({
        ...prev,
        [certId]: { issuedAt: new Date().toISOString() },
      }));
      setMessage({ type: 'success', text: '증명서가 발급되었습니다.' });
    } else {
      setMessage({ type: 'error', text: result.error || '발급에 실패했습니다.' });
    }

    setIssuingId(null);
  };

  const handleRevoke = async (certId: string) => {
    if (!confirm('발급을 취소하시겠습니까? 수강생이 더 이상 다운로드할 수 없게 됩니다.')) return;

    setRevokingId(certId);
    setMessage(null);

    const result = await revokeCertificate(enrollmentId, certId);

    if (result.success) {
      setIssuedCerts((prev) => {
        const { [certId]: removed, ...rest } = prev;
        return rest;
      });
      setMessage({ type: 'success', text: '증명서 발급이 취소되었습니다.' });
    } else {
      setMessage({ type: 'error', text: result.error || '발급 취소에 실패했습니다.' });
    }

    setRevokingId(null);
  };

  const handlePreview = async (certId: string) => {
    setPreviewingId(certId);
    setMessage(null);

    const result = await previewCertificateForAdmin(enrollmentId, certId);

    if (result.success && result.pdfBase64) {
      // base64를 blob으로 변환하여 새 탭에서 열기
      const byteCharacters = atob(result.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      setMessage({ type: 'error', text: result.error || '미리보기 생성에 실패했습니다.' });
    }

    setPreviewingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Auto-hide message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 통계 계산
  const completionCount = certificates.filter(c => isCompletionCert(c.id)).length;
  const issuedCount = Object.keys(issuedCerts).length;
  const uploadedCount = Object.keys(uploadedCerts).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">증명서 관리</h2>
            <p className="text-sm text-gray-500">{studentName}님의 증명서</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mx-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => {
                const uploaded = uploadedCerts[cert.id];
                const issued = issuedCerts[cert.id];
                const isUploading = uploadingId === cert.id;
                const isDeleting = deletingId === cert.id;
                const isIssuing = issuingId === cert.id;
                const isRevoking = revokingId === cert.id;
                const isPreviewing = previewingId === cert.id;
                const isCompletion = isCompletionCert(cert.id);
                const isIssuable = isIssuableCert(cert.id);

                // 배경색 결정
                let bgClass = 'bg-gray-50 border-gray-200';
                if (uploaded) {
                  bgClass = 'bg-green-50 border-green-200';
                } else if (isCompletion) {
                  bgClass = 'bg-blue-50 border-blue-200';
                } else if (issued) {
                  bgClass = 'bg-emerald-50 border-emerald-200';
                } else if (isIssuable) {
                  bgClass = 'bg-amber-50 border-amber-200';
                }

                return (
                  <div
                    key={cert.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${bgClass}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          uploaded
                            ? 'bg-green-100'
                            : isCompletion
                            ? 'bg-blue-100'
                            : issued
                            ? 'bg-emerald-100'
                            : isIssuable
                            ? 'bg-amber-100'
                            : 'bg-gray-200'
                        }`}
                      >
                        <FileText
                          className={`w-5 h-5 ${
                            uploaded
                              ? 'text-green-600'
                              : isCompletion
                              ? 'text-blue-600'
                              : issued
                              ? 'text-emerald-600'
                              : isIssuable
                              ? 'text-amber-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{cert.name}</p>
                        {uploaded ? (
                          <p className="text-xs text-green-600">
                            {formatDate(uploaded.uploadedAt)} 업로드됨
                          </p>
                        ) : isCompletion ? (
                          <p className="text-xs text-blue-600">수료증 (자동 발급)</p>
                        ) : issued ? (
                          <p className="text-xs text-emerald-600">
                            {formatDate(issued.issuedAt)} 발급됨
                          </p>
                        ) : isIssuable ? (
                          <p className="text-xs text-amber-600">발급 대기중</p>
                        ) : (
                          <p className="text-xs text-gray-500">업로드 대기중</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {uploaded ? (
                        <>
                          <a
                            href={uploaded.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            title="미리보기"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleUploadClick(cert.id)}
                            disabled={isUploading}
                            className="p-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
                            title="재업로드"
                          >
                            {isUploading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(cert.id)}
                            disabled={isDeleting}
                            className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="삭제"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </>
                      ) : isCompletion ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreview(cert.id)}
                            disabled={isPreviewing}
                            className="p-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                            title="문서보기"
                          >
                            {isPreviewing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                            자동 발급
                          </span>
                        </div>
                      ) : isIssuable ? (
                        issued ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePreview(cert.id)}
                              disabled={isPreviewing}
                              className="p-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50"
                              title="문서보기"
                            >
                              {isPreviewing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRevoke(cert.id)}
                              disabled={isRevoking}
                              className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                              title="발급취소"
                            >
                              {isRevoking ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </button>
                            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg">
                              발급됨
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePreview(cert.id)}
                              disabled={isPreviewing}
                              className="p-2 bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50"
                              title="미리보기"
                            >
                              {isPreviewing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleIssue(cert.id)}
                              disabled={isIssuing}
                              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                            >
                              {isIssuing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                              발급처리
                            </button>
                          </div>
                        )
                      ) : (
                        <button
                          onClick={() => handleUploadClick(cert.id)}
                          disabled={isUploading}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                          {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          업로드
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              수료증 {completionCount}개 (자동) | 발급됨 {issuedCount}개 | 업로드됨 {uploadedCount}개
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
