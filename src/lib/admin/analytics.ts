'use server';

import { createClient } from '@/lib/supabase/server';

export interface AnalyticsStats {
  todayViews: number;
  yesterdayViews: number;
  weekViews: number;
  monthViews: number;
  totalViews: number;
  todayUniqueVisitors: number;
  weekUniqueVisitors: number;
}

export interface PageStats {
  path: string;
  views: number;
}

export interface ReferrerStats {
  referrer: string;
  count: number;
}

export interface DeviceStats {
  device_type: string;
  count: number;
}

export interface BrowserStats {
  browser: string;
  count: number;
}

export interface HourlyStats {
  hour: number;
  count: number;
}

export interface DailyStats {
  date: string;
  views: number;
  unique_visitors: number;
}

// 기본 통계 조회
export async function getAnalyticsStats(): Promise<AnalyticsStats | null> {
  const supabase = await createClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString();

  const [
    { count: todayViews },
    { count: yesterdayViews },
    { count: weekViews },
    { count: monthViews },
    { count: totalViews },
    { data: todayUnique },
    { data: weekUnique },
  ] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', yesterdayStart).lt('created_at', todayStart),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('page_views').select('session_id').gte('created_at', todayStart),
    supabase.from('page_views').select('session_id').gte('created_at', weekStart),
  ]);

  const todayUniqueVisitors = new Set(todayUnique?.map(r => r.session_id)).size;
  const weekUniqueVisitors = new Set(weekUnique?.map(r => r.session_id)).size;

  return {
    todayViews: todayViews || 0,
    yesterdayViews: yesterdayViews || 0,
    weekViews: weekViews || 0,
    monthViews: monthViews || 0,
    totalViews: totalViews || 0,
    todayUniqueVisitors,
    weekUniqueVisitors,
  };
}

// 인기 페이지
export async function getTopPages(days: number = 7, limit: number = 10): Promise<PageStats[]> {
  const supabase = await createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('page_views')
    .select('path')
    .gte('created_at', startDate.toISOString());

  if (!data) return [];

  // 페이지별 카운트
  const pageCounts: Record<string, number> = {};
  data.forEach(row => {
    pageCounts[row.path] = (pageCounts[row.path] || 0) + 1;
  });

  return Object.entries(pageCounts)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

// 유입 경로
export async function getTopReferrers(days: number = 7, limit: number = 10): Promise<ReferrerStats[]> {
  const supabase = await createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('page_views')
    .select('referrer')
    .gte('created_at', startDate.toISOString())
    .not('referrer', 'is', null);

  if (!data) return [];

  // 리퍼러별 카운트
  const referrerCounts: Record<string, number> = {};
  data.forEach(row => {
    if (row.referrer) {
      try {
        const url = new URL(row.referrer);
        const domain = url.hostname;
        referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
      } catch {
        referrerCounts[row.referrer] = (referrerCounts[row.referrer] || 0) + 1;
      }
    }
  });

  return Object.entries(referrerCounts)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// 기기별 통계
export async function getDeviceStats(days: number = 7): Promise<DeviceStats[]> {
  const supabase = await createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('page_views')
    .select('device_type')
    .gte('created_at', startDate.toISOString());

  if (!data) return [];

  const deviceCounts: Record<string, number> = {};
  data.forEach(row => {
    const device = row.device_type || 'unknown';
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
  });

  return Object.entries(deviceCounts)
    .map(([device_type, count]) => ({ device_type, count }))
    .sort((a, b) => b.count - a.count);
}

// 브라우저별 통계
export async function getBrowserStats(days: number = 7): Promise<BrowserStats[]> {
  const supabase = await createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('page_views')
    .select('browser')
    .gte('created_at', startDate.toISOString());

  if (!data) return [];

  const browserCounts: Record<string, number> = {};
  data.forEach(row => {
    const browser = row.browser || 'Unknown';
    browserCounts[browser] = (browserCounts[browser] || 0) + 1;
  });

  return Object.entries(browserCounts)
    .map(([browser, count]) => ({ browser, count }))
    .sort((a, b) => b.count - a.count);
}

// 시간대별 통계 (오늘)
export async function getHourlyStats(): Promise<HourlyStats[]> {
  const supabase = await createClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const { data } = await supabase
    .from('page_views')
    .select('created_at')
    .gte('created_at', todayStart);

  if (!data) return [];

  const hourlyCounts: Record<number, number> = {};
  for (let i = 0; i < 24; i++) {
    hourlyCounts[i] = 0;
  }

  data.forEach(row => {
    const hour = new Date(row.created_at).getHours();
    hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
  });

  return Object.entries(hourlyCounts)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => a.hour - b.hour);
}

// 일별 통계 (최근 N일)
export async function getDailyStats(days: number = 14): Promise<DailyStats[]> {
  const supabase = await createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('page_views')
    .select('created_at, session_id')
    .gte('created_at', startDate.toISOString());

  if (!data) return [];

  const dailyData: Record<string, { views: number; sessions: Set<string> }> = {};

  data.forEach(row => {
    const date = new Date(row.created_at).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = { views: 0, sessions: new Set() };
    }
    dailyData[date].views++;
    if (row.session_id) {
      dailyData[date].sessions.add(row.session_id);
    }
  });

  return Object.entries(dailyData)
    .map(([date, stats]) => ({
      date,
      views: stats.views,
      unique_visitors: stats.sessions.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// 실시간 방문자 (최근 5분)
export async function getRealtimeVisitors(): Promise<number> {
  const supabase = await createClient();

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('page_views')
    .select('session_id')
    .gte('created_at', fiveMinutesAgo);

  if (!data) return 0;

  return new Set(data.map(r => r.session_id)).size;
}
