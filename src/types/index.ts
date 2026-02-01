export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  color: string;
  hidden?: boolean;
}

export interface Course {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  duration: string;
  instructor: string;
  features: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
  category: 'notice' | 'update' | 'event' | 'guide';
  views: number;
}

export interface Review {
  id: string;
  author: string;
  courseTitle: string;
  category: string;
  content: string;
  rating: number;
  date: string;
  helpful: number;
  verified: boolean;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}
