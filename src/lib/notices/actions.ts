'use server';

import { createClient } from '@/lib/supabase/server';
import { Notice } from '@/types';

export interface NoticeInput {
  title: string;
  content: string;
  category: 'notice' | 'update' | 'event' | 'guide';
  important: boolean;
  views?: number;
  createdAt?: string;
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
