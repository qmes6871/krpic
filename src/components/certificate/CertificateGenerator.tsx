'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { X, Download, Loader2 } from 'lucide-react';
import { getCertificateData } from '@/lib/enrollments/actions';

interface Props {
  enrollmentId: string;
  onClose: () => void;
}

// 카테고리명 매핑
const categoryNames: Record<string, string> = {
  'drunk-driving': '음주운전 재범방지 교육',
  'drug': '마약류 재범방지 교육',
  'violence': '폭력 재범방지 교육',
  'theft': '절도 재범방지 교육',
  'fraud': '사기 재범방지 교육',
  'sexual-offense': '성범죄 재범방지 교육',
  'juvenile': '소년범 재범방지 교육',
  'detention': '구속 수감자 교육',
};

export default function CertificateGenerator({ enrollmentId, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [certificateData, setCertificateData] = useState<{
    userName: string;
    courseName: string;
    completionDate: string;
    certificateNumber: string;
    category: string;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getCertificateData(enrollmentId);

      if (result.success && result.data) {
        setCertificateData(result.data);
      } else {
        setError(result.error || '수료증 정보를 불러올 수 없습니다.');
      }
      setIsLoading(false);
    };

    loadData();
  }, [enrollmentId]);

  const generatePDF = async () => {
    if (!certificateData) return;

    setIsGenerating(true);

    try {
      // A4 사이즈 가로 방향 PDF 생성
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // 배경색
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // 테두리
      doc.setDrawColor(30, 58, 138); // 진한 파란색
      doc.setLineWidth(3);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // 내부 테두리
      doc.setDrawColor(59, 130, 246); // 밝은 파란색
      doc.setLineWidth(1);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

      // 상단 장식 라인
      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(0.5);
      doc.line(50, 35, pageWidth - 50, 35);

      // KRPIC 로고 텍스트
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 58, 138);
      doc.text('KRPIC', pageWidth / 2, 28, { align: 'center' });

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Korea Recidivism Prevention Integrated Center', pageWidth / 2, 33, { align: 'center' });

      // 제목: 수료증
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(48);
      doc.setTextColor(30, 58, 138);
      doc.text('CERTIFICATE', pageWidth / 2, 60, { align: 'center' });

      doc.setFontSize(16);
      doc.setTextColor(100, 100, 100);
      doc.text('of Completion', pageWidth / 2, 70, { align: 'center' });

      // 수강자 이름
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(32);
      doc.setTextColor(0, 0, 0);
      doc.text(certificateData.userName, pageWidth / 2, 95, { align: 'center' });

      // 이름 밑 라인
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.line(pageWidth / 2 - 50, 100, pageWidth / 2 + 50, 100);

      // 본문
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text('This is to certify that the above-named person has successfully completed', pageWidth / 2, 115, { align: 'center' });

      // 교육 과정명
      const categoryDisplayName = categoryNames[certificateData.category] || certificateData.category;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(30, 58, 138);
      doc.text(certificateData.courseName, pageWidth / 2, 130, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`(${categoryDisplayName})`, pageWidth / 2, 138, { align: 'center' });

      // 수료 문구
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text('and has met all the requirements for certification.', pageWidth / 2, 152, { align: 'center' });

      // 하단 정보
      const completionDate = new Date(certificateData.completionDate);
      const formattedDate = `${completionDate.getFullYear()}. ${String(completionDate.getMonth() + 1).padStart(2, '0')}. ${String(completionDate.getDate()).padStart(2, '0')}`;

      // 수료일
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Date of Completion', pageWidth / 2 - 50, 170, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(formattedDate, pageWidth / 2 - 50, 178, { align: 'center' });

      // 수료증 번호
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Certificate No.', pageWidth / 2 + 50, 170, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(certificateData.certificateNumber, pageWidth / 2 + 50, 178, { align: 'center' });

      // 하단 장식 라인
      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(0.5);
      doc.line(50, 185, pageWidth - 50, 185);

      // 발급 기관
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.text('KRPIC', pageWidth / 2, 193, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Issued by: Korea Recidivism Prevention Integrated Center', pageWidth / 2, 199, { align: 'center' });

      // 파일명 생성
      const fileName = `KRPIC_Certificate_${certificateData.certificateNumber}.pdf`;

      // PDF 다운로드
      doc.save(fileName);
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('PDF 생성 중 오류가 발생했습니다.');
    }

    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">수료증 다운로드</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">수료증 정보를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              닫기
            </button>
          </div>
        ) : certificateData && (
          <div>
            {/* 수료증 미리보기 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="text-center">
                <p className="text-xs text-blue-600 font-medium mb-2">KRPIC</p>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">수료증</h4>
                <p className="text-sm text-gray-600 mb-4">Certificate of Completion</p>

                <div className="py-4 border-t border-b border-blue-200/50 my-4">
                  <p className="text-2xl font-bold text-gray-900 mb-2">{certificateData.userName}</p>
                  <p className="text-sm text-gray-600">상기인은 아래 교육을 성실히 이수하였음을 증명합니다.</p>
                </div>

                <p className="text-lg font-semibold text-blue-700 mb-4">
                  {certificateData.courseName}
                </p>

                <div className="flex justify-center gap-8 text-sm text-gray-600">
                  <div>
                    <p className="text-xs text-gray-500">수료일</p>
                    <p className="font-medium">
                      {new Date(certificateData.completionDate).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">수료증 번호</p>
                    <p className="font-medium">{certificateData.certificateNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 다운로드 버튼 */}
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  PDF 생성 중...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  수료증 PDF 다운로드
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              수료증은 PDF 파일로 다운로드됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
