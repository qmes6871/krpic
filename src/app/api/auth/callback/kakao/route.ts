import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
  error?: string;
  error_description?: string;
}

interface KakaoUserResponse {
  id: number;
  connected_at: string;
  properties?: {
    nickname?: string;
  };
  kakao_account?: {
    email?: string;
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    profile_nickname_needs_agreement?: boolean;
    profile?: {
      nickname?: string;
    };
    name_needs_agreement?: boolean;
    name?: string;
    phone_number_needs_agreement?: boolean;
    phone_number?: string;
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://krpic.co.kr';

  if (error) {
    console.error('Kakao OAuth error:', error);
    return NextResponse.redirect(`${siteUrl}/login?error=kakao_auth_failed`);
  }

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/login?error=no_code`);
  }

  try {
    // 1. Exchange code for access token
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY!,
      redirect_uri: `${siteUrl}/api/auth/callback/kakao`,
      code: code,
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: tokenParams.toString(),
    });

    const tokenData: KakaoTokenResponse = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token error:', tokenData.error_description);
      return NextResponse.redirect(`${siteUrl}/login?error=token_failed`);
    }

    // 2. Get user info from Kakao
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const userData: KakaoUserResponse = await userResponse.json();

    if (!userData.id) {
      console.error('User info error: No user ID');
      return NextResponse.redirect(`${siteUrl}/login?error=user_info_failed`);
    }

    const kakaoId = userData.id.toString();
    const email = userData.kakao_account?.email || `kakao_${kakaoId}@kakao.local`;
    const name = userData.kakao_account?.name ||
                 userData.kakao_account?.profile?.nickname ||
                 userData.properties?.nickname ||
                 '카카오 사용자';
    const phone = userData.kakao_account?.phone_number?.replace(/[^0-9]/g, '') || '';

    // 3. Check if user exists in Supabase
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email === email || u.user_metadata?.kakao_id === kakaoId
    );

    let userId: string;

    if (existingUser) {
      // User exists, update metadata if needed
      userId = existingUser.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...existingUser.user_metadata,
          kakao_id: kakaoId,
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
          kakao_id: kakaoId,
          name: name,
          phone: phone,
          provider: 'kakao',
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
    console.error('Kakao OAuth callback error:', err);
    return NextResponse.redirect(`${siteUrl}/login?error=unknown`);
  }
}
