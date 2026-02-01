import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

interface NaverTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

interface NaverUserResponse {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email?: string;
    name?: string;
    nickname?: string;
    mobile?: string;
    mobile_e164?: string;
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://krpic.co.kr';

  if (error) {
    console.error('Naver OAuth error:', error);
    return NextResponse.redirect(`${siteUrl}/login?error=naver_auth_failed`);
  }

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/login?error=no_code`);
  }

  try {
    // 1. Exchange code for access token
    const tokenUrl = 'https://nid.naver.com/oauth2.0/token';
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NAVER_CLIENT_ID!,
      client_secret: process.env.NAVER_CLIENT_SECRET!,
      code: code,
      state: state || '',
    });

    const tokenResponse = await fetch(`${tokenUrl}?${tokenParams.toString()}`, {
      method: 'GET',
    });

    const tokenData: NaverTokenResponse = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token error:', tokenData.error_description);
      return NextResponse.redirect(`${siteUrl}/login?error=token_failed`);
    }

    // 2. Get user info from Naver
    const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData: NaverUserResponse = await userResponse.json();

    if (userData.resultcode !== '00') {
      console.error('User info error:', userData.message);
      return NextResponse.redirect(`${siteUrl}/login?error=user_info_failed`);
    }

    const naverUser = userData.response;
    const email = naverUser.email || `naver_${naverUser.id}@naver.local`;
    const name = naverUser.name || naverUser.nickname || '네이버 사용자';
    const phone = naverUser.mobile?.replace(/-/g, '') || '';

    // 3. Check if user exists in Supabase
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email === email || u.user_metadata?.naver_id === naverUser.id
    );

    let userId: string;

    if (existingUser) {
      // User exists, update metadata if needed
      userId = existingUser.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...existingUser.user_metadata,
          naver_id: naverUser.id,
          name: name,
          phone: phone || existingUser.user_metadata?.phone,
        },
      });
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: {
          naver_id: naverUser.id,
          name: name,
          phone: phone,
          provider: 'naver',
        },
      });

      if (createError) {
        console.error('Create user error:', createError);
        return NextResponse.redirect(`${siteUrl}/login?error=create_user_failed`);
      }

      userId = newUser.user.id;
    }

    // 4. Generate session using magic link internally
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (linkError || !linkData.properties.hashed_token) {
      console.error('Magic link error:', linkError);
      return NextResponse.redirect(`${siteUrl}/login?error=session_failed`);
    }

    // Create SSR client with cookie handling
    const cookieStore = await cookies();
    const supabaseSSR = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    });

    // Verify the OTP to get session (this will set cookies automatically)
    const { error: sessionError } = await supabaseSSR.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: 'magiclink',
    });

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.redirect(`${siteUrl}/login?error=session_failed`);
    }

    // Redirect to my-courses page
    return NextResponse.redirect(`${siteUrl}/my-courses`);
  } catch (err) {
    console.error('Naver OAuth callback error:', err);
    return NextResponse.redirect(`${siteUrl}/login?error=unknown`);
  }
}
