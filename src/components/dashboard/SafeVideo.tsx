import { Film } from "lucide-react";

interface SafeVideoProps {
  src?: string | null;
  poster?: string | null;
  title?: string;
  className?: string;
}

export function SafeVideo({ src, poster, title = "Video preview", className = "" }: SafeVideoProps) {
  const safeSrc = typeof src === "string" && src.trim().length > 0 ? src.trim() : null;
  const safePoster = typeof poster === "string" && poster.trim().length > 0 ? poster.trim() : undefined;

  if (!safeSrc) {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center bg-slate-100 text-center ${className}`}>
        <Film className="h-8 w-8 text-slate-300" />
        <p className="mt-3 px-4 text-xs font-bold text-slate-500">Video unavailable</p>
      </div>
    );
  }

  return (
    <video
      src={safeSrc}
      poster={safePoster}
      controls
      playsInline
      preload="metadata"
      className={`h-full w-full object-cover ${className}`}
      aria-label={title}
    />
  );
}
