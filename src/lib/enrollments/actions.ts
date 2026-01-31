'use server';

import { createClient } from '@/lib/supabase/server';
import { EnrollmentWithProgress } from '@/types/learning';
import { Course, Enrollment } from '@/types/admin';

// 수강 등록 생성 (결제 완료 시 호출)
export async function createApprovedEnrollment(courseId: string): Promise<{
  success: boolean;
  enrollmentId?: string;
  error?: string;
}> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  // 이미 등록된 수강 신청이 있는지 확인
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single();

  if (existingEnrollment) {
    // 이미 승인된 수강이 있으면 그대로 반환
    if (existingEnrollment.status === 'approved' || existingEnrollment.status === 'completed') {
      return { success: true, enrollmentId: existingEnrollment.id };
    }

    // pending 상태면 approved로 업데이트
    const { data: updated, error: updateError } = await supabase
      .from('enrollments')
      .update({
        status: 'approved',
        payment_status: 'paid',
      })
      .eq('id', existingEnrollment.id)
      .select('id')
      .single();

    if (updateError) {
      console.error('Failed to update enrollment:', updateError);
      return { success: false, error: '수강 등록 업데이트에 실패했습니다.' };
    }

    return { success: true, enrollmentId: updated.id };
  }

  // 코스 가격 조회
  const { data: course } = await supabase
    .from('courses')
    .select('price')
    .eq('id', courseId)
    .single();

  // 새로운 수강 등록 생성
  const { data: newEnrollment, error: insertError } = await supabase
    .from('enrollments')
    .insert({
      user_id: user.id,
      course_id: courseId,
      status: 'approved',
      payment_status: 'paid',
      payment_amount: course?.price || 0,
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Failed to create enrollment:', insertError);
    return { success: false, error: '수강 등록에 실패했습니다.' };
  }

  return { success: true, enrollmentId: newEnrollment.id };
}

// 사용자 수강 정보 조회
export async function getUserEnrollment(courseId: string): Promise<EnrollmentWithProgress | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single();

  if (error || !enrollment) {
    return null;
  }

  const course = enrollment.course as Course;
  const videoDuration = enrollment.video_duration_seconds || 0;
  const maxWatched = enrollment.max_watched_position || 0;
  const progressPercentage = videoDuration > 0 ? Math.round((maxWatched / videoDuration) * 100) : 0;

  return {
    id: enrollment.id,
    courseId: enrollment.course_id,
    courseTitle: course?.title || '',
    courseThumbnail: course?.thumbnail || null,
    courseCategory: course?.category || '',
    videoUrl: course?.video_url || null,
    status: enrollment.status,
    paymentStatus: enrollment.payment_status,
    watchedSeconds: enrollment.watched_seconds || 0,
    videoDurationSeconds: videoDuration,
    lastWatchedPosition: enrollment.last_watched_position || 0,
    maxWatchedPosition: maxWatched,
    completedAt: enrollment.completed_at,
    certificateNumber: enrollment.certificate_number,
    enrolledAt: enrollment.created_at,
    progressPercentage,
  };
}

// 사용자의 모든 수강 목록 조회
export async function getUserEnrollments(): Promise<EnrollmentWithProgress[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !enrollments) {
    return [];
  }

  return enrollments.map((enrollment: any) => {
    const course = enrollment.course as Course;
    const videoDuration = enrollment.video_duration_seconds || 0;
    const maxWatched = enrollment.max_watched_position || 0;
    const progressPercentage = videoDuration > 0 ? Math.round((maxWatched / videoDuration) * 100) : 0;

    return {
      id: enrollment.id,
      courseId: enrollment.course_id,
      courseTitle: course?.title || '',
      courseThumbnail: course?.thumbnail || null,
      courseCategory: course?.category || '',
      videoUrl: course?.video_url || null,
      status: enrollment.status,
      paymentStatus: enrollment.payment_status,
      watchedSeconds: enrollment.watched_seconds || 0,
      videoDurationSeconds: videoDuration,
      lastWatchedPosition: enrollment.last_watched_position || 0,
      maxWatchedPosition: maxWatched,
      completedAt: enrollment.completed_at,
      certificateNumber: enrollment.certificate_number,
      enrolledAt: enrollment.created_at,
      progressPercentage,
    };
  });
}

// 비디오 진도 업데이트
export async function updateVideoProgress(
  enrollmentId: string,
  currentPosition: number,
  maxPosition: number,
  duration: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  // 현재 enrollment 조회
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('max_watched_position, user_id')
    .eq('id', enrollmentId)
    .single();

  if (!enrollment) {
    return { success: false, error: '수강 정보를 찾을 수 없습니다.' };
  }

  // 권한 확인
  if (enrollment.user_id !== user.id) {
    return { success: false, error: '권한이 없습니다.' };
  }

  // max_watched_position은 기존 값과 비교해서 더 큰 값만 업데이트
  const newMaxPosition = Math.max(enrollment.max_watched_position || 0, maxPosition);

  const { error: updateError } = await supabase
    .from('enrollments')
    .update({
      last_watched_position: Math.round(currentPosition),
      max_watched_position: Math.round(newMaxPosition),
      video_duration_seconds: Math.round(duration),
      watched_seconds: Math.round(newMaxPosition),
    })
    .eq('id', enrollmentId);

  if (updateError) {
    console.error('Failed to update video progress:', updateError);
    return { success: false, error: '진도 저장에 실패했습니다.' };
  }

  return { success: true };
}

// 수료 처리
export async function markCourseCompleted(enrollmentId: string): Promise<{
  success: boolean;
  certificateNumber?: string;
  error?: string;
}> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  // enrollment 조회
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(category)
    `)
    .eq('id', enrollmentId)
    .single();

  if (!enrollment) {
    return { success: false, error: '수강 정보를 찾을 수 없습니다.' };
  }

  // 권한 확인
  if (enrollment.user_id !== user.id) {
    return { success: false, error: '권한이 없습니다.' };
  }

  // 이미 수료한 경우
  if (enrollment.status === 'completed' && enrollment.certificate_number) {
    return { success: true, certificateNumber: enrollment.certificate_number };
  }

  // 진도율 확인 (98% 이상이면 수료 가능)
  const videoDuration = enrollment.video_duration_seconds || 0;
  const maxWatched = enrollment.max_watched_position || 0;
  const progressPercentage = videoDuration > 0 ? (maxWatched / videoDuration) * 100 : 0;

  if (progressPercentage < 98) {
    return { success: false, error: `진도율이 ${Math.round(progressPercentage)}%입니다. 100% 시청 후 수료할 수 있습니다.` };
  }

  // 수료증 번호 생성
  const certificateNumber = await generateCertificateNumber(enrollment.course?.category || 'EDU');

  // 수료 처리
  const { error: updateError } = await supabase
    .from('enrollments')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      certificate_number: certificateNumber,
    })
    .eq('id', enrollmentId);

  if (updateError) {
    console.error('Failed to mark course completed:', updateError);
    return { success: false, error: '수료 처리에 실패했습니다.' };
  }

  return { success: true, certificateNumber };
}

// 수료증 번호 생성
async function generateCertificateNumber(category: string): Promise<string> {
  const supabase = await createClient();

  const year = new Date().getFullYear();

  // 카테고리별 코드 매핑
  const categoryCodeMap: Record<string, string> = {
    'drunk-driving': 'DUI',
    'drug': 'DRG',
    'violence': 'VIO',
    'theft': 'THF',
    'fraud': 'FRD',
    'sexual-offense': 'SEX',
    'juvenile': 'JUV',
    'detention': 'DET',
  };

  const categoryCode = categoryCodeMap[category] || 'EDU';

  // 해당 연도의 해당 카테고리 수료증 개수 조회
  const { count } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .like('certificate_number', `KRPIC-${year}-${categoryCode}-%`);

  const nextNumber = (count || 0) + 1;
  const paddedNumber = String(nextNumber).padStart(5, '0');

  return `KRPIC-${year}-${categoryCode}-${paddedNumber}`;
}

// 수료증 데이터 조회
export async function getCertificateData(enrollmentId: string): Promise<{
  success: boolean;
  data?: {
    userName: string;
    courseName: string;
    completionDate: string;
    certificateNumber: string;
    category: string;
  };
  error?: string;
}> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  // enrollment 조회
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(title, category)
    `)
    .eq('id', enrollmentId)
    .single();

  if (!enrollment) {
    return { success: false, error: '수강 정보를 찾을 수 없습니다.' };
  }

  // 권한 확인
  if (enrollment.user_id !== user.id) {
    return { success: false, error: '권한이 없습니다.' };
  }

  // 수료 여부 확인
  if (enrollment.status !== 'completed' || !enrollment.certificate_number) {
    return { success: false, error: '수료 완료 후 수료증을 발급받을 수 있습니다.' };
  }

  // 사용자 이름 조회
  const userName = user.user_metadata?.name || '수강자';

  const course = enrollment.course as { title: string; category: string };

  return {
    success: true,
    data: {
      userName,
      courseName: course?.title || '',
      completionDate: enrollment.completed_at || new Date().toISOString(),
      certificateNumber: enrollment.certificate_number,
      category: course?.category || '',
    },
  };
}
