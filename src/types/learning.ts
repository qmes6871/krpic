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
}
