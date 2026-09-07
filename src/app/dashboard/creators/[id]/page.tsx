import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { 
  BadgeCheck, MapPin, Star
} from "lucide-react";
import { SafeAvatar } from "@/components/dashboard/SafeAvatar";
import PortfolioVideo from "./PortfolioVideo";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CreatorProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  const creator = profile;
  
  if (!creator) {
    notFound();
  }

  if (!creator) {
    notFound();
  }

  const fullName = creator.full_name || "Priya Desai";
  const avatarUrl = creator.avatar_url || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6";
  const location = creator.location || "India";
  const bio = creator.bio || "Creating high quality UGC content for premium brands.";

  // TODO: Fetch from portfolio_media table
  const MOCK_PORTFOLIO: { id: number; src: string; views: string }[] = [];

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 bg-transparent">
      
      {/* Header/Banner Container */}
      <div className="relative">
        {/* Mesh Gradient Banner with Animated Blobs */}
        <div className="relative w-full h-48 md:h-64 bg-gray-50 rounded-b-3xl overflow-hidden flex items-center justify-center">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Avatar */}
        <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full border-4 border-white shadow-xl z-10 overflow-hidden bg-white">
          <SafeAvatar
            src={avatarUrl}
            name={fullName}
            alt={fullName}
            className="h-full w-full border-0"
          />
        </div>
      </div>

      {/* Identity & Bio */}
      <div className="mt-20 px-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          {fullName}
          <BadgeCheck className="text-blue-500 w-6 h-6" />
        </h2>
        <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-1">
          <MapPin className="w-4 h-4" />
          {location}
        </p>
        <p className="text-base text-gray-600 leading-relaxed max-w-2xl mt-4">
          {bio}
        </p>
      </div>

      {/* Glassmorphic Metric Grid */}
      <div className="px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center backdrop-blur-md">
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mt-1">Campaigns Worked</p>
          </div>
          <div className="bg-white/80 border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center backdrop-blur-md">
            <p className="text-3xl font-bold text-gray-900">45</p>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mt-1">Times Shortlisted</p>
          </div>
          <div className="bg-white/80 border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center backdrop-blur-md">
            <p className="text-3xl font-bold text-gray-900 flex items-center gap-1">
              4.9 <Star className="text-yellow-500 fill-yellow-500 w-4 h-4" />
            </p>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mt-1">Brand Rating</p>
          </div>
        </div>
      </div>

      {/* Luxury Video Portfolio Grid */}
      <div className="px-8 mt-12">
        <h3 className="text-xl font-bold text-gray-900">Content Portfolio</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {MOCK_PORTFOLIO.map((video) => (
            <PortfolioVideo key={video.id} video={video} />
          ))}
        </div>
      </div>

    </div>
  );
}
