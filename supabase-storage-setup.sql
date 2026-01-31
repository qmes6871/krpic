-- KRPIC 이미지 업로드를 위한 Supabase Storage 설정
-- Supabase 대시보드 > SQL Editor에서 실행하세요

-- 1. Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-images',
  'course-images',
  true,
  5242880, -- 5MB 제한
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 2. 모든 사용자가 이미지를 볼 수 있도록 설정 (Public Read)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-images');

-- 3. 인증된 사용자(관리자)만 업로드 가능
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-images');

-- 4. 인증된 사용자(관리자)만 삭제 가능
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-images');

-- 5. 인증된 사용자(관리자)만 수정 가능
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-images');
