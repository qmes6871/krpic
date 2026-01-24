import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-custom py-10">
        <div className="text-center space-y-3">
          <Link href="/" className="text-lg font-bold hover:text-accent-400 transition-colors">
            재범방지교육통합센터
          </Link>

          <div className="text-primary-300 text-sm space-y-1">
            <p>대표자 | 김지순</p>
            <p>사업자등록번호 | 213-14-16968</p>
            <p>주소 | 경기도 고양시 일산서구 고양대로 620</p>
            <p>통신판매업 | 2025-고양일산서-1196</p>
          </div>

          <div className="pt-4">
            <Link
              href="/policy"
              className="text-accent-400 hover:text-accent-300 text-sm font-medium"
            >
              서비스 제공 기간 & 환불 정책 안내
            </Link>
          </div>

          <p className="text-primary-400 text-sm pt-4">
            ©2021. 재범방지교육통합센터. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
