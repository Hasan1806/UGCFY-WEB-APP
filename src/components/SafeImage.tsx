"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Image as ImageIcon } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
  useNextImage?: boolean;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = "/siya-avatar.png",
  className,
  useNextImage = true,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  const safeSrc = src || fallbackSrc;

  // Render a fallback UI block if completely broken or if placeholder is missing
  if (error || !safeSrc) {
    return (
      <div 
        className={`bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden ${className || ""}`}
        aria-label={alt || "Image missing"}
      >
        <ImageIcon className="h-6 w-6 text-slate-300" />
      </div>
    );
  }

  if (useNextImage) {
    return (
      <Image
        src={safeSrc}
        alt={alt || "Image"}
        className={className}
        onError={() => {
          console.warn(`[SafeImage] Failed to load Next Image: ${safeSrc}`);
          setError(true);
        }}
        {...props}
      />
    );
  }

  // Fallback to standard <img> if Next Image is explicitly bypassed
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={safeSrc}
      alt={alt || "Image"}
      className={className}
      onError={() => {
        console.warn(`[SafeImage] Failed to load <img>: ${safeSrc}`);
        setError(true);
      }}
      {...(props as unknown as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
}
