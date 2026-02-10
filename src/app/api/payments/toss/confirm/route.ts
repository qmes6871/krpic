import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEnrollmentNotification } from '@/lib/email/notifications';

// 토스페이먼츠 은행 코드 매핑
const BANK_CODE_MAP: { [key: string]: string } = {
  '02': 'KDB산업은행',
  '03': 'IBK기업은행',
  '04': 'KB국민은행',
  '06': 'KB국민은행',
  '07': '수협은행',
  '11': 'NH농협은행',
  '12': '농축협',
  '20': '우리은행',
  '23': 'SC제일은행',
  '27': '한국씨티은행',
  '31': '대구은행',
  '32': '부산은행',
  '34': '광주은행',
  '35': '제주은행',
  '37': '전북은행',
  '38': '경남은행',
  '39': '새마을금고',
  '41': '신한은행',
  '45': '새마을금고',
  '48': '신협',
  '50': '저축은행',
  '64': '산림조합',
  '71': '우체국',
  '81': '하나은행',
  '88': '신한은행',
  '89': '케이뱅크',
  '90': '카카오뱅크',
  '92': '토스뱅크',
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tossSecretKey = process.env.TOSS_SECRET_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount, courseId, userId } = await request.json();

    console.log('Payment confirm request:', { paymentKey, orderId, amount, courseId, userId });

    if (!paymentKey || !orderId || !amount || !courseId || !userId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인 API 호출
    const encryptedSecretKey = Buffer.from(tossSecretKey + ':').toString('base64');

    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const data = await response.json();

    console.log('Toss payment response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Toss payment confirmation failed:', data);
      return NextResponse.json(
        { error: data.message || '결제 승인에 실패했습니다.' },
        { status: response.status }
      );
    }

    // 가상계좌인 경우 입금 대기 상태로 등록
    const isVirtualAccount = data.method === '가상계좌';
    const enrollmentStatus = isVirtualAccount ? 'pending_payment' : 'approved';

    console.log('Is virtual account:', isVirtualAccount, 'Status:', enrollmentStatus);

    // 수강 등록 생성
    const paymentStatus = isVirtualAccount ? 'unpaid' : 'paid';
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: enrollmentStatus,
        payment_status: paymentStatus,
        payment_amount: amount,
      })
      .select()
      .single();

    // 가상계좌 정보 준비 (enrollment 실패와 관계없이)
    const bankCode = data.virtualAccount?.bankCode || '';
    const bankName = BANK_CODE_MAP[bankCode] || `은행(${bankCode})`;

    const virtualAccountInfo = isVirtualAccount && data.virtualAccount ? {
      bank: bankCode,
      bankName: bankName,
      accountNumber: data.virtualAccount.accountNumber,
      customerName: data.virtualAccount.customerName,
      dueDate: data.virtualAccount.dueDate,
    } : null;

    if (enrollmentError) {
      console.error('Enrollment creation error:', enrollmentError);
      // enrollment 실패해도 가상계좌 정보는 반환
      return NextResponse.json({
        success: true,
        payment: data,
        enrollmentError: enrollmentError.message,
        isVirtualAccount,
        virtualAccount: virtualAccountInfo,
      });
    }

    console.log('Enrollment created:', enrollment?.id);

    // 이메일 알림 발송 (비동기, 실패해도 결제 처리에 영향 없음)
    try {
      const [{ data: userData }, { data: courseData }] = await Promise.all([
        supabaseAdmin.from('profiles').select('name, email, phone').eq('id', userId).single(),
        supabaseAdmin.from('courses').select('title, category, price').eq('id', courseId).single(),
      ]);

      if (userData && courseData) {
        sendEnrollmentNotification({
          userName: userData.name || '이름 없음',
          userEmail: userData.email || '',
          userPhone: userData.phone || undefined,
          courseName: courseData.title,
          courseCategory: courseData.category,
          paymentStatus: isVirtualAccount ? 'pending_virtual_account' : 'paid',
          paymentAmount: courseData.price || amount,
          enrollmentId: enrollment?.id || '',
        }).catch(err => console.error('Email notification failed:', err));
      }
    } catch (emailError) {
      console.error('Failed to prepare email notification:', emailError);
    }

    // 가상계좌인 경우 계좌 정보 포함
    if (isVirtualAccount) {
      console.log('Returning virtual account info:', virtualAccountInfo);
      return NextResponse.json({
        success: true,
        payment: data,
        enrollment,
        isVirtualAccount: true,
        virtualAccount: virtualAccountInfo,
      });
    }

    return NextResponse.json({
      success: true,
      payment: data,
      enrollment,
      isVirtualAccount: false,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: '결제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
