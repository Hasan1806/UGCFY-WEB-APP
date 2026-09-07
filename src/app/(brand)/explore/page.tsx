"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  Compass, 
  SlidersHorizontal,
  ArrowLeft,
  Play,
  Heart,
  Volume2,
  VolumeX,
  Plus,
  Check
} from "lucide-react";

// Optimized Cloudinary UGC assets
const DEMO_UGC_VIDEOS = [
  { id: "1", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558844/CN2466_H3_wlaaor.mp4", creator: "@sneha_ugc", category: "Beauty & Skincare", caption: "Premium serum daily hydration and morning glow wear test." },
  { id: "2", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558837/CN2466_H2_uckgsc.mp4", creator: "@rohit_creates", category: "Tech Unboxing", caption: "Next-gen mechanical keyboard click sounds and build overview." },
  { id: "3", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558830/CN2466_H1_i01seg.mp4", creator: "@tanvi_fits", category: "Fitness & Health", caption: "High intensity jump rope conditioning and stretching routine." },
  { id: "4", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558770/16_ajescr.mp4", creator: "@aman_vlogs", category: "Lifestyle & Travel", caption: "Aesthetic cafe hopping vlog in New Delhi with scenic edits." },
  { id: "5", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558781/20_bhwhb0.mp4", creator: "@ria_reviews", category: "Fashion Lookbook", caption: "Korean inspired minimal summer linen outfit styling tips." },
  { id: "6", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558796/22_qho17h.mp4", creator: "@kabir_digital", category: "Gadget Review", caption: "Noise cancelling earbud stress test and audio profiles." }
];

const filterPills = ["All", "Beauty & Skincare", "Tech Unboxing", "Fitness & Health", "Lifestyle & Travel", "Fashion Lookbook", "Gadget Review"];

interface VideoCardProps {
  video: typeof DEMO_UGC_VIDEOS[number];
  isLiked: boolean;
  isShortlisted: boolean;
  onToggleLike: (e: React.MouseEvent) => void;
  onToggleShortlist: (e: React.MouseEvent) => void;
}

function VideoCard({ video, isLiked, isShortlisted, onToggleLike, onToggleShortlist }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Hover autoplay blocked or delayed:", err));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[9/16] bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-300 select-none text-left"
    >
      {/* HTML5 Native Video Tag */}
      <video
        ref={videoRef}
        src={video.url}
        muted={isMuted}
        playsInline
        loop
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
      />

      {/* Dark gradient overlay bottom-to-top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10" />

      {/* Top action row */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
        <span className="text-[8px] font-bold bg-zinc-950/80 backdrop-blur-md text-zinc-300 px-2 py-0.5 rounded-full border border-white/5 uppercase tracking-wider">
          {video.category}
        </span>

        <div className="flex gap-2">
          {/* Mute Button */}
          <button 
            type="button"
            onClick={toggleMute}
            className="h-7 w-7 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5 text-brand-red-500" />}
          </button>

          {/* Like Button */}
          <button 
            type="button"
            onClick={onToggleLike}
            className="h-7 w-7 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <Heart className={`size-3.5 ${isLiked ? "fill-brand-red-500 text-brand-red-500" : "text-white"}`} />
          </button>
        </div>
      </div>

      {/* Play indicator bubble */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 group-hover:opacity-0 transition-opacity duration-300">
          <div className="size-10 rounded-full bg-brand-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-brand-red-600/25">
            <Play className="size-4 text-white fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Bottom details block */}
      <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex flex-col justify-end gap-2.5">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold text-white tracking-tight">
              {video.creator}
            </span>
            <span className="text-[8px] bg-blue-500 text-white rounded-full h-3 w-3 flex items-center justify-center font-bold">✓</span>
          </div>
          <p className="text-[9px] text-zinc-300 font-semibold leading-relaxed line-clamp-2">
            {video.caption}
          </p>
        </div>

        {/* Shortlist Action */}
        <button
          onClick={onToggleShortlist}
          className={`w-full py-2 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border select-none ${
            isShortlisted
              ? "bg-emerald-600/90 border-emerald-500 text-white hover:bg-emerald-700"
              : "bg-brand-red-600/90 border-brand-red-500 hover:bg-brand-red-700 text-white shadow-md shadow-brand-red-600/15"
          }`}
        >
          {isShortlisted ? (
            <>
              <Check className="size-3 stroke-[3]" />
              <span>Shortlisted!</span>
            </>
          ) : (
            <>
              <Plus className="size-3" />
              <span>Shortlist Creator</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function StandaloneExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(true);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  const handleToggleLike = (id: string) => {
    setLikedIds((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleShortlist = (id: string) => {
    setShortlistedIds((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Filter videos based on search and category
  const filteredVideos = DEMO_UGC_VIDEOS.filter((video) => {
    const matchesSearch = 
      video.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.caption.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeFilter === "All" || video.category === activeFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-zinc-100 pb-16 selection:bg-brand-red-100 select-none overflow-x-hidden">
      
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 w-full bg-[#0A0A0F]/90 backdrop-blur-md border-b border-zinc-900 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="p-2 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 rounded-xl text-zinc-400 hover:text-white transition flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <span>Brand Portal</span>
              <span>/</span>
              <span className="text-brand-red-500 font-extrabold">Explore Feed</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-brand-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm tracking-tighter">U</span>
            </div>
            <span className="font-extrabold text-md tracking-tight text-white hidden sm:inline">
              UGC<span className="text-brand-red-600">FY</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-6">
        
        {/* Title */}
        <div className="space-y-4 text-left">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Compass className="h-7 w-7 text-brand-red-500 animate-pulse" />
              <span>Explore Feed</span>
            </h1>
            <p className="text-zinc-400 text-xs mt-1 font-semibold">
              Browse top trending 9:16 UGC video creators and shortlist deliverables.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center w-full max-w-2xl bg-[#0D0D12] border border-zinc-850 rounded-xl shadow-sm focus-within:border-brand-red-500/50 transition">
            <Search className="size-4 text-zinc-500 ml-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search niche, handle, or caption..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-3 pr-20 py-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none border-none"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="mr-3 flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold text-zinc-300 rounded-lg transition cursor-pointer select-none"
            >
              <SlidersHorizontal className="size-3" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Pills */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 pt-1">
                  {filterPills.map((pill) => {
                    const isSelected = activeFilter === pill;
                    return (
                      <button
                        key={pill}
                        onClick={() => setActiveFilter(pill)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition whitespace-nowrap cursor-pointer ${
                          isSelected 
                            ? "bg-brand-red-600 text-white shadow-md shadow-brand-red-600/25" 
                            : "bg-[#0D0D12] border border-zinc-850 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {pill}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 9:16 Video-Only Feed Grid */}
        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0D0D12] border border-zinc-850 rounded-3xl">
            <Compass className="h-10 w-10 text-zinc-700 animate-spin" style={{ animationDuration: "12s" }} />
            <p className="text-xs font-bold text-zinc-400 mt-4">No matching UGC video clips found</p>
            <p className="text-[10px] text-zinc-500 mt-1 font-semibold">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-6"
          >
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                isLiked={likedIds.includes(video.id)}
                isShortlisted={shortlistedIds.includes(video.id)}
                onToggleLike={() => handleToggleLike(video.id)}
                onToggleShortlist={() => handleToggleShortlist(video.id)}
              />
            ))}
          </motion.div>
        )}
      </main>

    </div>
  );
}
