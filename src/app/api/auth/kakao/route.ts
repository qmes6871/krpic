import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.KAKAO_REST_API_KEY;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://krpic.co.kr'}/api/auth/callback/kakao`;

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return NextResponse.redirect(kakaoAuthUrl);
}
