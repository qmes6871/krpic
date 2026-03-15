-- 공지사항 첨부파일을 위한 Supabase 설정
-- Supabase 대시보드 > SQL Editor에서 실행하세요

-- 1. notices 테이블에 attachments 컬럼 추가 (JSONB 타입)
ALTER TABLE notices
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- 2. Storage 버킷 생성 (notice-attachments)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'notice-attachments',
  'notice-attachments',
  true,
  10485760, -- 10MB 제한
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-rar-compressed',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-rar-compressed',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain'
  ];

-- 3. 모든 사용자가 파일을 볼 수 있도록 설정 (Public Read)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND policyname = 'Notice attachments public access'
  ) THEN
    CREATE POLICY "Notice attachments public access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'notice-attachments');
  END IF;
END $$;

-- 4. 인증된 사용자(관리자)만 업로드 가능
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND policyname = 'Notice attachments authenticated upload'
  ) THEN
    CREATE POLICY "Notice attachments authenticated upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'notice-attachments');
  END IF;
END $$;

-- 5. 인증된 사용자(관리자)만 삭제 가능
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND policyname = 'Notice attachments authenticated delete'
  ) THEN
    CREATE POLICY "Notice attachments authenticated delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'notice-attachments');
  END IF;
END $$;

-- 완료 메시지
SELECT '공지사항 첨부파일 설정이 완료되었습니다.' as message;
