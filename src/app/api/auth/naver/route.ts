import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.NAVER_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/naver`;
  const state = Math.random().toString(36).substring(2, 15);

  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

  return NextResponse.redirect(naverAuthUrl);
}
