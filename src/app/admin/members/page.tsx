'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { getMembers, updateMember, deleteMember, updateMemberPassword } from '@/lib/admin/actions';
import { Profile } from '@/types/admin';

export default function MembersPage() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAdmin, setFilterAdmin] = useState<'all' | 'admin' | 'user'>('all');
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    let filtered = members;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name?.toLowerCase().includes(query) ||
          m.email?.toLowerCase().includes(query) ||
          m.phone?.includes(query)
      );
    }

    if (filterAdmin === 'admin') {
      filtered = filtered.filter((m) => m.is_admin);
    } else if (filterAdmin === 'user') {
      filtered = filtered.filter((m) => !m.is_admin);
    }

    setFilteredMembers(filtered);
  }, [members, searchQuery, filterAdmin]);

  const loadMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to load members:', error);
      setMessage({ type: 'error', text: '회원 목록을 불러오는데 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleToggleAdmin = async (member: Profile) => {
    setActionLoading(true);
    const result = await updateMember(member.id, { is_admin: !member.is_admin });
    if (result.success) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, is_admin: !m.is_admin } : m))
      );
      setMessage({ type: 'success', text: `${member.name || '회원'}의 관리자 권한이 ${member.is_admin ? '해제' : '부여'}되었습니다.` });
    } else {
      setMessage({ type: 'error', text: result.error || '권한 변경에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const handleUpdateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMember) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string
    };

    setActionLoading(true);
    const result = await updateMember(selectedMember.id, updates);
    if (result.success) {
      setMembers((prev) =>
        prev.map((m) => (m.id === selectedMember.id ? { ...m, ...updates } : m))
      );
      setShowEditModal(false);
      setMessage({ type: 'success', text: '회원 정보가 수정되었습니다.' });
    } else {
      setMessage({ type: 'error', text: result.error || '수정에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;

    setActionLoading(true);
    const result = await deleteMember(selectedMember.id);
    if (result.success) {
      setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
      setShowDeleteModal(false);
      setMessage({ type: 'success', text: '회원이 삭제되었습니다.' });
    } else {
      setMessage({ type: 'error', text: result.error || '삭제에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (!selectedMember || !newPassword) return;

    setActionLoading(true);
    const result = await updateMemberPassword(selectedMember.id, newPassword);
    if (result.success) {
      setShowPasswordModal(false);
      setNewPassword('');
      setShowPassword(false);
      setMessage({ type: 'success', text: `${selectedMember.name || '회원'}의 비밀번호가 변경되었습니다.` });
    } else {
      setMessage({ type: 'error', text: result.error || '비밀번호 변경에 실패했습니다.' });
    }
    setActionLoading(false);
  };

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
              message.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
        <p className="text-gray-500">가입한 회원을 관리합니다</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름, 이메일, 전화번호로 검색..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterAdmin('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filterAdmin === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilterAdmin('admin')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filterAdmin === 'admin'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            관리자
          </button>
          <button
            onClick={() => setFilterAdmin('user')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filterAdmin === 'user'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            일반 회원
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">회원</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">연락처</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">가입일</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">권한</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name || '이름 없음'}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {member.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(member.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      {member.is_admin ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          <Shield className="w-4 h-4" />
                          관리자
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                          일반 회원
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleAdmin(member)}
                          disabled={actionLoading}
                          className={`p-2 rounded-lg transition-colors ${
                            member.is_admin
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-primary-600 hover:bg-primary-50'
                          }`}
                          title={member.is_admin ? '관리자 권한 해제' : '관리자 권한 부여'}
                        >
                          {member.is_admin ? <ShieldOff className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setShowEditModal(true);
                          }}
                          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                          title="정보 수정"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setNewPassword('');
                            setShowPassword(false);
                            setShowPasswordModal(true);
                          }}
                          className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                          title="비밀번호 변경"
                        >
                          <Key className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="회원 삭제"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || filterAdmin !== 'all'
                      ? '검색 결과가 없습니다'
                      : '가입한 회원이 없습니다'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Count */}
      <p className="text-sm text-gray-500 text-center">
        총 {filteredMembers.length}명의 회원
      </p>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">회원 정보 수정</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    이메일 (변경 불가)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={selectedMember.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    이름
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedMember.name || ''}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    전화번호
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={selectedMember.phone || ''}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? '저장 중...' : '저장'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">회원 삭제</h2>
                <p className="text-gray-500 mb-6">
                  <strong>{selectedMember.name || selectedMember.email}</strong>님을 정말 삭제하시겠습니까?<br />
                  이 작업은 되돌릴 수 없습니다.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleDeleteMember}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">비밀번호 변경</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  <strong>{selectedMember.name || '이름 없음'}</strong>
                </p>
                <p className="text-sm text-gray-500">{selectedMember.email}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    새 비밀번호
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호 입력 (최소 6자)"
                      className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleUpdatePassword}
                    disabled={actionLoading || newPassword.length < 6}
                    className="flex-1 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? '변경 중...' : '변경'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
