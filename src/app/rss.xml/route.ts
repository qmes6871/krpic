import { createClient } from '@/lib/supabase/server';

// XML 특수문자 이스케이프
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const supabase = await createClient();

  // 교육 과정 조회
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, description, category, price, created_at, updated_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(50);

  const siteUrl = 'https://krpic.co.kr';

  const rssItems = (courses || []).map(course => {
    const pubDate = new Date(course.updated_at || course.created_at).toUTCString();
    const description = course.description
      ? course.description.replace(/<[^>]*>/g, '').trim()
      : '재범방지교육 프로그램';
    const itemUrl = `${siteUrl}/education/${course.category}/${course.id}`;

    return `  <item>
    <title>${escapeXml(course.title)}</title>
    <link>${itemUrl}</link>
    <description>${escapeXml(description)}</description>
    <pubDate>${pubDate}</pubDate>
    <guid>${itemUrl}</guid>
  </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>KRPIC 재범방지교육통합센터</title>
    <link>${siteUrl}/</link>
    <description>법원 검찰 인정 재범방지교육 프로그램</description>
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
