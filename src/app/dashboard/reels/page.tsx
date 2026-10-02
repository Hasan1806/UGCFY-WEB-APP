"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Bookmark,
  Share2,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  Film,
  Loader2,
  ArrowRight,
  RotateCcw,
  Check,
  Music2,
  FolderOpen,
  MessageCircle,
  Send,
  MoreHorizontal,
  X,
  Flame,
  CheckCircle2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PlaybookAsset, PlaybookBoard } from "@/lib/playbook/client";

// Realistic Instagram stats generator for consistent look & feel
function getInstagramStats(token: string, index: number) {
  const hash =
    token.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + (index + 1) * 31;
  const viewsNum = 18000 + (hash % 160) * 1450;
  const likesNum = Math.floor(viewsNum * 0.086) + (hash % 35) * 16;
  const commentsNum = Math.floor(likesNum * 0.048) + (hash % 18) + 6;
  const sharesNum = Math.floor(likesNum * 0.075) + (hash % 25) + 12;

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return {
    views: formatNumber(viewsNum),
    likes: formatNumber(likesNum),
    comments: formatNumber(commentsNum),
    shares: formatNumber(sharesNum),
    rawLikes: likesNum,
  };
}

export default function ReelsPage() {
  const [reels, setReels] = useState<PlaybookAsset[]>([]);
  const [boards, setBoards] = useState<PlaybookBoard[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string>("fawvfzAFzUNYskeUnsn8K1Fq"); // default: Video Ads Inspiration By CN
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"feed" | "grid">("feed");

  // Reel Player State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState<Record<string, boolean>>({});

  // Video Element Ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const feedContainerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTime = useRef<number>(0);

  // Fetch Playbook Reels & Boards
  useEffect(() => {
    let isMounted = true;
    async function loadReels() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/reels?board=${encodeURIComponent(selectedBoard)}&include_boards=true`);
        const json = await res.json();
        if (isMounted && json.success) {
          setReels(json.data || []);
          if (json.boards && json.boards.length > 0) {
            setBoards(json.boards);
          }
          setCurrentIndex(0);
          setVideoProgress(0);
        }
      } catch (err) {
        console.error("Failed to load reels from Playbook:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadReels();
    return () => {
      isMounted = false;
    };
  }, [selectedBoard]);

  // Current reel
  const currentReel = reels[currentIndex] || null;
  const nextReel = reels[(currentIndex + 1) % reels.length] || null;
  const prevReel = reels[(currentIndex - 1 + reels.length) % reels.length] || null;

  // Video Playback URL resolution
  const getVideoUrl = useCallback((reel: PlaybookAsset | null) => {
    if (!reel) return "";
    if (reel.raw_url) return reel.raw_url;
    return `/api/reels/${reel.token}`;
  }, []);

  // Infinite Scroll Handlers
  const handleNext = useCallback(() => {
    if (reels.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reels.length);
    setVideoProgress(0);
    setIsPlaying(true);
  }, [reels.length]);

  const handlePrev = useCallback(() => {
    if (reels.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
    setVideoProgress(0);
    setIsPlaying(true);
  }, [reels.length]);

  // Keyboard navigation (ArrowUp, ArrowDown, Space, M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "feed") return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m") {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, viewMode]);

  // Mouse wheel scroll with throttling
  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== "feed") return;
    const now = Date.now();
    if (now - lastScrollTime.current < 550) return;

    if (e.deltaY > 35) {
      lastScrollTime.current = now;
      handleNext();
    } else if (e.deltaY < -35) {
      lastScrollTime.current = now;
      handlePrev();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const toggleLike = (token: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedReels((prev) => {
      const next = !prev[token];
      if (next) {
        setShowHeartBurst(true);
        setTimeout(() => setShowHeartBurst(false), 900);
      }
      return { ...prev, [token]: next };
    });
  };

  const toggleSave = (token: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedReels((prev) => ({ ...prev, [token]: !prev[token] }));
  };

  const toggleFollow = (creatorKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFollowing((prev) => ({ ...prev, [creatorKey]: !prev[creatorKey] }));
  };

  const handleDoubleClickVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentReel) {
      if (!likedReels[currentReel.token]) {
        toggleLike(currentReel.token);
      } else {
        setShowHeartBurst(true);
        setTimeout(() => setShowHeartBurst(false), 900);
      }
    }
  };

  const handleShare = async (reel: PlaybookAsset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedToken(reel.token);
      setTimeout(() => setCopiedToken(null), 2000);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (videoRef.current && videoRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVideoEnded = () => {
    handleNext();
  };

  // Format title / clean filename
  const formatTitle = (rawTitle: string) => {
    return rawTitle
      .replace(/\.(mp4|mov|webm|m4v|png|jpg|webp)$/i, "")
      .replace(/[-_]/g, " ")
      .trim();
  };

  const getThumbnail = (reel: PlaybookAsset) => {
    return (
      reel.thumbnails?.[0]?.url ||
      reel.display_url ||
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
    );
  };

  const currentStats = currentReel ? getInstagramStats(currentReel.token, currentIndex) : null;
  const creatorHandle = currentReel?.uploaded_by?.name
    ? currentReel.uploaded_by.name.toLowerCase().replace(/[^a-z0-9]/g, "")
    : "creatornavigator";

  return (
    <div className="space-y-4 pb-32 sm:pb-40 max-w-7xl mx-auto select-none">
      {/* ========================================================================= */}
      {/* SLEEK PROMINENT HEADER & CONTROLS                                         */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white px-6 py-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-brand-red-600 to-rose-400 flex items-center justify-center text-white shadow-sm shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Short-Form UGC Reels
              </h1>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs sm:text-sm font-extrabold border border-slate-200/60">
                {reels.length} Videos
              </span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-600 mt-1">
              Live video ads &amp; creator reels hosted on Playbook with seamless infinite playback.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Board Selector */}
          <div className="relative flex items-center min-w-[230px]">
            <FolderOpen className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="w-full appearance-none pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-brand-red-500/20 focus:border-brand-red-500 cursor-pointer shadow-2xs"
            >
              <option value="fawvfzAFzUNYskeUnsn8K1Fq">Video Ads Inspiration By CN</option>
              <option value="w5UH98nn7By9rHUSvza6MMQ8">Creator Navigator Portfolio</option>
              <option value="CuEnnW9jA7e5RrfyGBhUpw2x">CN Portfolio All Videos</option>
              <option value="YU71aPGMqVBY4tAQBSP9WC5s">Top Performing Ads</option>
              <option value="q2BpRRWL6UuUwB5q5Zeo14Sm">CN Ads Inspo Board</option>
              <option value="1Ft9nGi42Xi7auFpum3wfDWr">CN - Portfolio</option>
              <option value="all">All Playbook Videos</option>
              {boards
                .filter(
                  (b) =>
                    ![
                      "fawvfzAFzUNYskeUnsn8K1Fq",
                      "w5UH98nn7By9rHUSvza6MMQ8",
                      "CuEnnW9jA7e5RrfyGBhUpw2x",
                      "YU71aPGMqVBY4tAQBSP9WC5s",
                      "q2BpRRWL6UuUwB5q5Zeo14Sm",
                      "1Ft9nGi42Xi7auFpum3wfDWr",
                    ].includes(b.token)
                )
                .map((b) => (
                  <option key={b.token} value={b.token}>
                    {b.title}
                  </option>
                ))}
            </select>
          </div>

          {/* View Mode Toggle: Instagram Reel View vs Grid View */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("feed")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === "feed"
                  ? "bg-white text-brand-red-600 shadow-2xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Reel View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-white text-brand-red-600 shadow-2xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LOADING STATE                                                             */}
      {/* ========================================================================= */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[500px] rounded-3xl bg-white border border-slate-200/80 p-12 text-center">
          <Loader2 className="w-10 h-10 text-brand-red-600 animate-spin mb-4" />
          <h3 className="text-base font-extrabold text-slate-900">Loading Playbook Video Reels...</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Fetching video streams and preserving the exact sequence from your Playbook board.
          </p>
        </div>
      ) : reels.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-3xl bg-white border border-dashed border-slate-200 p-12 text-center">
          <Film className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-base font-extrabold text-slate-900">No videos found in this board</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Select another board from the dropdown to preview video ads.
          </p>
        </div>
      ) : viewMode === "feed" ? (
        /* ========================================================================= */
        /* INSTAGRAM FEED / PLAYER VIEW                                              */
        /* ========================================================================= */
        <div
          ref={feedContainerRef}
          onWheel={handleWheel}
          className="relative flex items-center justify-center outline-hidden select-none py-1"
        >
          {/* Main Reel Card Container (Instagram 9:16 mobile frame) */}
          <div className="relative w-auto h-[calc(100vh-230px)] min-h-[460px] max-h-[640px] aspect-[9/16] rounded-[28px] sm:rounded-[32px] bg-black shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] overflow-hidden border border-slate-800 flex items-center justify-center group ring-1 ring-white/10">
            {/* HTML5 Video Element */}
            {currentReel && (
              <video
                ref={videoRef}
                key={currentReel.token}
                src={getVideoUrl(currentReel)}
                poster={getThumbnail(currentReel)}
                autoPlay
                playsInline
                loop={false}
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onClick={togglePlay}
                onDoubleClick={handleDoubleClickVideo}
                className="w-full h-full object-cover cursor-pointer"
              />
            )}

            {/* Hidden Preload Elements for zero-lag instant scroll */}
            {nextReel && (
              <video src={getVideoUrl(nextReel)} preload="auto" muted className="hidden" />
            )}
            {prevReel && (
              <video src={getVideoUrl(prevReel)} preload="auto" muted className="hidden" />
            )}

            {/* Instagram Vignette Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/45 pointer-events-none" />

            {/* Animated Big Heart Burst on Double Tap */}
            <AnimatePresence>
              {showHeartBurst && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.4, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute pointer-events-none z-30"
                >
                  <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-[0_10px_30px_rgba(244,63,94,0.7)]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instagram Play / Pause Center Flash Indicator */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-2xs cursor-pointer z-20"
              >
                <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-950 shadow-2xl scale-110">
                  <Play className="w-8 h-8 fill-slate-950 translate-x-1" />
                </div>
              </div>
            )}

            {/* Top Bar: Sequence Indicator & Instagram Speaker Sound Toggle */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 text-white pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-sm font-black tracking-wider shadow-sm">
                <Film className="w-4 h-4 text-rose-400" />
                <span className="text-white">#{currentIndex + 1}</span>
                <span className="text-white/40">/</span>
                <span className="text-white/70">{reels.length}</span>
              </div>

              {/* Sound Toggle Circle (True Instagram Top Right Mute Button) */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                className="pointer-events-auto h-10 w-10 rounded-full bg-black/65 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/90 transition-all active:scale-95 shadow-md"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            {/* Right Action Rail (Instagram Exact Layout: Heart, Comment, Share, Bookmark, More, Audio Disc) */}
            {currentReel && currentStats && (
              <div className="absolute right-3.5 bottom-6 flex flex-col items-center gap-3.5 z-20 text-white">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={(e) => toggleLike(currentReel.token, e)}
                  className="flex flex-col items-center gap-1 group/btn"
                >
                  <div
                    className={`h-11 w-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      likedReels[currentReel.token]
                        ? "text-rose-500 scale-110"
                        : "text-white hover:text-rose-400 hover:scale-105"
                    }`}
                  >
                    <Heart
                      className={`w-7 h-7 drop-shadow-md transition-transform ${
                        likedReels[currentReel.token]
                          ? "fill-rose-500 scale-110"
                          : "group-hover/btn:scale-110"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight">
                    {likedReels[currentReel.token]
                      ? currentStats.rawLikes + 1
                      : currentStats.likes}
                  </span>
                </button>

                {/* Comment Button */}
                <button
                  type="button"
                  onClick={() => setShowCommentsDrawer((prev) => !prev)}
                  className="flex flex-col items-center gap-1 group/btn"
                >
                  <div className="h-11 w-11 rounded-full flex items-center justify-center text-white hover:text-slate-200 transition-all hover:scale-105">
                    <MessageCircle className="w-7 h-7 drop-shadow-md" />
                  </div>
                  <span className="text-sm font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight">
                    {currentStats.comments}
                  </span>
                </button>

                {/* Share Button (Paper Airplane) */}
                <button
                  type="button"
                  onClick={(e) => handleShare(currentReel, e)}
                  className="flex flex-col items-center gap-1 group/btn"
                >
                  <div className="h-11 w-11 rounded-full flex items-center justify-center text-white hover:text-slate-200 transition-all hover:scale-105">
                    {copiedToken === currentReel.token ? (
                      <Check className="w-6.5 h-6.5 text-emerald-400 drop-shadow-md" />
                    ) : (
                      <Send className="w-6.5 h-6.5 drop-shadow-md" />
                    )}
                  </div>
                  <span className="text-sm font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight">
                    {copiedToken === currentReel.token ? "Copied" : currentStats.shares}
                  </span>
                </button>

                {/* Save / Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => toggleSave(currentReel.token, e)}
                  className="flex flex-col items-center group/btn"
                >
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-white hover:text-amber-400 transition-all hover:scale-105">
                    <Bookmark
                      className={`w-6.5 h-6.5 drop-shadow-md ${
                        savedReels[currentReel.token] ? "fill-white text-white scale-110" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* More Options (Three Dots) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOptionsMenu((prev) => !prev);
                    }}
                    className="h-9 w-9 rounded-full flex items-center justify-center text-white hover:text-slate-200 transition-all"
                  >
                    <MoreHorizontal className="w-5.5 h-5.5 drop-shadow-md" />
                  </button>

                  <AnimatePresence>
                    {showOptionsMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 5 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 bottom-8 w-44 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/20 p-2 shadow-2xl z-40 text-xs font-bold"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            handleShare(currentReel);
                            setShowOptionsMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-left text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </button>
                        {currentReel.raw_url && (
                          <a
                            href={currentReel.raw_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-left text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        )}
                        <Link
                          href="/platform/discover"
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-rose-500/20 text-rose-300 text-left"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Hire Creator</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Rotating Vinyl Record (Instagram Sound Disc Animation) */}
                <div className="mt-1 h-10 w-10 rounded-full bg-slate-900 p-0.5 border-2 border-white/40 shadow-lg animate-spin [animation-duration:5s] flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getThumbnail(currentReel)}
                    alt="Audio track"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Bottom Overlay: Instagram Profile, Verified Badge, Caption & Audio Ticker */}
            {currentReel && (
              <div className="absolute bottom-5 inset-x-5 pr-16 z-20 text-white pointer-events-auto">
                {/* Creator Avatar & Handle Row */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  {/* Instagram Story Gradient Ring */}
                  <div className="p-[2px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md shrink-0">
                    <div className="h-9 w-9 rounded-full bg-black flex items-center justify-center text-white font-black text-xs overflow-hidden border border-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getThumbnail(currentReel)}
                        alt={creatorHandle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base font-black truncate drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] text-white">
                      @{creatorHandle}
                    </span>
                    <CheckCircle2 className="w-4.5 h-4.5 fill-blue-500 text-white shrink-0 drop-shadow-sm" />
                  </div>

                  <span className="text-white/60 text-sm">·</span>

                  {/* Instagram Follow / Hire Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFollow(creatorHandle, e)}
                    className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-black tracking-wide border transition-all ${
                      isFollowing[creatorHandle]
                        ? "bg-white text-black border-white shadow-sm"
                        : "bg-transparent text-white border-white/80 hover:bg-white/20 drop-shadow-sm"
                    }`}
                  >
                    {isFollowing[creatorHandle] ? "Following" : "Follow"}
                  </button>
                </div>

                {/* Caption / Title */}
                <p className="text-sm sm:text-base font-bold line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-white leading-snug">
                  {formatTitle(currentReel.title)}{" "}
                  <span className="text-rose-300 font-extrabold">#ugcad #viral</span>
                </p>

                {/* Audio Track Ticker */}
                <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm font-semibold text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  <Music2 className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
                  <span className="truncate">
                    Original audio · @{creatorHandle} · {currentStats?.views} views
                  </span>
                </div>
              </div>
            )}

            {/* Clickable Progress Bar at bottom edge */}
            <div
              onClick={handleProgressBarClick}
              className="absolute bottom-0 inset-x-0 h-1 bg-white/25 hover:h-2 transition-all cursor-pointer z-30"
            >
              <div
                className="h-full bg-brand-red-500 transition-all duration-100 ease-linear rounded-r-full shadow-sm"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>

          {/* Desktop Up / Down Float Controls */}
          <div className="hidden md:flex flex-col gap-2 ml-4 z-20">
            <button
              type="button"
              onClick={handlePrev}
              title="Previous Reel (Arrow Up)"
              className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-red-600 hover:border-brand-red-300 shadow-sm flex items-center justify-center transition-all active:scale-95"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              title="Next Reel (Arrow Down) - Loops Infinitely"
              className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-red-600 hover:border-brand-red-300 shadow-sm flex items-center justify-center transition-all active:scale-95"
            >
              <ChevronDown className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentIndex(0);
                setVideoProgress(0);
              }}
              title="Restart from First Video"
              className="h-10 w-10 rounded-xl bg-slate-900 text-white hover:bg-black shadow-sm flex items-center justify-center transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Instagram Comments Drawer (Slide-Over) */}
          <AnimatePresence>
            {showCommentsDrawer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center md:justify-end md:pr-12 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCommentsDrawer(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
                />

                <motion.div
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="pointer-events-auto relative w-full max-w-sm h-[75vh] rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 text-slate-900"
                >
                  {/* Comments Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-brand-red-600" />
                      <h3 className="text-base font-black text-slate-950">Comments &amp; Feedback</h3>
                      <span className="text-xs sm:text-sm text-slate-500 font-bold">
                        ({currentStats?.comments})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCommentsDrawer(false)}
                      className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Simulated High-Converting Creator Comments */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-rose-100 text-brand-red-600 font-black text-xs flex items-center justify-center shrink-0">
                        A
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 text-sm">
                          @adityabrand{" "}
                          <span className="font-normal text-slate-400 text-xs">12m ago</span>
                        </p>
                        <p className="text-slate-700 mt-1 leading-relaxed text-sm">
                          The opening hook at 0:02 has great pacing! Would love this style for our summer campaign.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 font-black text-xs flex items-center justify-center shrink-0">
                        S
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 text-sm">
                          @sneha_ugc{" "}
                          <span className="font-normal text-slate-400 text-xs">1h ago</span>
                        </p>
                        <p className="text-slate-700 mt-1 leading-relaxed text-sm">
                          Clean cut transitions and the audio mixing is crisp. 10/10 deliverable.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 font-black text-xs flex items-center justify-center shrink-0">
                        R
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 text-sm">
                          @rohit_d2c{" "}
                          <span className="font-normal text-slate-400 text-xs">3h ago</span>
                        </p>
                        <p className="text-slate-700 mt-1 leading-relaxed text-sm">
                          Can we adapt this script for Instagram Stories format as well?
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-medium outline-hidden focus:border-brand-red-500"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-brand-red-600 text-white rounded-xl text-sm font-bold hover:bg-brand-red-700 shadow-xs"
                    >
                      Post
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* ========================================================================= */
        /* TRUE INSTAGRAM REELS GRID VIEW                                            */
        /* ========================================================================= */
        <div className="space-y-4">
          {/* Subheader: Instagram Tab Style */}
          <div className="flex items-center justify-between px-1 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-6 text-sm font-extrabold tracking-wider uppercase">
              <span className="flex items-center gap-2 text-brand-red-600 border-b-2 border-brand-red-600 pb-3 -mb-3">
                <Film className="w-4 h-4" />
                <span>Reels ({reels.length})</span>
              </span>
              <span className="flex items-center gap-2 text-slate-400 hover:text-slate-700 cursor-pointer">
                <Flame className="w-4 h-4" />
                <span>Top Performing</span>
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-500">
              Click any card to play in full screen
            </span>
          </div>

          {/* The Instagram Reel Tiles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-3.5">
            {reels.map((reel, index) => {
              const stats = getInstagramStats(reel.token, index);
              const isLiked = !!likedReels[reel.token];
              const isSaved = !!savedReels[reel.token];
              const creator = reel.uploaded_by?.name
                ? reel.uploaded_by.name.toLowerCase().replace(/[^a-z0-9]/g, "")
                : "swarnika";

              return (
                <div
                  key={reel.token}
                  onClick={() => {
                    setCurrentIndex(index);
                    setViewMode("feed");
                  }}
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 cursor-pointer shadow-xs hover:shadow-2xl transition-all duration-300 hover:scale-[1.025] ring-1 ring-black/5"
                >
                  {/* Poster / Thumbnail image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getThumbnail(reel)}
                    alt={reel.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Instagram Gradient Vignette (Dark at bottom & top) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/35 pointer-events-none" />

                  {/* Top-Right: Instagram Reels Glyph Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10 text-white/90 drop-shadow-md">
                    <Film className="w-4.5 h-4.5" />
                  </div>

                  {/* Top-Left: Sequence Number Pill */}
                  <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-xs font-black text-white">
                    #{index + 1}
                  </div>

                  {/* Bottom-Left Overlay (Always Visible on Instagram Grid) */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-white pointer-events-none">
                    {/* View Count with Play Triangle */}
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white drop-shadow-sm" />
                      <span>{stats.views}</span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-white/95 truncate mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      @{creator}
                    </p>
                  </div>

                  {/* Desktop Hover Overlay: Instagram-exact Likes & Comments Count */}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white gap-2.5 p-3.5">
                    <div className="flex items-center gap-3.5">
                      {/* Likes */}
                      <div className="flex items-center gap-1.5 font-black text-sm sm:text-base drop-shadow-md">
                        <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white text-white" />
                        <span>{isLiked ? stats.rawLikes + 1 : stats.likes}</span>
                      </div>

                      {/* Comments */}
                      <div className="flex items-center gap-1.5 font-black text-sm sm:text-base drop-shadow-md">
                        <MessageCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white text-white" />
                        <span>{stats.comments}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-white/90 line-clamp-2 text-center px-1">
                      {formatTitle(reel.title)}
                    </p>

                    <div className="h-9 w-9 rounded-full bg-brand-red-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4.5 h-4.5 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
