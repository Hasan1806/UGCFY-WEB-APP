"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";

export interface CreatorAvatarProps {
  src?: string | null;
  name?: string | null;
  username?: string | null;
  size?: number; // pixel size for width/height when not solely controlled by CSS
  className?: string;
  priority?: boolean;
  alt?: string;
}

/**
 * Extracts 1-2 uppercase characters from display name or username.
 * Supports Unicode strings and handles edge cases (emojis, punctuation, handles).
 */
export function getCreatorInitials(name?: string | null, username?: string | null): string {
  const cleanName = (name || "").trim();
  if (cleanName) {
    const parts = cleanName.split(/[\s._-]+/).filter(Boolean);
    const firstPart = parts[0];
    const lastPart = parts[parts.length - 1];
    if (parts.length >= 2 && firstPart && lastPart) {
      const first = firstPart.charAt(0);
      const last = lastPart.charAt(0);
      const initials = (first + last).toUpperCase();
      if (initials) return initials;
    } else if (parts.length === 1 && firstPart) {
      if (firstPart.length >= 2 && /[A-Z]/.test(firstPart.charAt(0)) && /[A-Z]/.test(firstPart.charAt(1))) {
        return (firstPart.charAt(0) + firstPart.charAt(1)).toUpperCase();
      }
      return (firstPart.charAt(0) || "C").toUpperCase();
    }
  }

  // Fallback to username
  const cleanUsername = (username || "").replace(/^@+/, "").trim();
  if (cleanUsername) {
    const parts = cleanUsername.split(/[\s._-]+/).filter(Boolean);
    const firstPart = parts[0];
    const secondPart = parts[1];
    if (parts.length >= 2 && firstPart && secondPart) {
      const first = firstPart.charAt(0);
      const second = secondPart.charAt(0);
      return (first + second).toUpperCase();
    }
    return (cleanUsername.charAt(0) || "C").toUpperCase();
  }

  return "UG";
}

const DEFAULT_AVATAR_STYLE = { bg: "bg-stone-100", text: "text-stone-700", border: "border-stone-200" };

/**
 * Generates deterministic, subtle pastel/neutral tone styles
 * to match UGCFY's premium dashboard aesthetics.
 */
function getDeterministicAvatarStyle(seed: string): { bg: string; text: string; border: string } {
  const PALETTES = [
    DEFAULT_AVATAR_STYLE,
    { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
    { bg: "bg-zinc-100", text: "text-zinc-700", border: "border-zinc-200" },
    { bg: "bg-neutral-100", text: "text-neutral-700", border: "border-neutral-200" },
    { bg: "bg-red-50", text: "text-red-700", border: "border-red-100" },
    { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
    { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
    { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
    { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PALETTES.length;
  const match = PALETTES[index];
  return match || DEFAULT_AVATAR_STYLE;
}

/**
 * Validates if the string is a genuine profile image URL (rejects stock/AI generated placeholders).
 */
function isValidImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Filter out stock/AI-generated placeholder image domains
  const disallowedDomains = [
    "images.unsplash.com",
    "unsplash.com",
    "thispersondoesnotexist",
    "generated.photos",
    "placeholder.com",
    "via.placeholder.com",
    "picsum.photos",
  ];

  if (disallowedDomains.some((d) => trimmed.toLowerCase().includes(d))) {
    return false;
  }

  if (trimmed.startsWith("/") || trimmed.startsWith("data:image/")) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function CreatorAvatar({
  src,
  name,
  username,
  size = 48,
  className = "",
  priority = false,
  alt,
}: CreatorAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const imageFailed = Boolean(src && failedSrc === src);
  const isLoaded = Boolean(src && loadedSrc === src);

  const isValid = useMemo(() => isValidImageUrl(src), [src]);
  const initials = useMemo(() => getCreatorInitials(name, username), [name, username]);
  const palette = useMemo(
    () => getDeterministicAvatarStyle(name || username || "creator"),
    [name, username]
  );

  const effectiveAlt = alt || (name ? `${name}'s Instagram profile` : username ? `@${username}'s Instagram profile` : "Creator profile avatar");

  // Show professional initials avatar when no image, invalid URL, or runtime load failure
  if (!isValid || imageFailed || !src) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full select-none font-semibold border ${palette.bg} ${palette.text} ${palette.border} ${className}`}
        style={{
          width: size ? `${size}px` : undefined,
          height: size ? `${size}px` : undefined,
          aspectRatio: "1 / 1",
          fontSize: size ? `${Math.max(11, Math.round(size * 0.38))}px` : "0.875rem",
          letterSpacing: "0.02em",
        }}
        aria-label={effectiveAlt}
        role="img"
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full aspect-square bg-[#F5F5F5] ${className}`}
      style={{
        width: size ? `${size}px` : undefined,
        height: size ? `${size}px` : undefined,
      }}
    >
      {/* Subtle skeleton placeholder while loading to prevent layout shift */}
      {!isLoaded && !imageFailed && (
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-full animate-pulse font-semibold ${palette.bg} ${palette.text}`}
          style={{
            fontSize: size ? `${Math.max(11, Math.round(size * 0.38))}px` : "0.875rem",
          }}
          aria-hidden="true"
        >
          <span>{initials}</span>
        </div>
      )}

      <Image
        key={src}
        src={src}
        alt={effectiveAlt}
        width={size}
        height={size}
        priority={priority}
        className={`h-full w-full rounded-full object-cover transition-opacity duration-200 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setFailedSrc(src)}
        sizes={`${size}px`}
      />
    </div>
  );
}
