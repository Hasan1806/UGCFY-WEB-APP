import React from "react";

interface LiveDotProps {
  color?: string;
}

export function LiveDot({ color = "#22C55E" }: LiveDotProps) {
  return (
    <span className="relative inline-flex h-4 w-4 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full opacity-30"
        style={{ backgroundColor: color, animation: "pulseDot 1.8s ease-out infinite" }}
      />
      <span
        className="relative inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      <style jsx>{`
        @keyframes pulseDot {
          0% { transform: scale(0.95); opacity: 0.35; }
          50% { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0.35; }
        }
      `}</style>
    </span>
  );
}
