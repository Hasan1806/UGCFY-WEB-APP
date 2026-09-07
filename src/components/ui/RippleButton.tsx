"use client";

import React, { useEffect, useState } from "react";
import type { ButtonHTMLAttributes } from "react";

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function RippleButton({ children, className = "", onClick, ...props }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (!ripples.length) return;
    const timeout = window.setTimeout(() => {
      setRipples((current) => current.slice(1));
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [ripples]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipples((current) => [
      ...current,
      {
        id: Date.now(),
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
    ]);
    onClick?.(event);
  }

  return (
    <button
      type={props.type || "button"}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-[12px] px-5 py-3 font-semibold transition-all duration-200 ${className}`}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute h-24 w-24 rounded-full bg-white/20"
          style={{
            left: ripple.x - 48,
            top: ripple.y - 48,
            animation: "ripple 0.7s ease-out",
          }}
        />
      ))}
      {children}
      <style jsx>{`
        @keyframes ripple {
          from { transform: scale(0.2); opacity: 0.45; }
          to { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
