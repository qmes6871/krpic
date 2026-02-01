export interface VideoProgress {
  currentPosition: number;
  maxPosition: number;
  duration: number;
  percentage: number;
}

export interface CertificateData {
  userName: string;
  courseName: string;
  completionDate: string;
  certificateNumber: string;
  category: string;
}

// 추가 영상 요구사항 타입
export type AdditionalVideoRequirement = 'none' | 'cbt-only' | 'all';

export interface EnrollmentWithProgress {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string | null;
  courseCategory: string;
  videoUrl: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  watchedSeconds: number;
  videoDurationSeconds: number;
  lastWatchedPosition: number;
  maxWatchedPosition: number;
  completedAt: string | null;
  certificateNumber: string | null;
  enrolledAt: string;
  progressPercentage: number;
  // CBT/준법의식 영상 진도 (추가 영상이 필요한 코스용)
  cbtLastPosition: number;
  cbtMaxPosition: number;
  cbtDuration: number;
  lawLastPosition: number;
  lawMaxPosition: number;
  lawDuration: number;
  // 추가 영상 필요 여부 (기존 호환성)
  requiresAdditionalVideos: boolean;
  // 추가 영상 요구사항 ('none' | 'cbt-only' | 'all')
  additionalVideoRequirement: AdditionalVideoRequirement;
}

// 영상 타입
export type VideoType = 'main' | 'cbt' | 'law';
