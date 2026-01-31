'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Profile, Course, Enrollment, DashboardStats } from '@/types/admin';

// 관리자 확인
export async function checkIsAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  return profile?.is_admin ?? false;
}

// 대시보드 통계
export async function getDashboardStats(): Promise<DashboardStats | null> {
  const supabase = await createClient();

  const [
    { count: totalMembers },
    { count: totalCourses },
    { count: totalEnrollments },
    { count: pendingEnrollments },
    { data: recentMembers },
    { data: recentEnrollments }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('enrollments').select(`
      *,
      user:profiles(*),
      course:courses(*)
    `).order('created_at', { ascending: false }).limit(5)
  ]);

  return {
    totalMembers: totalMembers ?? 0,
    totalCourses: totalCourses ?? 0,
    totalEnrollments: totalEnrollments ?? 0,
    pendingEnrollments: pendingEnrollments ?? 0,
    recentMembers: (recentMembers as Profile[]) ?? [],
    recentEnrollments: (recentEnrollments as (Enrollment & { user: Profile; course: Course })[]) ?? []
  };
}

// 회원 관리
export async function getMembers(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMember(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function updateMember(id: string, updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteMember(id: string): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  // auth.users에서 삭제하면 profiles도 CASCADE로 삭제됨
  const { error } = await adminClient.auth.admin.deleteUser(id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 교육 프로그램 관리
export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCourse(id: string): Promise<Course | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string; data?: Course }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteCourse(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 수강 신청 관리
export async function getEnrollments(): Promise<(Enrollment & { user: Profile; course: Course })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      user:profiles(*),
      course:courses(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as (Enrollment & { user: Profile; course: Course })[]) ?? [];
}

export async function getEnrollment(id: string): Promise<(Enrollment & { user: Profile; course: Course }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      user:profiles(*),
      course:courses(*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as (Enrollment & { user: Profile; course: Course });
}

export async function updateEnrollment(id: string, updates: Partial<Enrollment>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('enrollments')
    .update(updates)
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteEnrollment(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 사용자별 수강 신청 조회
export async function getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as (Enrollment & { course: Course })[]) ?? [];
}

// 수강 신청 생성
export async function createEnrollment(enrollment: { user_id: string; course_id: string }): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('enrollments')
    .insert(enrollment);

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: '이미 수강 신청한 프로그램입니다.' };
    }
    return { success: false, error: error.message };
  }
  return { success: true };
}
