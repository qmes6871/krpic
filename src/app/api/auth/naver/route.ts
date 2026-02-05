import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.NAVER_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/naver`;

  // redirect 파라미터가 있으면 state에 포함
  const redirectTo = request.nextUrl.searchParams.get('redirect');
  const stateData = {
    nonce: Math.random().toString(36).substring(2, 15),
    redirect: redirectTo || '',
  };
  const state = Buffer.from(JSON.stringify(stateData)).toString('base64');

  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(naverAuthUrl);
}
