'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  getAnalyticsStats,
  getTopPages,
  getTopReferrers,
  getDeviceStats,
  getBrowserStats,
  getHourlyStats,
  getDailyStats,
  getRealtimeVisitors,
  AnalyticsStats,
  PageStats,
  ReferrerStats,
  DeviceStats,
  BrowserStats,
  HourlyStats,
  DailyStats,
} from '@/lib/admin/analytics';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [topPages, setTopPages] = useState<PageStats[]>([]);
  const [topReferrers, setTopReferrers] = useState<ReferrerStats[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats[]>([]);
  const [browserStats, setBrowserStats] = useState<BrowserStats[]>([]);
  const [hourlyStats, setHourlyStats] = useState<HourlyStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [realtimeVisitors, setRealtimeVisitors] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        statsData,
        pagesData,
        referrersData,
        devicesData,
        browsersData,
        hourlyData,
        dailyData,
        realtimeData,
      ] = await Promise.all([
        getAnalyticsStats(),
        getTopPages(7, 10),
        getTopReferrers(7, 10),
        getDeviceStats(7),
        getBrowserStats(7),
        getHourlyStats(),
        getDailyStats(14),
        getRealtimeVisitors(),
      ]);

      setStats(statsData);
      setTopPages(pagesData);
      setTopReferrers(referrersData);
      setDeviceStats(devicesData);
      setBrowserStats(browsersData);
      setHourlyStats(hourlyData);
      setDailyStats(dailyData);
      setRealtimeVisitors(realtimeData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();

    // 30초마다 실시간 방문자 업데이트
    const interval = setInterval(async () => {
      const realtime = await getRealtimeVisitors();
      setRealtimeVisitors(realtime);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getDeviceLabel = (type: string) => {
    switch (type) {
      case 'mobile':
        return '모바일';
      case 'tablet':
        return '태블릿';
      case 'desktop':
        return '데스크톱';
      default:
        return type;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const maxHourlyCount = Math.max(...hourlyStats.map(h => h.count), 1);
  const maxDailyViews = Math.max(...dailyStats.map(d => d.views), 1);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">접속자 통계</h1>
          <p className="text-gray-500">사이트 방문자 현황을 확인합니다</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
            </span>
          )}
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>
      </div>

      {/* Realtime Visitors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">실시간 방문자 (최근 5분)</p>
            <p className="text-4xl font-bold mt-1">{formatNumber(realtimeVisitors)}명</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            {stats && stats.todayViews > stats.yesterdayViews && (
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{formatNumber(stats.todayViews - stats.yesterdayViews)}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">오늘 페이지뷰</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats?.todayViews || 0)}</p>
          <p className="text-xs text-gray-400 mt-1">어제: {formatNumber(stats?.yesterdayViews || 0)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm">오늘 방문자</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats?.todayUniqueVisitors || 0)}</p>
          <p className="text-xs text-gray-400 mt-1">주간: {formatNumber(stats?.weekUniqueVisitors || 0)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm">주간 페이지뷰</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats?.weekViews || 0)}</p>
          <p className="text-xs text-gray-400 mt-1">월간: {formatNumber(stats?.monthViews || 0)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm">전체 페이지뷰</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats?.totalViews || 0)}</p>
        </motion.div>
      </div>

      {/* Hourly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900">오늘 시간대별 방문</h2>
        </div>
        <div className="flex items-end gap-1 h-40">
          {hourlyStats.map((stat) => (
            <div
              key={stat.hour}
              className="flex-1 flex flex-col items-center"
              title={`${stat.hour}시: ${stat.count}회`}
            >
              <div
                className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
                style={{
                  height: `${(stat.count / maxHourlyCount) * 100}%`,
                  minHeight: stat.count > 0 ? '4px' : '0',
                }}
              />
              <span className="text-xs text-gray-400 mt-1">{stat.hour}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900">최근 14일 방문 추이</h2>
        </div>
        <div className="flex items-end gap-2 h-48">
          {dailyStats.map((stat) => (
            <div
              key={stat.date}
              className="flex-1 flex flex-col items-center"
              title={`${stat.date}: ${stat.views}회 (방문자 ${stat.unique_visitors}명)`}
            >
              <div
                className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                style={{
                  height: `${(stat.views / maxDailyViews) * 100}%`,
                  minHeight: stat.views > 0 ? '4px' : '0',
                }}
              />
              <span className="text-xs text-gray-400 mt-1 rotate-[-45deg] origin-top-left whitespace-nowrap">
                {stat.date.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">인기 페이지 (7일)</h2>
          <div className="space-y-3">
            {topPages.length > 0 ? (
              topPages.map((page, index) => (
                <div key={page.path} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{page.path}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary-600">{formatNumber(page.views)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">데이터가 없습니다</p>
            )}
          </div>
        </motion.div>

        {/* Top Referrers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">유입 경로 (7일)</h2>
          <div className="space-y-3">
            {topReferrers.length > 0 ? (
              topReferrers.map((ref, index) => (
                <div key={ref.referrer} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-gray-900 truncate">{ref.referrer}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary-600">{formatNumber(ref.count)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">직접 방문이 대부분입니다</p>
            )}
          </div>
        </motion.div>

        {/* Device Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">기기별 방문 (7일)</h2>
          <div className="space-y-3">
            {deviceStats.map((device) => {
              const total = deviceStats.reduce((sum, d) => sum + d.count, 0);
              const percentage = total > 0 ? Math.round((device.count / total) * 100) : 0;
              return (
                <div key={device.device_type} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                    {getDeviceIcon(device.device_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{getDeviceLabel(device.device_type)}</span>
                      <span className="text-sm text-gray-500">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Browser Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">브라우저별 방문 (7일)</h2>
          <div className="space-y-3">
            {browserStats.slice(0, 5).map((browser) => {
              const total = browserStats.reduce((sum, b) => sum + b.count, 0);
              const percentage = total > 0 ? Math.round((browser.count / total) * 100) : 0;
              return (
                <div key={browser.browser} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{browser.browser}</span>
                      <span className="text-sm text-gray-500">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Google Analytics Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-gray-50 rounded-2xl p-6 text-center"
      >
        <p className="text-gray-600 mb-3">더 자세한 통계는 Google Analytics에서 확인하세요</p>
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Google Analytics 열기
        </a>
      </motion.div>
    </div>
  );
}
