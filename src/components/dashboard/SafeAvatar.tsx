import React from "react";
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
  const safeSrc = normalizeImageUrl(src);

  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
        ? "h-16 w-16 text-lg"
        : size === "xl"
        ? "h-32 w-32 text-3xl"
        : "h-10 w-10 text-sm";

  if (!safeSrc) {
    return (
      <div
        className={`${sizeClass} ${className} flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700`}
        aria-label={alt ?? name ?? "Avatar"}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={safeSrc}
      alt={alt ?? name ?? "Avatar"}
      className={`${sizeClass} ${className} shrink-0 rounded-full object-cover`}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
