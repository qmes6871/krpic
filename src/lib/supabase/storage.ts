'use client';

import { createClient } from './client';

const BUCKET_NAME = 'course-images';

export async function uploadImage(file: File, folder: string = 'thumbnails'): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();

  // 파일명 생성 (timestamp + 랜덤 문자열 + 확장자)
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return { url: null, error: error.message };
  }

  // Public URL 가져오기
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return { url: publicUrl, error: null };
}

export async function uploadMultipleImages(files: File[], folder: string = 'details'): Promise<{ urls: string[]; errors: string[] }> {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  const results = await Promise.all(uploadPromises);

  const urls: string[] = [];
  const errors: string[] = [];

  results.forEach(result => {
    if (result.url) {
      urls.push(result.url);
    }
    if (result.error) {
      errors.push(result.error);
    }
  });

  return { urls, errors };
}

export async function deleteImage(url: string): Promise<boolean> {
  const supabase = createClient();

  // URL에서 파일 경로 추출
  const urlParts = url.split(`${BUCKET_NAME}/`);
  if (urlParts.length < 2) return false;

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    return false;
  }

  return true;
}
