import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DashboardCard({ children, className = "", onClick }: Props) {
  const Element = onClick ? "button" : "div";
  
  return (
    <Element 
      onClick={onClick}
      className={`bg-white border border-gray-200/60 rounded-3xl p-6 shadow-sm ${onClick ? "hover:shadow-md hover:border-gray-300 transition-all text-left w-full cursor-pointer" : ""} ${className}`}
    >
      {children}
    </Element>
  );
}
