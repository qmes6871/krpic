'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  ChevronLeft,
  Award,
  CheckCircle,
  Clock,
  BookOpen,
  AlertCircle,
  Loader2,
  Download,
} from 'lucide-react';
import { PublicCourse } from '@/lib/courses/actions';
import { Category } from '@/types';
import { EnrollmentWithProgress } from '@/types/learning';
import { updateVideoProgress, markCourseCompleted } from '@/lib/enrollments/actions';
import CertificateGenerator from '@/components/certificate/CertificateGenerator';

interface Props {
  course: PublicCourse;
  category?: Category;
  enrollment: EnrollmentWithProgress;
}

export default function LearnPageContent({ course, category, enrollment: initialEnrollment }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialEnrollment.lastWatchedPosition || 0);
  const [duration, setDuration] = useState(initialEnrollment.videoDurationSeconds || 0);
  const [maxWatched, setMaxWatched] = useState(initialEnrollment.maxWatchedPosition || 0);
  const [progress, setProgress] = useState(initialEnrollment.progressPercentage || 0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialEnrollment.status === 'completed');
  const [certificateNumber, setCertificateNumber] = useState(initialEnrollment.certificateNumber || '');
  const [showCertificate, setShowCertificate] = useState(false);
  const [error, setError] = useState('');
  const [videoError, setVideoError] = useState('');

  // 진도 저장 함수 (debounced)
  const saveProgress = useCallback(async (currentPos: number, maxPos: number, dur: number) => {
    if (progressSaveTimeoutRef.current) {
      clearTimeout(progressSaveTimeoutRef.current);
    }

    progressSaveTimeoutRef.current = setTimeout(async () => {
      await updateVideoProgress(initialEnrollment.id, currentPos, maxPos, dur);
    }, 5000); // 5초마다 저장
  }, [initialEnrollment.id]);

  // 비디오 이벤트 핸들러
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const current = video.currentTime;
    const videoDuration = video.duration || 0;

    setCurrentTime(current);

    // max_watched 업데이트 (새로 본 부분만)
    // 현재 위치가 max_watched보다 클 때만 업데이트
    const newMaxWatched = Math.max(maxWatched, current);
    if (newMaxWatched > maxWatched) {
      setMaxWatched(newMaxWatched);
    }

    // 진도율 계산
    const newProgress = videoDuration > 0 ? Math.round((newMaxWatched / videoDuration) * 100) : 0;
    setProgress(newProgress);

    // 진도 저장
    saveProgress(current, newMaxWatched, videoDuration);
  }, [maxWatched, saveProgress]);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    const videoDuration = videoRef.current.duration;
    setDuration(videoDuration);

    // 마지막 시청 위치로 이동 (끝에서 5초 이전이면 그대로, 끝이면 처음부터)
    if (initialEnrollment.lastWatchedPosition > 0 && initialEnrollment.lastWatchedPosition < videoDuration - 5) {
      videoRef.current.currentTime = initialEnrollment.lastWatchedPosition;
    }
  }, [initialEnrollment.lastWatchedPosition]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    // 최대 시청 위치까지만 이동 가능
    const seekTime = Math.min(time, maxWatched + 10); // 10초 여유
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      handlePlay();
    }
  };

  const handleVideoEnded = async () => {
    setIsPlaying(false);
    // 영상 끝까지 시청했으므로 max_watched를 duration으로 설정
    if (duration > 0) {
      setMaxWatched(duration);
      setProgress(100);
      await updateVideoProgress(initialEnrollment.id, duration, duration, duration);
    }
  };

  const handleVideoError = () => {
    setVideoError('비디오를 불러올 수 없습니다. 관리자에게 문의해주세요.');
  };

  // 수료 처리
  const handleComplete = async () => {
    if (progress < 98) {
      setError(`진도율이 ${progress}%입니다. 100% 시청 후 수료할 수 있습니다.`);
      return;
    }

    setIsCompleting(true);
    setError('');

    const result = await markCourseCompleted(initialEnrollment.id);

    if (result.success) {
      setIsCompleted(true);
      setCertificateNumber(result.certificateNumber || '');
    } else {
      setError(result.error || '수료 처리에 실패했습니다.');
    }

    setIsCompleting(false);
  };

  // 페이지 떠날 때 진도 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (videoRef.current) {
        // 동기적으로 진도 저장 (best effort)
        updateVideoProgress(
          initialEnrollment.id,
          videoRef.current.currentTime,
          maxWatched,
          videoRef.current.duration || duration
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (progressSaveTimeoutRef.current) {
        clearTimeout(progressSaveTimeoutRef.current);
      }
    };
  }, [initialEnrollment.id, maxWatched, duration]);

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 카테고리명 매핑
  const categoryNames: Record<string, string> = {
    'drunk-driving': '음주운전 재범방지',
    'drug': '마약류 재범방지',
    'violence': '폭력 재범방지',
    'theft': '절도 재범방지',
    'fraud': '사기 재범방지',
    'sexual-offense': '성범죄 재범방지',
    'juvenile': '소년범 재범방지',
    'detention': '구속 수감자 교육',
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/my-courses"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>내 강의실</span>
              </Link>
              <div className="h-6 w-px bg-gray-600" />
              <div>
                {category && (
                  <span className="text-xs text-blue-400">{category.name}</span>
                )}
                <h1 className="text-lg font-bold text-white">{course.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">진도율</div>
                <div className="text-lg font-bold text-white">{progress}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              {/* Video Container */}
              <div className="relative aspect-video bg-gray-800">
                {initialEnrollment.videoUrl ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={handleVideoEnded}
                    onError={handleVideoError}
                    playsInline
                  >
                    <source src={initialEnrollment.videoUrl} type="video/mp4" />
                    브라우저가 비디오 재생을 지원하지 않습니다.
                  </video>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <AlertCircle className="w-16 h-16 text-gray-500 mb-4" />
                    <p className="text-gray-400 text-lg">비디오가 준비되지 않았습니다.</p>
                    <p className="text-gray-500 text-sm mt-2">관리자가 영상을 업로드하면 시청할 수 있습니다.</p>
                  </div>
                )}

                {videoError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/90 text-white">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <p className="text-red-400 text-lg">{videoError}</p>
                  </div>
                )}

                {/* Play Button Overlay */}
                {!isPlaying && initialEnrollment.videoUrl && !videoError && (
                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group"
                  >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                  </button>
                )}
              </div>

              {/* Video Controls */}
              {initialEnrollment.videoUrl && !videoError && (
                <div className="bg-gray-800 p-4">
                  {/* Progress Bar */}
                  <div className="relative mb-4">
                    {/* Watched Progress Background */}
                    <div className="absolute top-0 left-0 h-2 bg-blue-900/50 rounded-full" style={{ width: `${(maxWatched / duration) * 100}%` }} />
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`,
                      }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={handleRestart}
                        className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                      <span className="text-white text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <button
                      onClick={handleFullscreen}
                      className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                학습 진행률
              </h3>

              {/* Progress Bar */}
              <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">진행률</span>
                <span className="text-white font-bold">{progress}%</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">시청 시간</span>
                  <span className="text-white">{formatTime(maxWatched)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">총 영상 길이</span>
                  <span className="text-white">{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* Completion Card */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                수료 현황
              </h3>

              {isCompleted ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <p className="text-green-400 font-bold text-lg mb-1">수료 완료!</p>
                  <p className="text-gray-400 text-sm mb-4">수료증 번호: {certificateNumber}</p>
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    수료증 다운로드
                  </button>
                </div>
              ) : (
                <div>
                  {progress >= 98 ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-10 h-10 text-blue-400" />
                      </div>
                      <p className="text-blue-400 font-bold mb-2">수료 가능!</p>
                      <p className="text-gray-400 text-sm mb-4">
                        영상을 100% 시청하셨습니다.
                      </p>
                      {error && (
                        <p className="text-red-400 text-sm mb-4">{error}</p>
                      )}
                      <button
                        onClick={handleComplete}
                        disabled={isCompleting}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-400 hover:to-blue-500 transition-all disabled:opacity-50"
                      >
                        {isCompleting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            처리 중...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            수료하기
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-10 h-10 text-gray-500" />
                      </div>
                      <p className="text-gray-400 mb-2">영상을 100% 시청해주세요</p>
                      <p className="text-gray-500 text-sm">
                        현재 진도율: {progress}%
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Course Info Card */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                교육 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">교육명</p>
                  <p className="text-white font-medium">{course.title}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">카테고리</p>
                  <p className="text-white font-medium">{category?.name || categoryNames[course.categoryId] || '교육'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">강사</p>
                  <p className="text-white font-medium">{course.instructor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateGenerator
          enrollmentId={initialEnrollment.id}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
