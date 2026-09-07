"use client";

import React, { useRef } from "react";
import { PlusCircle, Bookmark, Share2, MessageCircle, Play } from "lucide-react";

type VideoProps = {
  id: number;
  src: string;
  views: string;
};

export default function PortfolioVideo({ video }: { video: VideoProps }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div 
      className="relative aspect-[9/16] bg-gray-100 rounded-xl overflow-hidden group cursor-pointer shadow-sm border border-gray-200/50"
      onMouseEnter={() => {
        const video = videoRef.current;
        if (!video) return;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            if (error.name !== 'AbortError') {
              console.error("Play error:", error);
            }
          });
        }
      }}
      onMouseLeave={() => {
        const video = videoRef.current;
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      }}
    >
      <video 
        ref={videoRef}
        key={video.src}
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
        <source src={video.src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay with Views */}
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5 z-10">
        <Play className="w-3 h-3 text-white fill-white" />
        <span className="text-[10px] font-bold text-white">{video.views}</span>
      </div>
      
      {/* Action Overlay */}
      <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 backdrop-blur-md transition-all duration-300 flex flex-col justify-end p-4 z-20">
        {/* Actions Stacked on Bottom */}
        <div className="flex items-center justify-center gap-5 text-white pb-2">
          <button className="hover:text-red-400 transition-colors cursor-pointer" title="Add to Campaign">
            <PlusCircle className="h-6 w-6" />
          </button>
          <button className="hover:text-red-400 transition-colors cursor-pointer" title="Save">
            <Bookmark className="h-6 w-6" />
          </button>
          <button className="hover:text-red-400 transition-colors cursor-pointer" title="Share">
            <Share2 className="h-6 w-6" />
          </button>
          <button className="hover:text-red-400 transition-colors cursor-pointer" title="Message">
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
