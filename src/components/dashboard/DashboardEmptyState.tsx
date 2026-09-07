import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  ctaLabel?: string;
  ctaHref?: string;
  ctaAction?: () => void;
}

export function DashboardEmptyState({ title, description, icon: Icon, ctaLabel, ctaHref, ctaAction }: Props) {
  return (
    <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-8">{description}</p>
      
      {ctaLabel && ctaHref && (
        <Link 
          href={ctaHref}
          className="bg-brand-red-600 hover:bg-brand-red-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all"
        >
          {ctaLabel}
        </Link>
      )}
      
      {ctaLabel && ctaAction && !ctaHref && (
        <button 
          onClick={ctaAction}
          className="bg-brand-red-600 hover:bg-brand-red-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
