import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Share2,
  RefreshCw,
  Gift,
  BookOpen,
  Pin
} from 'lucide-react';
import { getNotices, getNoticeById, incrementNoticeViews } from '@/lib/notices/actions';
import { noticeCategories } from '@/data/notices';

interface Props {
  params: Promise<{ id: string }>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  notice: <Bell className="w-4 h-4" />,
  update: <RefreshCw className="w-4 h-4" />,
  event: <Gift className="w-4 h-4" />,
  guide: <BookOpen className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  notice: 'bg-blue-100 text-blue-700',
  update: 'bg-purple-100 text-purple-700',
  event: 'bg-pink-100 text-pink-700',
  guide: 'bg-green-100 text-green-700',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const notice = await getNoticeById(id);

  if (!notice) {
    return {
      title: '공지사항을 찾을 수 없습니다 - KRPIC',
    };
  }

  return {
    title: `${notice.title} - KRPIC 재범방지교육통합센터`,
    description: notice.content.substring(0, 150),
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const notice = await getNoticeById(id);

  if (!notice) {
    notFound();
  }

  // Increment view count
  await incrementNoticeViews(id);

  // Get all notices for navigation
  const allNotices = await getNotices();
  const currentIndex = allNotices.findIndex((n) => n.id === id);
  const prevNotice = currentIndex > 0 ? allNotices[currentIndex - 1] : null;
  const nextNotice = currentIndex < allNotices.length - 1 ? allNotices[currentIndex + 1] : null;

  const categoryName = noticeCategories.find(c => c.id === notice.category)?.name || '';

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 pt-12 pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-20 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          {/* Back Link */}
          <Link
            href="/notice"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            공지사항 목록으로
          </Link>

          {/* Title Area */}
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {notice.important && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-500 text-white text-sm font-semibold rounded-full">
                  <Pin className="w-3.5 h-3.5" />
                  중요 공지
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${categoryColors[notice.category]}`}>
                {categoryIcons[notice.category]}
                {categoryName}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {notice.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/60">
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {formatDate(notice.date)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Eye className="w-5 h-5" />
                조회수 {(notice.views + 1).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative -mt-12 px-4 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Main Content Card */}
            <article className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="p-6 md:p-10 lg:p-12">
                <div className="prose prose-lg prose-primary max-w-none">
                  {notice.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('■')) {
                      return (
                        <p key={index} className="text-primary-800 font-semibold mt-6 mb-2">
                          {paragraph}
                        </p>
                      );
                    }
                    if (paragraph.startsWith('  -') || paragraph.startsWith('  ')) {
                      return (
                        <p key={index} className="text-primary-600 ml-4 mb-1">
                          {paragraph}
                        </p>
                      );
                    }
                    if (paragraph.startsWith('※')) {
                      return (
                        <p key={index} className="text-primary-500 text-sm mt-4">
                          {paragraph}
                        </p>
                      );
                    }
                    if (paragraph.trim() === '') {
                      return <br key={index} />;
                    }
                    return (
                      <p key={index} className="text-primary-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Share Actions */}
              <div className="px-6 md:px-10 lg:px-12 py-6 bg-primary-50 border-t border-primary-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-500">
                    이 공지가 도움이 되셨나요?
                  </span>
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    공유하기
                  </button>
                </div>
              </div>
            </article>

            {/* Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevNotice ? (
                <Link
                  href={`/notice/${prevNotice.id}`}
                  className="group p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-primary-100 transition-all hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-secondary-100 transition-colors">
                      <ChevronLeft className="w-5 h-5 text-primary-600 group-hover:text-secondary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-primary-400 uppercase tracking-wider">이전 글</span>
                      <p className="font-medium text-primary-900 line-clamp-1 group-hover:text-secondary-600 transition-colors">
                        {prevNotice.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextNotice && (
                <Link
                  href={`/notice/${nextNotice.id}`}
                  className="group p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-primary-100 transition-all hover:-translate-y-1 md:text-right"
                >
                  <div className="flex items-center gap-3 md:flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-secondary-100 transition-colors">
                      <ChevronRight className="w-5 h-5 text-primary-600 group-hover:text-secondary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-primary-400 uppercase tracking-wider">다음 글</span>
                      <p className="font-medium text-primary-900 line-clamp-1 group-hover:text-secondary-600 transition-colors">
                        {nextNotice.title}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
