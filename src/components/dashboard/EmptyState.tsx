import React from "react";
import Link from "next/link";
import { LucideIcon, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  ctaLabel?: string;
  ctaHref?: string;
  ctaAction?: () => void;
}

export function EmptyState({ title, description, icon: Icon, ctaLabel, ctaHref, ctaAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
      <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
        {description}
      </p>

      {ctaHref && ctaLabel && (
        <Link 
          href={ctaHref}
          className="px-6 py-3 bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-brand-red-600/15 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {ctaLabel}
        </Link>
      )}

      {!ctaHref && ctaAction && ctaLabel && (
        <button
          onClick={ctaAction}
          type="button"
          className="px-6 py-3 bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-brand-red-600/15 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
