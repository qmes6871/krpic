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
import { EnrollmentWithProgress, VideoType, AdditionalVideoRequirement } from '@/types/learning';
import { updateVideoProgress, updateAdditionalVideoProgress, markCourseCompleted, getCommonVideoUrls } from '@/lib/enrollments/actions';
import CertificateGenerator from '@/components/certificate/CertificateGenerator';

interface Props {
  course: PublicCourse;
  category?: Category;
  enrollment: EnrollmentWithProgress;
  commonVideoUrls: { cbt: string; law: string };
}

// 비디오별 상태 타입
interface VideoState {
  currentTime: number;
  duration: number;
  maxWatched: number;
  progress: number;
}

export default function LearnPageContent({ course, category, enrollment: initialEnrollment, commonVideoUrls }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 현재 활성 비디오 탭
  const [activeVideoTab, setActiveVideoTab] = useState<VideoType>('main');

  // 메인 비디오 상태
  const [mainVideo, setMainVideo] = useState<VideoState>({
    currentTime: initialEnrollment.lastWatchedPosition || 0,
    duration: initialEnrollment.videoDurationSeconds || 0,
    maxWatched: initialEnrollment.maxWatchedPosition || 0,
    progress: initialEnrollment.progressPercentage || 0,
  });

  // CBT 비디오 상태
  const [cbtVideo, setCbtVideo] = useState<VideoState>({
    currentTime: initialEnrollment.cbtLastPosition || 0,
    duration: initialEnrollment.cbtDuration || 0,
    maxWatched: initialEnrollment.cbtMaxPosition || 0,
    progress: initialEnrollment.cbtDuration > 0
      ? Math.round((initialEnrollment.cbtMaxPosition / initialEnrollment.cbtDuration) * 100)
      : 0,
  });

  // 준법의식 비디오 상태
  const [lawVideo, setLawVideo] = useState<VideoState>({
    currentTime: initialEnrollment.lawLastPosition || 0,
    duration: initialEnrollment.lawDuration || 0,
    maxWatched: initialEnrollment.lawMaxPosition || 0,
    progress: initialEnrollment.lawDuration > 0
      ? Math.round((initialEnrollment.lawMaxPosition / initialEnrollment.lawDuration) * 100)
      : 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialEnrollment.status === 'completed');
  const [certificateNumber, setCertificateNumber] = useState(initialEnrollment.certificateNumber || '');
  const [showCertificate, setShowCertificate] = useState(false);
  const [error, setError] = useState('');
  const [videoError, setVideoError] = useState('');

  // 현재 활성 비디오 상태 가져오기
  const getCurrentVideoState = () => {
    switch (activeVideoTab) {
      case 'cbt': return cbtVideo;
      case 'law': return lawVideo;
      default: return mainVideo;
    }
  };

  // 현재 활성 비디오 상태 설정하기
  const setCurrentVideoState = (updater: (prev: VideoState) => VideoState) => {
    switch (activeVideoTab) {
      case 'cbt': setCbtVideo(updater); break;
      case 'law': setLawVideo(updater); break;
      default: setMainVideo(updater); break;
    }
  };

  // 현재 활성 비디오 URL 가져오기
  const getCurrentVideoUrl = () => {
    switch (activeVideoTab) {
      case 'cbt': return commonVideoUrls.cbt;
      case 'law': return commonVideoUrls.law;
      default: return initialEnrollment.videoUrl;
    }
  };

  // 추가 영상 요구사항
  const videoRequirement = initialEnrollment.additionalVideoRequirement || 'none';

  // 전체 진도율 계산 (영상 요구사항에 따라)
  const getTotalProgress = () => {
    if (videoRequirement === 'none') {
      return mainVideo.progress;
    }
    if (videoRequirement === 'cbt-only') {
      // 2개 영상 모두 98% 이상이면 100%로 표시
      if (mainVideo.progress >= 98 && cbtVideo.progress >= 98) {
        return 100;
      }
      return Math.round((mainVideo.progress + cbtVideo.progress) / 2);
    }
    // 'all' - 3개 영상 모두 98% 이상이면 100%로 표시
    if (mainVideo.progress >= 98 && cbtVideo.progress >= 98 && lawVideo.progress >= 98) {
      return 100;
    }
    return Math.round((mainVideo.progress + cbtVideo.progress + lawVideo.progress) / 3);
  };

  // 모든 영상 시청 완료 여부
  const isAllVideosCompleted = () => {
    if (videoRequirement === 'none') {
      return mainVideo.progress >= 98;
    }
    if (videoRequirement === 'cbt-only') {
      return mainVideo.progress >= 98 && cbtVideo.progress >= 98;
    }
    // 'all'
    return mainVideo.progress >= 98 && cbtVideo.progress >= 98 && lawVideo.progress >= 98;
  };

  // 준법의식 영상 필요 여부
  const needsLawVideo = videoRequirement === 'all';

  // 진도 저장 함수 (debounced)
  const saveProgress = useCallback(async (currentPos: number, maxPos: number, dur: number, videoType: VideoType) => {
    if (progressSaveTimeoutRef.current) {
      clearTimeout(progressSaveTimeoutRef.current);
    }

    progressSaveTimeoutRef.current = setTimeout(async () => {
      await updateAdditionalVideoProgress(initialEnrollment.id, videoType, currentPos, maxPos, dur);
    }, 5000); // 5초마다 저장
  }, [initialEnrollment.id]);

  // 비디오 이벤트 핸들러
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const current = video.currentTime;
    const videoDuration = video.duration || 0;

    // 현재 활성 비디오 상태 업데이트
    setCurrentVideoState((prev) => {
      const newMaxWatched = Math.max(prev.maxWatched, current);
      const newProgress = videoDuration > 0 ? Math.round((newMaxWatched / videoDuration) * 100) : 0;

      // 진도 저장
      saveProgress(current, newMaxWatched, videoDuration, activeVideoTab);

      return {
        currentTime: current,
        duration: videoDuration,
        maxWatched: newMaxWatched,
        progress: newProgress,
      };
    });
  }, [activeVideoTab, saveProgress]);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    const videoDuration = videoRef.current.duration;

    // 현재 활성 비디오 상태 업데이트
    setCurrentVideoState((prev) => ({
      ...prev,
      duration: videoDuration,
    }));

    // 마지막 시청 위치로 이동 (끝에서 5초 이전이면 그대로, 끝이면 처음부터)
    const currentVideoState = getCurrentVideoState();
    if (currentVideoState.currentTime > 0 && currentVideoState.currentTime < videoDuration - 5) {
      videoRef.current.currentTime = currentVideoState.currentTime;
    }
  }, [activeVideoTab]);

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
    const currentVideoState = getCurrentVideoState();
    // 최대 시청 위치까지만 이동 가능
    const seekTime = Math.min(time, currentVideoState.maxWatched + 10); // 10초 여유
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentVideoState((prev) => ({ ...prev, currentTime: seekTime }));
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentVideoState((prev) => ({ ...prev, currentTime: 0 }));
      handlePlay();
    }
  };

  const handleVideoEnded = async () => {
    setIsPlaying(false);
    const currentVideoState = getCurrentVideoState();
    // 영상 끝까지 시청했으므로 max_watched를 duration으로 설정
    if (currentVideoState.duration > 0) {
      setCurrentVideoState((prev) => ({
        ...prev,
        maxWatched: prev.duration,
        progress: 100,
      }));
      await updateAdditionalVideoProgress(
        initialEnrollment.id,
        activeVideoTab,
        currentVideoState.duration,
        currentVideoState.duration,
        currentVideoState.duration
      );
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: VideoType) => {
    // 현재 비디오 일시정지
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setVideoError('');
    setActiveVideoTab(tab);
  };

  const handleVideoError = () => {
    setVideoError('비디오를 불러올 수 없습니다. 관리자에게 문의해주세요.');
  };

  // 수료 처리
  const handleComplete = async () => {
    if (!isAllVideosCompleted()) {
      const missingVideos = [];
      if (mainVideo.progress < 98) missingVideos.push('메인 영상');
      if (videoRequirement === 'cbt-only' || videoRequirement === 'all') {
        if (cbtVideo.progress < 98) missingVideos.push('인지행동개선훈련');
      }
      if (videoRequirement === 'all') {
        if (lawVideo.progress < 98) missingVideos.push('준법의식교육');
      }
      setError(`아직 시청하지 않은 영상이 있습니다: ${missingVideos.join(', ')}`);
      return;
    }

    setIsCompleting(true);
    setError('');

    // 수료 처리 전에 먼저 모든 영상의 진도율을 DB에 저장
    await updateAdditionalVideoProgress(
      initialEnrollment.id,
      'main',
      mainVideo.maxWatched,
      mainVideo.maxWatched,
      mainVideo.duration
    );

    if (videoRequirement === 'cbt-only' || videoRequirement === 'all') {
      await updateAdditionalVideoProgress(
        initialEnrollment.id,
        'cbt',
        cbtVideo.maxWatched,
        cbtVideo.maxWatched,
        cbtVideo.duration
      );
    }

    if (videoRequirement === 'all') {
      await updateAdditionalVideoProgress(
        initialEnrollment.id,
        'law',
        lawVideo.maxWatched,
        lawVideo.maxWatched,
        lawVideo.duration
      );
    }

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
        const currentVideoState = getCurrentVideoState();
        // 동기적으로 진도 저장 (best effort)
        updateAdditionalVideoProgress(
          initialEnrollment.id,
          activeVideoTab,
          videoRef.current.currentTime,
          currentVideoState.maxWatched,
          videoRef.current.duration || currentVideoState.duration
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
  }, [initialEnrollment.id, activeVideoTab, mainVideo, cbtVideo, lawVideo]);

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
                <div className="text-sm text-gray-400">전체 진도율</div>
                <div className="text-lg font-bold text-white">{getTotalProgress()}%</div>
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
            {/* Video Tabs (추가 영상이 필요한 코스만) */}
            {videoRequirement !== 'none' && (
              <div className="flex mb-4 bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => handleTabChange('main')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    activeVideoTab === 'main'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>메인 영상</span>
                    {mainVideo.progress >= 98 && <CheckCircle className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="text-xs mt-1 opacity-75">{mainVideo.progress}%</div>
                </button>
                <button
                  onClick={() => handleTabChange('cbt')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    activeVideoTab === 'cbt'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>인지행동개선훈련</span>
                    {cbtVideo.progress >= 98 && <CheckCircle className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="text-xs mt-1 opacity-75">{cbtVideo.progress}%</div>
                </button>
                {needsLawVideo && (
                  <button
                    onClick={() => handleTabChange('law')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                      activeVideoTab === 'law'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>준법의식교육</span>
                      {lawVideo.progress >= 98 && <CheckCircle className="w-4 h-4 text-green-400" />}
                    </div>
                    <div className="text-xs mt-1 opacity-75">{lawVideo.progress}%</div>
                  </button>
                )}
              </div>
            )}

            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              {/* Video Container */}
              <div className="relative aspect-video bg-gray-800">
                {getCurrentVideoUrl() ? (
                  <video
                    ref={videoRef}
                    key={activeVideoTab} // 탭 변경 시 비디오 리로드
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={handleVideoEnded}
                    onError={handleVideoError}
                    playsInline
                  >
                    <source src={getCurrentVideoUrl() || ''} type="video/mp4" />
                    브라우저가 비디오 재생을 지원하지 않습니다.
                  </video>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <AlertCircle className="w-16 h-16 text-gray-500 mb-4" />
                    <p className="text-gray-400 text-lg">비디오가 준비되지 않았습니다.</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {activeVideoTab === 'main'
                        ? '관리자가 영상을 업로드하면 시청할 수 있습니다.'
                        : '환경 설정에서 영상 URL을 설정해주세요.'}
                    </p>
                  </div>
                )}

                {videoError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/90 text-white">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <p className="text-red-400 text-lg">{videoError}</p>
                  </div>
                )}

                {/* Play Button Overlay */}
                {!isPlaying && getCurrentVideoUrl() && !videoError && (
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
              {getCurrentVideoUrl() && !videoError && (
                <div className="bg-gray-800 p-4">
                  {/* Progress Bar */}
                  <div className="relative mb-4">
                    {/* Watched Progress Background */}
                    <div
                      className="absolute top-0 left-0 h-2 bg-blue-900/50 rounded-full"
                      style={{ width: `${getCurrentVideoState().duration > 0 ? (getCurrentVideoState().maxWatched / getCurrentVideoState().duration) * 100 : 0}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max={getCurrentVideoState().duration || 100}
                      value={getCurrentVideoState().currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                      style={{
                        background: getCurrentVideoState().duration > 0
                          ? `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(getCurrentVideoState().currentTime / getCurrentVideoState().duration) * 100}%, #4B5563 ${(getCurrentVideoState().currentTime / getCurrentVideoState().duration) * 100}%, #4B5563 100%)`
                          : '#4B5563',
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
                        {formatTime(getCurrentVideoState().currentTime)} / {formatTime(getCurrentVideoState().duration)}
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

              {/* 전체 진도율 바 */}
              <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
                  style={{ width: `${getTotalProgress()}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-400">전체 진행률</span>
                <span className="text-white font-bold">{getTotalProgress()}%</span>
              </div>

              {/* 개별 영상 진도 (추가 영상 필요한 코스) */}
              {videoRequirement !== 'none' ? (
                <div className="space-y-3 pt-4 border-t border-gray-700">
                  {/* 메인 영상 */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        메인 영상
                        {mainVideo.progress >= 98 && <CheckCircle className="w-3 h-3 text-green-400" />}
                      </span>
                      <span className="text-white">{mainVideo.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${mainVideo.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* CBT 영상 */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        인지행동개선훈련
                        {cbtVideo.progress >= 98 && <CheckCircle className="w-3 h-3 text-green-400" />}
                      </span>
                      <span className="text-white">{cbtVideo.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${cbtVideo.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* 준법의식 영상 (all인 경우만) */}
                  {needsLawVideo && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400 flex items-center gap-1">
                          준법의식교육
                          {lawVideo.progress >= 98 && <CheckCircle className="w-3 h-3 text-green-400" />}
                        </span>
                        <span className="text-white">{lawVideo.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${lawVideo.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">시청 시간</span>
                    <span className="text-white">{formatTime(mainVideo.maxWatched)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">총 영상 길이</span>
                    <span className="text-white">{formatTime(mainVideo.duration)}</span>
                  </div>
                </div>
              )}
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
                  {isAllVideosCompleted() ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-10 h-10 text-blue-400" />
                      </div>
                      <p className="text-blue-400 font-bold mb-2">수료 가능!</p>
                      <p className="text-gray-400 text-sm mb-4">
                        {videoRequirement !== 'none'
                          ? '모든 영상을 100% 시청하셨습니다.'
                          : '영상을 100% 시청하셨습니다.'}
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
                      <p className="text-gray-400 mb-2">
                        {videoRequirement !== 'none'
                          ? '모든 영상을 100% 시청해주세요'
                          : '영상을 100% 시청해주세요'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        현재 진도율: {getTotalProgress()}%
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
