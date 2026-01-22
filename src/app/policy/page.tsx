import { Metadata } from 'next';
import { Shield, Clock, CreditCard, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '서비스 정책 - KRPIC 재범방지교육통합센터',
  description: 'KRPIC 재범방지교육통합센터의 서비스 정책, 환불 규정을 안내합니다.',
};

export default function PolicyPage() {
  return (
    <div className="section-padding bg-primary-50 min-h-screen">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              서비스 정책
            </h1>
            <p className="text-primary-600">
              KRPIC 재범방지교육통합센터의 서비스 이용 정책을 안내합니다
            </p>
          </div>

          {/* Refund Policy */}
          <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-accent-600" />
              </div>
              <h2 className="text-xl font-bold text-primary-900">환불 정책</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-primary-900 mb-2">
                  1. 수강 시작 전 환불
                </h3>
                <p className="text-primary-600">
                  결제일로부터 7일 이내이고 수강을 시작하지 않은 경우, 전액 환불이 가능합니다.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-primary-900 mb-2">
                  2. 수강 시작 후 환불
                </h3>
                <div className="bg-primary-50 rounded-lg p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-primary-500">
                        <th className="pb-2">수강 진도율</th>
                        <th className="pb-2">환불 비율</th>
                      </tr>
                    </thead>
                    <tbody className="text-primary-700">
                      <tr>
                        <td className="py-2">10% 미만</td>
                        <td className="py-2">90% 환불</td>
                      </tr>
                      <tr>
                        <td className="py-2">10% 이상 ~ 30% 미만</td>
                        <td className="py-2">70% 환불</td>
                      </tr>
                      <tr>
                        <td className="py-2">30% 이상 ~ 50% 미만</td>
                        <td className="py-2">50% 환불</td>
                      </tr>
                      <tr>
                        <td className="py-2">50% 이상</td>
                        <td className="py-2">환불 불가</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-primary-900 mb-2">
                  3. 환불 신청 방법
                </h3>
                <p className="text-primary-600">
                  고객센터(1544-0000) 또는 이메일(support@krpic.co.kr)로 환불을 신청하시면
                  영업일 기준 3~5일 이내에 처리됩니다.
                </p>
              </div>
            </div>
          </section>

          {/* Service Period */}
          <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary-600" />
              </div>
              <h2 className="text-xl font-bold text-primary-900">서비스 제공 기간</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-primary-900 mb-2">수강 기간</h3>
                <p className="text-primary-600">
                  모든 교육과정은 결제일로부터 <strong>30일</strong> 동안 수강이 가능합니다.
                  해당 기간 내에 원하는 시간에 자유롭게 학습할 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-primary-900 mb-2">수강 기간 연장</h3>
                <p className="text-primary-600">
                  부득이한 사유로 기간 내 수료가 어려운 경우, 고객센터로 문의하시면
                  1회에 한해 7일 연장이 가능합니다. (수수료 없음)
                </p>
              </div>

              <div>
                <h3 className="font-medium text-primary-900 mb-2">수료증 발급</h3>
                <p className="text-primary-600">
                  교육 이수 후 수료증은 마이페이지에서 언제든지 다운로드하거나
                  재발급 받으실 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* Terms of Service */}
          <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-primary-900">이용약관 요약</h2>
            </div>

            <div className="space-y-4 text-primary-600">
              <p>
                1. 본 서비스는 법원, 검찰 등 사법기관에서 인정하는 공인 재범방지교육
                프로그램을 제공합니다.
              </p>
              <p>
                2. 수강생은 교육 내용을 성실히 이수해야 하며, 부정한 방법으로
                수료증을 취득할 경우 수료가 취소될 수 있습니다.
              </p>
              <p>
                3. 교육 콘텐츠의 저작권은 KRPIC에 있으며, 무단 복제 및 배포를 금지합니다.
              </p>
              <p>
                4. 수강생의 개인정보는 관련 법률에 따라 안전하게 보호됩니다.
              </p>
            </div>
          </section>

          {/* Notice */}
          <div className="bg-accent-50 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-accent-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-primary-900 mb-1">안내사항</h3>
              <p className="text-sm text-primary-600">
                본 정책은 2024년 1월 1일부터 시행됩니다. 정책 변경 시 홈페이지
                공지사항을 통해 안내드립니다. 자세한 문의는 고객센터(1544-0000)로
                연락해 주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
