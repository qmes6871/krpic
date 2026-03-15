import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const filename = searchParams.get('filename');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // 파일 fetch
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
    }

    const blob = await response.blob();
    const headers = new Headers();

    // Content-Type 설정
    headers.set('Content-Type', blob.type || 'application/octet-stream');

    // 다운로드를 위한 Content-Disposition 헤더
    const safeFilename = filename || 'download';
    headers.set(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(safeFilename)}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`
    );

    headers.set('Content-Length', blob.size.toString());

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
