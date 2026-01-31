'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  ClipboardList,
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { getDashboardStats } from '@/lib/admin/actions';
import { DashboardStats } from '@/types/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700'
    };
    const labels: Record<string, string> = {
      pending: '대기중',
      approved: '승인',
      rejected: '거절',
      completed: '완료'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500">KRPIC 관리 현황을 확인하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">전체 회원</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalMembers ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link href="/admin/members" className="flex items-center gap-1 text-sm text-blue-600 mt-4 hover:underline">
            회원 관리 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">교육 프로그램</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalCourses ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <Link href="/admin/courses" className="flex items-center gap-1 text-sm text-green-600 mt-4 hover:underline">
            프로그램 관리 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">전체 수강 신청</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalEnrollments ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <Link href="/admin/enrollments" className="flex items-center gap-1 text-sm text-purple-600 mt-4 hover:underline">
            신청 관리 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">대기중 신청</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.pendingEnrollments ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <Link href="/admin/enrollments?status=pending" className="flex items-center gap-1 text-sm text-yellow-600 mt-4 hover:underline">
            대기 목록 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">최근 가입 회원</h2>
              <Link href="/admin/members" className="text-sm text-primary-600 hover:underline">
                전체 보기
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats?.recentMembers && stats.recentMembers.length > 0 ? (
              stats.recentMembers.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{member.name || '이름 없음'}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  <p className="text-sm text-gray-400">{formatDate(member.created_at)}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                가입한 회원이 없습니다
              </div>
            )}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">최근 수강 신청</h2>
              <Link href="/admin/enrollments" className="text-sm text-primary-600 hover:underline">
                전체 보기
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats?.recentEnrollments && stats.recentEnrollments.length > 0 ? (
              stats.recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{enrollment.user?.name || '이름 없음'}</p>
                    {getStatusBadge(enrollment.status)}
                  </div>
                  <p className="text-sm text-gray-500">{enrollment.course?.title || '프로그램 없음'}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(enrollment.created_at)}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                수강 신청이 없습니다
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
