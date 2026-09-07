import { Bookmark, Clock3, Play, UserRoundCheck, Video } from "lucide-react";
import { SafeAvatar } from "./SafeAvatar";
import { SafeVideo } from "./SafeVideo";
import { InspirationVideoActions } from "./InspirationVideoActions";

export type DashboardVideoCardData = {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  creatorId: string | null;
  creatorName: string;
  creatorAvatarUrl: string | null;
  category: string;
  platform: string;
  contentType: string;
  duration: string;
  createdAtLabel: string;
};

interface DashboardVideoCardProps {
  video: DashboardVideoCardData;
}

export function DashboardVideoCard({ video }: DashboardVideoCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:border-brand-red-200 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <SafeVideo
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          title={`${video.contentType} by ${video.creatorName}`}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-slate-950/45 text-white shadow-lg backdrop-blur-sm">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-slate-800 shadow-sm">
          {video.platform}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-[11px] font-bold text-white">
          <Clock3 className="h-3.5 w-3.5" />
          {video.duration}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <SafeAvatar
            src={video.creatorAvatarUrl}
            name={video.creatorName}
            alt={video.creatorName}
            className="h-10 w-10 border border-slate-200"
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-extrabold text-slate-950">{video.creatorName}</h2>
            <p className="mt-1 truncate text-xs font-semibold text-slate-500">{video.category}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-brand-red-100 bg-brand-red-50 px-2.5 py-1 text-[11px] font-extrabold text-brand-red-600">
            {video.contentType}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-500">
            {video.createdAtLabel}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <InspirationVideoActions
            videoId={video.id}
            creatorId={video.creatorId}
            saveIcon={<Bookmark className="h-3.5 w-3.5" />}
            shortlistIcon={<UserRoundCheck className="h-3.5 w-3.5" />}
            campaignIcon={<Video className="h-3.5 w-3.5" />}
          />
        </div>
      </div>
    </article>
  );
}
