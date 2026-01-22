import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 센터 정보 */}
          <div>
            <h3 className="text-lg font-bold mb-4">KRPIC 재범방지교육통합센터</h3>
            <p className="text-primary-200 text-sm leading-relaxed">
              법원, 검찰 인정 공인 재범방지교육 전문기관으로서
              수강생의 성공적인 사회 복귀를 지원합니다.
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-lg font-bold mb-4">빠른 링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/education" className="text-primary-200 hover:text-white">
                  재범방지교육
                </Link>
              </li>
              <li>
                <Link href="/detention-education" className="text-primary-200 hover:text-white">
                  구속 수감자 교육
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-200 hover:text-white">
                  통합센터 안내
                </Link>
              </li>
              <li>
                <Link href="/notice" className="text-primary-200 hover:text-white">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/policy" className="text-primary-200 hover:text-white">
                  서비스 정책
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객센터 */}
          <div>
            <h3 className="text-lg font-bold mb-4">고객센터</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-accent-400" />
                <span className="text-primary-200">1544-0000</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-accent-400" />
                <span className="text-primary-200">support@krpic.co.kr</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-accent-400 mt-0.5" />
                <span className="text-primary-200">
                  서울특별시 강남구 테헤란로 123
                </span>
              </li>
            </ul>
            <p className="text-primary-300 text-xs mt-3">
              상담시간: 평일 09:00 ~ 18:00
            </p>
          </div>

          {/* 사업자 정보 */}
          <div>
            <h3 className="text-lg font-bold mb-4">사업자 정보</h3>
            <ul className="space-y-1 text-xs text-primary-300">
              <li>상호명: (주)재범방지교육통합센터</li>
              <li>대표자: 홍길동</li>
              <li>사업자등록번호: 123-45-67890</li>
              <li>통신판매업신고: 제2024-서울강남-0000호</li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 */}
        <div className="border-t border-primary-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-300 text-sm">
              © 2024 KRPIC. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/policy" className="text-primary-300 hover:text-white">
                이용약관
              </Link>
              <Link href="/policy" className="text-primary-300 hover:text-white">
                개인정보처리방침
              </Link>
              <Link href="/policy" className="text-primary-300 hover:text-white">
                환불정책
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
