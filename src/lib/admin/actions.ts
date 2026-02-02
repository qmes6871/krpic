'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Profile, Course, Enrollment, DashboardStats } from '@/types/admin';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFile } from 'fs/promises';
import path from 'path';
import { getCertificateById, CertificateTemplate, getAllCertificatesForAdmin, getCertificatesByCategory } from '@/data/certificateTemplates';
import { sendEnrollmentNotification } from '@/lib/email/notifications';

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
    { data: recentEnrollmentsRaw }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('enrollments').select(`
      *,
      course:courses(*)
    `).order('created_at', { ascending: false }).limit(5)
  ]);

  // recentEnrollments에 user 정보 추가
  let recentEnrollments: (Enrollment & { user: Profile; course: Course })[] = [];
  if (recentEnrollmentsRaw && recentEnrollmentsRaw.length > 0) {
    const userIds = [...new Set(recentEnrollmentsRaw.map((e: any) => e.user_id))];
    const { data: enrollmentProfiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    const profileMap = new Map(enrollmentProfiles?.map(p => [p.id, p]) || []);

    recentEnrollments = recentEnrollmentsRaw.map((e: any) => ({
      ...e,
      user: profileMap.get(e.user_id) as Profile,
      course: e.course as Course,
    }));
  }

  return {
    totalMembers: totalMembers ?? 0,
    totalCourses: totalCourses ?? 0,
    totalEnrollments: totalEnrollments ?? 0,
    pendingEnrollments: pendingEnrollments ?? 0,
    recentMembers: (recentMembers as Profile[]) ?? [],
    recentEnrollments
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

export async function updateMemberPassword(id: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  // 비밀번호 유효성 검사
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: '비밀번호는 최소 6자 이상이어야 합니다.' };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient.auth.admin.updateUserById(id, {
    password: newPassword
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 교육 프로그램 관리
export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('price', { ascending: true });

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
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
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
  try {
    const supabase = await createClient();

    // enrollments와 courses 조회
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(*)
      `)
      .order('created_at', { ascending: false });

    if (enrollmentError) {
      console.error('getEnrollments error:', JSON.stringify(enrollmentError, null, 2));
      throw new Error(enrollmentError.message);
    }

    if (!enrollments || enrollments.length === 0) {
      return [];
    }

    // 사용자 ID 목록 추출
    const userIds = [...new Set(enrollments.map(e => e.user_id))];

    // 사용자 정보 조회
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    if (profileError) {
      console.error('getEnrollments profile error:', JSON.stringify(profileError, null, 2));
      throw new Error(profileError.message);
    }

    // 프로필 맵 생성
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    // 데이터 결합
    return enrollments.map(enrollment => ({
      ...enrollment,
      user: profileMap.get(enrollment.user_id) as Profile,
      course: enrollment.course as Course,
    }));
  } catch (err) {
    console.error('getEnrollments catch error:', err);
    throw err;
  }
}

export async function getEnrollment(id: string): Promise<(Enrollment & { user: Profile; course: Course }) | null> {
  const supabase = await createClient();

  // enrollment와 course 조회
  const { data: enrollment, error: enrollmentError } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('id', id)
    .single();

  if (enrollmentError || !enrollment) return null;

  // user 정보 조회
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', enrollment.user_id)
    .single();

  if (userError) return null;

  return {
    ...enrollment,
    user: user as Profile,
    course: enrollment.course as Course,
  };
}

export async function updateEnrollment(id: string, updates: Partial<Enrollment>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // 상태가 completed로 변경되는 경우, certificate_number가 없으면 자동 생성
  if (updates.status === 'completed') {
    // 현재 enrollment 정보 조회
    const { data: currentEnrollment } = await supabase
      .from('enrollments')
      .select(`
        certificate_number,
        course:courses(category)
      `)
      .eq('id', id)
      .single();

    // certificate_number가 없으면 자동 생성
    if (currentEnrollment && !currentEnrollment.certificate_number) {
      const course = currentEnrollment.course as unknown as { category: string } | null;
      const category = course?.category || 'EDU';
      const certificateNumber = await generateAdminCertificateNumber(category);

      updates = {
        ...updates,
        completed_at: new Date().toISOString(),
        certificate_number: certificateNumber,
      } as Partial<Enrollment>;
    }
  }

  const { error } = await supabase
    .from('enrollments')
    .update(updates)
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 관리자용 수료증 번호 생성
async function generateAdminCertificateNumber(category: string): Promise<string> {
  const supabase = await createClient();
  const year = new Date().getFullYear();

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

  const { count } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .like('certificate_number', `KRPIC-${year}-${categoryCode}-%`);

  const nextNumber = (count || 0) + 1;
  const paddedNumber = String(nextNumber).padStart(5, '0');

  return `KRPIC-${year}-${categoryCode}-${paddedNumber}`;
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
  const { data: newEnrollment, error } = await supabase
    .from('enrollments')
    .insert(enrollment)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: '이미 수강 신청한 프로그램입니다.' };
    }
    return { success: false, error: error.message };
  }

  // 이메일 알림 발송 (비동기)
  try {
    const [{ data: userData }, { data: courseData }] = await Promise.all([
      supabase.from('profiles').select('name, email, phone').eq('id', enrollment.user_id).single(),
      supabase.from('courses').select('title, category, price').eq('id', enrollment.course_id).single(),
    ]);

    if (userData && courseData) {
      sendEnrollmentNotification({
        userName: userData.name || '이름 없음',
        userEmail: userData.email || '',
        userPhone: userData.phone || undefined,
        courseName: courseData.title,
        courseCategory: courseData.category,
        paymentStatus: 'pending',
        paymentAmount: courseData.price || 0,
        enrollmentId: newEnrollment?.id || '',
      }).catch(err => console.error('Email notification failed:', err));
    }
  } catch (emailError) {
    console.error('Failed to prepare email notification:', emailError);
  }

  return { success: true };
}

// ============ 관리자 증명서 발급 기능 ============

// 모든 증명서 템플릿 목록 가져오기
export async function getAdminCertificateTemplates(): Promise<{
  all: CertificateTemplate[];
  byCategory: Record<string, CertificateTemplate[]>;
}> {
  return {
    all: getAllCertificatesForAdmin(),
    byCategory: getCertificatesByCategory(),
  };
}

// 관리자용 증명서 생성 (수강생 이름, 날짜 직접 입력)
export async function generateAdminCertificate(
  certificateId: string,
  studentName: string,
  issueDate: string
): Promise<{
  success: boolean;
  pdfBase64?: string;
  fileName?: string;
  error?: string;
}> {
  // 관리자 권한 확인
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: '관리자 권한이 필요합니다.' };
  }

  // 요청된 증명서 템플릿 찾기
  const template = getCertificateById(certificateId);

  if (!template) {
    return { success: false, error: '요청한 증명서를 찾을 수 없습니다.' };
  }

  try {
    // PDF 템플릿 파일 읽기
    const pdfPath = path.join(process.cwd(), 'public', 'certificates', template.fileName);
    const pdfBytes = await readFile(pdfPath);

    // 가이드 문서는 이름/날짜 삽입 없이 그대로 반환
    if (template.isGuide) {
      const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
      const fileName = `${template.name}.pdf`;
      return { success: true, pdfBase64, fileName };
    }

    // PDF 문서 로드
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // fontkit 등록
    pdfDoc.registerFontkit(fontkit);

    // 한글 폰트 로드
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NanumGothicBold.ttf');
    const fontBytes = await readFile(fontPath);
    const koreanFont = await pdfDoc.embedFont(fontBytes);

    // 첫 번째 페이지 가져오기
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize();

    // 날짜 포맷
    const date = new Date(issueDate);
    const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

    // 이름 추가 (좌하단 기준 좌표를 좌상단 기준으로 변환)
    firstPage.drawText(studentName, {
      x: template.namePosition.x,
      y: height - template.namePosition.y,
      size: template.namePosition.fontSize,
      font: koreanFont,
      color: rgb(0, 0, 0),
    });

    // 날짜 추가
    firstPage.drawText(formattedDate, {
      x: template.datePosition.x,
      y: height - template.datePosition.y,
      size: template.datePosition.fontSize,
      font: koreanFont,
      color: rgb(0, 0, 0),
    });

    // PDF를 base64로 변환
    const modifiedPdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(modifiedPdfBytes).toString('base64');

    // 파일명 생성 (사용자 이름 + 증명서 이름)
    const fileName = `${studentName}_${template.name}.pdf`;

    return { success: true, pdfBase64, fileName };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: 'PDF 생성 중 오류가 발생했습니다.' };
  }
}

// 관리자용 일괄 증명서 생성 (여러 증명서를 한번에 생성)
export async function generateBulkCertificates(
  certificateIds: string[],
  studentName: string,
  issueDate: string
): Promise<{
  success: boolean;
  results?: { certificateId: string; pdfBase64: string; fileName: string }[];
  error?: string;
}> {
  // 관리자 권한 확인
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: '관리자 권한이 필요합니다.' };
  }

  const results: { certificateId: string; pdfBase64: string; fileName: string }[] = [];

  for (const certificateId of certificateIds) {
    const result = await generateAdminCertificate(certificateId, studentName, issueDate);
    if (result.success && result.pdfBase64 && result.fileName) {
      results.push({
        certificateId,
        pdfBase64: result.pdfBase64,
        fileName: result.fileName,
      });
    }
  }

  return { success: true, results };
}

// ============ 수강생별 증명서 업로드 관리 ============

export interface UploadedCertificate {
  url: string;
  fileName: string;
  uploadedAt: string;
}

export type UploadedCertificates = Record<string, UploadedCertificate>;

// 수강생의 업로드된 증명서 목록 조회
export async function getUploadedCertificates(enrollmentId: string): Promise<{
  success: boolean;
  data?: UploadedCertificates;
  error?: string;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('enrollments')
    .select('uploaded_certificates')
    .eq('id', enrollmentId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data?.uploaded_certificates || {} };
}

// 증명서 업로드
export async function uploadCertificateFile(
  formData: FormData
): Promise<{
  success: boolean;
  data?: UploadedCertificate;
  error?: string;
}> {
  try {
    console.log('uploadCertificateFile called');

    // 관리자 권한 확인
    const isAdmin = await checkIsAdmin();
    console.log('isAdmin:', isAdmin);
    if (!isAdmin) {
      return { success: false, error: '관리자 권한이 필요합니다.' };
    }

    const enrollmentId = formData.get('enrollmentId') as string;
    const certificateId = formData.get('certificateId') as string;
    const file = formData.get('file') as File;

    console.log('enrollmentId:', enrollmentId);
    console.log('certificateId:', certificateId);
    console.log('file:', file?.name, file?.size);

    if (!enrollmentId || !certificateId || !file) {
      return { success: false, error: '필수 정보가 누락되었습니다.' };
    }

    const supabase = await createClient();

    // 파일명 생성 (enrollmentId/certificateId_timestamp.pdf)
    const timestamp = Date.now();
    const filePath = `${enrollmentId}/${certificateId}_${timestamp}.pdf`;
    console.log('filePath:', filePath);

    // File을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('buffer size:', buffer.length);

    // Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    console.log('uploadError:', uploadError);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: '파일 업로드에 실패했습니다.' };
    }

    // Public URL 가져오기
    const { data: urlData } = supabase.storage
      .from('certificates')
      .getPublicUrl(filePath);

    const uploadedCert: UploadedCertificate = {
      url: urlData.publicUrl,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
    };

    // enrollments 테이블 업데이트
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('uploaded_certificates')
      .eq('id', enrollmentId)
      .single();

    const currentCerts = enrollment?.uploaded_certificates || {};
    const updatedCerts = {
      ...currentCerts,
      [certificateId]: uploadedCert,
    };

    const { error: updateError } = await supabase
      .from('enrollments')
      .update({ uploaded_certificates: updatedCerts })
      .eq('id', enrollmentId);

    if (updateError) {
      console.error('Update error:', updateError);
      return { success: false, error: '증명서 정보 저장에 실패했습니다.' };
    }

    console.log('Upload successful:', uploadedCert);
    return { success: true, data: uploadedCert };
  } catch (error) {
    console.error('uploadCertificateFile error:', error);
    return { success: false, error: '업로드 처리 중 오류가 발생했습니다.' };
  }
}

// 수강 신청의 코스 증명서 목록 조회 (관리자용)
export async function getEnrollmentCertificateConfig(enrollmentId: string): Promise<{
  success: boolean;
  data?: {
    courseCertificates: string[];
    courseCategory: string;
  };
  error?: string;
}> {
  const supabase = await createClient();

  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .select(`
      course:courses(category, certificates)
    `)
    .eq('id', enrollmentId)
    .single();

  if (error || !enrollment) {
    return { success: false, error: '수강 정보를 찾을 수 없습니다.' };
  }

  const course = enrollment.course as unknown as { category: string; certificates: string[] | null } | null;

  return {
    success: true,
    data: {
      courseCertificates: course?.certificates || [],
      courseCategory: course?.category || '',
    },
  };
}

// 증명서 삭제
export async function deleteCertificateFile(
  enrollmentId: string,
  certificateId: string
): Promise<{ success: boolean; error?: string }> {
  // 관리자 권한 확인
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: '관리자 권한이 필요합니다.' };
  }

  const supabase = await createClient();

  // 현재 증명서 정보 가져오기
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('uploaded_certificates')
    .eq('id', enrollmentId)
    .single();

  const currentCerts = enrollment?.uploaded_certificates || {};

  if (!currentCerts[certificateId]) {
    return { success: false, error: '삭제할 증명서가 없습니다.' };
  }

  // URL에서 파일 경로 추출하여 Storage에서 삭제
  const url = currentCerts[certificateId].url;
  const pathMatch = url.match(/certificates\/(.+)$/);
  if (pathMatch) {
    await supabase.storage.from('certificates').remove([pathMatch[1]]);
  }

  // enrollments 테이블에서 해당 증명서 정보 제거
  const { [certificateId]: removed, ...remainingCerts } = currentCerts;

  const { error: updateError } = await supabase
    .from('enrollments')
    .update({ uploaded_certificates: remainingCerts })
    .eq('id', enrollmentId);

  if (updateError) {
    return { success: false, error: '증명서 정보 삭제에 실패했습니다.' };
  }

  return { success: true };
}
