import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// User-Agent 파싱
function parseUserAgent(ua: string) {
  let browser = 'Unknown';
  let os = 'Unknown';
  let deviceType = 'desktop';

  // Browser detection
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung Browser';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('MSIE') || ua.includes('Trident')) browser = 'IE';

  // OS detection
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  // Device type detection
  if (ua.includes('Mobile') || ua.includes('Android')) deviceType = 'mobile';
  else if (ua.includes('Tablet') || ua.includes('iPad')) deviceType = 'tablet';

  return { browser, os, deviceType };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer, sessionId, userId } = body;

    // Get IP and User-Agent from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    const { browser, os, deviceType } = parseUserAgent(userAgent);

    // Insert page view
    const { error } = await supabase.from('page_views').insert({
      path,
      referrer: referrer || null,
      user_agent: userAgent,
      ip_address: ip,
      device_type: deviceType,
      browser,
      os,
      session_id: sessionId,
      user_id: userId || null,
    });

    if (error) {
      console.error('Failed to track page view:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
