'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Bell,
  ChevronRight,
  Megaphone,
  RefreshCw,
  Gift,
  BookOpen,
  Layers,
  Eye,
  Calendar,
  Search,
  Pin,
  ArrowUpRight
} from 'lucide-react';
import { getNotices } from '@/lib/notices/actions';
import { noticeCategories } from '@/data/notices';
import { Notice } from '@/types';

const categoryIcons: Record<string, React.ReactNode> = {
  all: <Layers className="w-4 h-4" />,
  notice: <Bell className="w-4 h-4" />,
  update: <RefreshCw className="w-4 h-4" />,
  event: <Gift className="w-4 h-4" />,
  guide: <BookOpen className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  notice: 'bg-blue-100 text-blue-700 border-blue-200',
  update: 'bg-purple-100 text-purple-700 border-purple-200',
  event: 'bg-pink-100 text-pink-700 border-pink-200',
  guide: 'bg-green-100 text-green-700 border-green-200',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays <= 7) return `${diffDays}일 전`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)}주 전`;
  return formatDate(dateString);
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotices = notices
    .filter(notice => {
      const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // 중요 공지를 먼저 표시
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const importantNotices = notices.filter(n => n.important).slice(0, 2);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-20 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-10 right-20 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          </div>
          <div className="relative h-full flex items-center">
            <div className="container-custom">
              <div className="max-w-3xl md:max-w-none md:text-center md:mx-auto">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
                  <Megaphone className="w-4 h-4" />
                  KRPIC 소식을 전해드립니다
                </span>
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" aria-hidden="true">
                  공지<span className="text-accent-400">사항</span>
                </div>
                <p className="text-lg md:text-xl text-white/80">
                  센터의 새로운 소식과 업데이트를 확인하세요
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-20 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl md:max-w-none md:text-center md:mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
                <Megaphone className="w-4 h-4" />
                KRPIC 소식을 전해드립니다
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                공지<span className="text-accent-400">사항</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80">
                센터의 새로운 소식과 업데이트를 확인하세요
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured/Important Notices */}
      {importantNotices.length > 0 && (
        <section className="relative -mt-16 z-10 px-4 mb-8">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-4">
              {importantNotices.map((notice, index) => (
                <Link key={notice.id} href={`/notice/${notice.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-6 md:p-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                              <Pin className="w-3 h-3" />
                              중요
                            </span>
                            <span className="text-white/70 text-sm">
                              {formatRelativeDate(notice.date)}
                            </span>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:underline underline-offset-4">
                            {notice.title}
                          </h3>
                          <p className="text-white/80 text-sm line-clamp-2">
                            {notice.content.substring(0, 100)}...
                          </p>
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter & Search */}
      <section className="px-4 mb-8">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-primary-100"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
                {noticeCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category.id
                        ? 'bg-primary-900 text-white'
                        : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                    }`}
                  >
                    {categoryIcons[category.id]}
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  placeholder="공지사항 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-80 pl-12 pr-4 py-3 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notice List */}
      <section className="px-4 pb-16">
        <div className="container-custom">
          <div className="space-y-4">
            {filteredNotices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/notice/${notice.id}`}>
                  <div className={`group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border transition-all duration-300 hover:-translate-y-1 ${
                    notice.important ? 'border-accent-200 bg-accent-50/30' : 'border-primary-100'
                  }`}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notice.important
                          ? 'bg-gradient-to-br from-accent-400 to-accent-600 text-white'
                          : 'bg-primary-100 text-primary-600 group-hover:bg-secondary-100 group-hover:text-secondary-600'
                      } transition-colors`}>
                        {notice.important ? <Pin className="w-5 h-5" /> : categoryIcons[notice.category]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {notice.important && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
                              중요
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${categoryColors[notice.category]}`}>
                            {categoryIcons[notice.category]}
                            {noticeCategories.find(c => c.id === notice.category)?.name}
                          </span>
                        </div>

                        <h2 className="text-lg font-semibold text-primary-900 mb-2 group-hover:text-secondary-600 transition-colors line-clamp-1">
                          {notice.title}
                        </h2>

                        <p className="text-primary-500 text-sm line-clamp-2 mb-3">
                          {notice.content.substring(0, 150)}...
                        </p>

                        <div className="flex items-center gap-4 text-sm text-primary-400">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatRelativeDate(notice.date)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {notice.views.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-6 h-6 text-primary-300 group-hover:text-secondary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredNotices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Bell className="w-16 h-16 text-primary-200 mx-auto mb-4" />
              <p className="text-primary-500">검색 결과가 없습니다.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
