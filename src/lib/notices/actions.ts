'use server';

import { createClient } from '@/lib/supabase/server';
import { Notice, NoticeAttachment } from '@/types';

export interface NoticeInput {
  title: string;
  content: string;
  category: 'notice' | 'update' | 'event' | 'guide';
  important: boolean;
  views?: number;
  createdAt?: string;
  showPopup?: boolean;
  attachments?: NoticeAttachment[];
}

// 공지사항 목록 조회
export async function getNotices(): Promise<Notice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch notices:', error);
    return [];
  }

  return data.map((notice: any) => ({
    id: notice.id,
    title: notice.title,
    content: notice.content,
    date: notice.created_at.split('T')[0],
    important: notice.important,
    category: notice.category,
    views: notice.views || 0,
    showPopup: notice.show_popup || false,
    attachments: notice.attachments || [],
  }));
}

// 공지사항 상세 조회
export async function getNoticeById(id: string): Promise<Notice | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Failed to fetch notice:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    date: data.created_at.split('T')[0],
    important: data.important,
    category: data.category,
    views: data.views || 0,
    showPopup: data.show_popup || false,
    attachments: data.attachments || [],
  };
}

// 조회수 증가
export async function incrementNoticeViews(id: string): Promise<void> {
  const supabase = await createClient();

  await supabase.rpc('increment_notice_views', { notice_id: id });
}

// 공지사항 생성 (관리자용)
export async function createNotice(input: NoticeInput): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  const supabase = await createClient();

  const insertData: Record<string, unknown> = {
    title: input.title,
    content: input.content,
    category: input.category,
    important: input.important,
    show_popup: input.showPopup || false,
    attachments: input.attachments || [],
  };

  if (input.views !== undefined) {
    insertData.views = input.views;
  }
  if (input.createdAt) {
    insertData.created_at = input.createdAt;
  }

  const { data, error } = await supabase
    .from('notices')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    console.error('Failed to create notice:', error);
    return { success: false, error: '공지사항 생성에 실패했습니다.' };
  }

  return { success: true, id: data.id };
}

// 공지사항 수정 (관리자용)
export async function updateNotice(
  id: string,
  input: NoticeInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {
    title: input.title,
    content: input.content,
    category: input.category,
    important: input.important,
    show_popup: input.showPopup || false,
    attachments: input.attachments || [],
    updated_at: new Date().toISOString(),
  };

  if (input.views !== undefined) {
    updateData.views = input.views;
  }
  if (input.createdAt) {
    updateData.created_at = input.createdAt;
  }

  const { error } = await supabase
    .from('notices')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Failed to update notice:', error);
    return { success: false, error: '공지사항 수정에 실패했습니다.' };
  }

  return { success: true };
}

// 공지사항 삭제 (관리자용)
export async function deleteNotice(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notices')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete notice:', error);
    return { success: false, error: '공지사항 삭제에 실패했습니다.' };
  }

  return { success: true };
}

// 공지사항 통계
export async function getNoticeStats(): Promise<{
  total: number;
  important: number;
  thisMonth: number;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notices')
    .select('important, created_at');

  if (error || !data) {
    return { total: 0, important: 0, thisMonth: 0 };
  }

  const now = new Date();
  const thisMonth = data.filter((n: any) => {
    const createdAt = new Date(n.created_at);
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
  }).length;

  return {
    total: data.length,
    important: data.filter((n: any) => n.important).length,
    thisMonth,
  };
}

// 첨부파일 업로드
export async function uploadNoticeAttachment(
  formData: FormData
): Promise<{ success: boolean; attachment?: NoticeAttachment; error?: string }> {
  const supabase = await createClient();

  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: '파일이 없습니다.' };
  }

  // 파일 크기 제한 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: '파일 크기는 10MB 이하여야 합니다.' };
  }

  // 파일명 생성 (timestamp + 랜덤 문자열 + 확장자만 사용 - 한글 파일명은 Supabase에서 지원 안됨)
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = file.name.includes('.') ? file.name.split('.').pop() : '';
  const filePath = `attachments/${timestamp}-${randomStr}${extension ? '.' + extension : ''}`;

  const { data, error } = await supabase.storage
    .from('notice-attachments')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return { success: false, error: '파일 업로드에 실패했습니다.' };
  }

  // Public URL 가져오기
  const { data: { publicUrl } } = supabase.storage
    .from('notice-attachments')
    .getPublicUrl(data.path);

  const attachment: NoticeAttachment = {
    url: publicUrl,
    fileName: file.name,
    fileSize: file.size,
    uploadedAt: new Date().toISOString(),
  };

  return { success: true, attachment };
}

// 첨부파일 삭제
export async function deleteNoticeAttachment(
  url: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // URL에서 파일 경로 추출
  const urlParts = url.split('notice-attachments/');
  if (urlParts.length < 2) {
    return { success: false, error: '잘못된 파일 URL입니다.' };
  }

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from('notice-attachments')
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    return { success: false, error: '파일 삭제에 실패했습니다.' };
  }

  return { success: true };
}
