export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  duration: string | null;
  thumbnail: string | null;
  instructor: string | null;
  features: string[];
  detail_images: string[];
  video_url: string | null;
  certificates: string[] | null; // 발급할 증명서 ID 목록
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UploadedCertificate {
  url: string;
  fileName: string;
  uploadedAt: string;
}

export type UploadedCertificates = Record<string, UploadedCertificate>;

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_amount: number;
  notes: string | null;
  // 진도 추적 필드
  watched_seconds: number;
  video_duration_seconds: number;
  last_watched_position: number;
  max_watched_position: number;
  completed_at: string | null;
  certificate_number: string | null;
  // 업로드된 증명서
  uploaded_certificates: UploadedCertificates | null;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: Profile;
  course?: Course;
}

export interface DashboardStats {
  totalMembers: number;
  totalCourses: number;
  totalEnrollments: number;
  pendingEnrollments: number;
  recentMembers: Profile[];
  recentEnrollments: (Enrollment & { user: Profile; course: Course })[];
}
