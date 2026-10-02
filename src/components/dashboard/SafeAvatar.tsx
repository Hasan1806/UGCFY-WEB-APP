"use client";

import React, { useState, useEffect } from "react";
import { normalizeImageUrl, getInitials } from "@/lib/shared/normalizeImage";

export type SafeAvatarProps = {
  src?: string | null;
  name?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

export function SafeAvatar({
  src,
  name,
  alt,
  size = "md",
  className = "",
}: SafeAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const safeSrc = normalizeImageUrl(src);
  const isFailed = Boolean(safeSrc && failedSrc === safeSrc);

  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
        ? "h-16 w-16 text-lg"
        : size === "xl"
        ? "h-32 w-32 text-3xl"
        : "h-10 w-10 text-sm";

  if (!safeSrc || isFailed) {
    return (
      <div
        className={`${sizeClass} ${className} flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 font-semibold text-gray-700 select-none`}
        aria-label={alt ?? name ?? "Avatar"}
        role="img"
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={safeSrc}
      src={safeSrc}
      alt={alt ?? name ?? "Avatar"}
      className={`${sizeClass} ${className} shrink-0 rounded-full object-cover`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(safeSrc)}
    />
  );
}
