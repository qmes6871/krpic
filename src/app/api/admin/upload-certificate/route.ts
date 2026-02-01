import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 관리자 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ success: false, error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    // RLS를 우회하기 위해 Admin Client 사용
    const adminClient = createAdminClient();

    const formData = await request.formData();
    const enrollmentId = formData.get('enrollmentId') as string;
    const certificateId = formData.get('certificateId') as string;
    const file = formData.get('file') as File;

    if (!enrollmentId || !certificateId || !file) {
      return NextResponse.json({ success: false, error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 파일명 생성 (enrollmentId/certificateId_timestamp.pdf)
    const timestamp = Date.now();
    const filePath = `${enrollmentId}/${certificateId}_${timestamp}.pdf`;

    // File을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Storage에 업로드 (Admin Client 사용)
    const { error: uploadError } = await adminClient.storage
      .from('certificates')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({
        success: false,
        error: `파일 업로드에 실패했습니다: ${uploadError.message}`
      }, { status: 500 });
    }

    // Public URL 가져오기
    const { data: urlData } = adminClient.storage
      .from('certificates')
      .getPublicUrl(filePath);

    const uploadedCert = {
      url: urlData.publicUrl,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
    };

    // enrollments 테이블 업데이트 (Admin Client 사용)
    const { data: enrollment } = await adminClient
      .from('enrollments')
      .select('uploaded_certificates')
      .eq('id', enrollmentId)
      .single();

    const currentCerts = enrollment?.uploaded_certificates || {};
    const updatedCerts = {
      ...currentCerts,
      [certificateId]: uploadedCert,
    };

    const { error: updateError } = await adminClient
      .from('enrollments')
      .update({ uploaded_certificates: updatedCerts })
      .eq('id', enrollmentId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ success: false, error: '증명서 정보 저장에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: uploadedCert });
  } catch (error) {
    console.error('uploadCertificateFile error:', error);
    return NextResponse.json({ success: false, error: '업로드 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
