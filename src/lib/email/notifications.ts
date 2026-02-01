'use server';

import { Resend } from 'resend';

const ADMIN_EMAIL = 'qmes6871@gmail.com';

// Resend 인스턴스를 런타임에 생성 (빌드 시 API 키 없어도 오류 방지)
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set');
    return null;
  }
  return new Resend(apiKey);
}

interface EnrollmentNotificationData {
  userName: string;
  userEmail: string;
  userPhone?: string;
  courseName: string;
  courseCategory: string;
  paymentStatus: string;
  paymentAmount: number;
  enrollmentId: string;
}

// 수강신청 알림 이메일 발송
export async function sendEnrollmentNotification(data: EnrollmentNotificationData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const resend = getResend();
    if (!resend) {
      return { success: false, error: 'Email service not configured' };
    }

    const paymentStatusText = data.paymentStatus === 'paid' ? '결제완료' :
                              data.paymentStatus === 'pending' ? '미결제' :
                              data.paymentStatus === 'pending_virtual_account' ? '가상계좌 입금대기' :
                              data.paymentStatus;

    const categoryMap: Record<string, string> = {
      'drunk-driving': '음주운전',
      'drug': '마약',
      'violence': '폭력',
      'theft': '절도',
      'fraud': '사기',
      'sexual-offense': '성범죄',
      'juvenile': '소년범',
      'detention': '구속수감자',
      'property': '재산범죄',
    };

    const categoryText = categoryMap[data.courseCategory] || data.courseCategory;

    const { error } = await resend.emails.send({
      from: 'KRPIC 알림 <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `[수강신청] ${data.userName}님이 ${categoryText} 교육을 신청했습니다`,
      html: `
        <div style="font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📚 새로운 수강신청</h1>
          </div>

          <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; color: #6c757d; width: 120px;">신청자</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; font-weight: 600;">${data.userName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; color: #6c757d;">이메일</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">${data.userEmail}</td>
              </tr>
              ${data.userPhone ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; color: #6c757d;">연락처</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">${data.userPhone}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; color: #6c757d;">교육과정</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; font-weight: 600;">${data.courseName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; color: #6c757d;">분류</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">${categoryText}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; color: #6c757d;">결제상태</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <span style="background: ${data.paymentStatus === 'paid' ? '#28a745' : '#ffc107'}; color: ${data.paymentStatus === 'paid' ? 'white' : '#212529'}; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
                    ${paymentStatusText}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6c757d;">결제금액</td>
                <td style="padding: 12px 0; font-weight: 600; color: #1e3a5f;">${data.paymentAmount.toLocaleString()}원</td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e9ecef;">
              <a href="https://krpic.co.kr/admin/enrollments" style="display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                관리자 페이지에서 확인하기 →
              </a>
            </div>

            <p style="margin-top: 20px; color: #6c757d; font-size: 13px;">
              신청일시: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send enrollment notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email notification error:', error);
    return { success: false, error: String(error) };
  }
}
