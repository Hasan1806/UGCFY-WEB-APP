"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type GlassCardVariant = "default" | "red" | "blue" | "white" | "dark";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: GlassCardVariant;
  glow?: boolean;
  hover?: boolean;
  animate?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<GlassCardVariant, string> = {
  default: "bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.50),0_1px_0_rgba(255,255,255,0.06)_inset]",
  red: "bg-[rgba(220,20,60,0.07)] border border-[rgba(220,20,60,0.20)] backdrop-blur-xl shadow-[0_0_40px_rgba(220,20,60,0.12),0_4px_24px_rgba(0,0,0,0.50)]",
  blue: "bg-[rgba(37,99,235,0.08)] border border-[rgba(37,99,235,0.22)] backdrop-blur-xl shadow-[0_0_40px_rgba(37,99,235,0.12),0_4px_24px_rgba(0,0,0,0.50)]",
  white: "bg-white/[0.10] border border-white/[0.18] backdrop-blur-xl",
  dark: "bg-[rgba(3,3,13,0.70)] border border-white/[0.08] backdrop-blur-xl",
};

const hoverAnimation = {
  y: -3,
  borderColor: "rgba(255,255,255,0.16)",
  backgroundColor: "rgba(255,255,255,0.08)",
  transition: { duration: 0.2, ease: "easeOut" },
};

const glowAnimation = {
  boxShadow: [
    "0 0 20px rgba(220,20,60,0.20)",
    "0 0 40px rgba(220,20,60,0.35)",
    "0 0 20px rgba(220,20,60,0.20)",
  ],
  transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
};

export function GlassCard({
  variant = "default",
  glow,
  hover,
  animate = true,
  className = "",
  children,
  whileHover,
  whileTap,
  ...props
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const motionProps: Record<string, any> = {};

  if (hover) {
    motionProps.whileHover = whileHover ?? hoverAnimation;
    motionProps.whileTap = whileTap ?? { scale: 0.99 };
  }

  if (glow && !shouldReduceMotion) {
    motionProps.animate = glowAnimation;
  }

  if (shouldReduceMotion) {
    motionProps.transition = { duration: 0 };
  }

  return (
    <motion.div
      className={`rounded-[24px] ${variantStyles[variant]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
