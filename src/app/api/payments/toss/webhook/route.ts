import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// 토스페이먼츠 웹훅 시크릿 (토스 개발자센터에서 설정)
const TOSS_WEBHOOK_SECRET = process.env.TOSS_WEBHOOK_SECRET;

interface TossWebhookPayload {
  eventType: string;
  createdAt: string;
  data: {
    paymentKey: string;
    orderId: string;
    status: string;
    method?: string;
    totalAmount?: number;
    secret?: string; // 가상계좌 입금 확인용
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload: TossWebhookPayload = await request.json();

    console.log('Toss Webhook received:', JSON.stringify(payload, null, 2));

    const { eventType, data } = payload;

    // 가상계좌 입금 완료 이벤트
    if (eventType === 'PAYMENT_STATUS_CHANGED' && data.status === 'DONE') {
      const { paymentKey } = data;

      // paymentKey로 대기 중인 enrollment 찾기
      const { data: enrollment, error: findError } = await supabaseAdmin
        .from('enrollments')
        .select('*')
        .eq('payment_key', paymentKey)
        .eq('status', 'pending_payment')
        .single();

      if (findError || !enrollment) {
        console.log('No pending enrollment found for paymentKey:', paymentKey);
        // 이미 처리되었거나 없는 경우 - 200 반환하여 재시도 방지
        return NextResponse.json({ success: true, message: 'Already processed or not found' });
      }

      // 수강 상태를 approved로 변경
      const { error: updateError } = await supabaseAdmin
        .from('enrollments')
        .update({
          status: 'approved',
          payment_status: 'paid',
        })
        .eq('id', enrollment.id);

      if (updateError) {
        console.error('Failed to update enrollment:', updateError);
        return NextResponse.json(
          { error: 'Failed to update enrollment' },
          { status: 500 }
        );
      }

      console.log('Enrollment approved:', enrollment.id);
      return NextResponse.json({ success: true });
    }

    // 가상계좌 입금 대기 이벤트 (참고용 로깅)
    if (eventType === 'VIRTUAL_ACCOUNT_ISSUED') {
      console.log('Virtual account issued:', data);
      return NextResponse.json({ success: true });
    }

    // 결제 취소/실패 이벤트
    if (eventType === 'PAYMENT_STATUS_CHANGED' &&
        (data.status === 'CANCELED' || data.status === 'EXPIRED' || data.status === 'ABORTED')) {
      const { paymentKey } = data;

      // 해당 enrollment 삭제 또는 상태 변경
      const { error: deleteError } = await supabaseAdmin
        .from('enrollments')
        .delete()
        .eq('payment_key', paymentKey)
        .eq('status', 'pending_payment');

      if (deleteError) {
        console.error('Failed to delete canceled enrollment:', deleteError);
      }

      return NextResponse.json({ success: true });
    }

    // 기타 이벤트는 무시
    return NextResponse.json({ success: true, message: 'Event ignored' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
