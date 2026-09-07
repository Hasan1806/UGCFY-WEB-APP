import Link from "next/link";
import { LucideIcon, Search } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";

type FilterGroup = {
  label: string;
  options: string[];
};

type Action = {
  label: string;
  href: string;
};

interface DashboardRouteScaffoldProps {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  filters?: FilterGroup[];
  actions?: Action[];
  children?: React.ReactNode;
}

export function DashboardRouteScaffold({
  title,
  description,
  icon: Icon,
  emptyTitle,
  emptyDescription,
  filters = [],
  actions = [],
  children,
}: DashboardRouteScaffoldProps) {
  return (
    <div className="space-y-6 pb-10">
      <DashboardPageHeader
        title={title}
        description={description}
        action={
          actions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {actions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`inline-flex min-h-10 items-center justify-center rounded-2xl px-4 text-xs font-extrabold transition ${
                    index === 0
                      ? "bg-brand-red-600 text-white hover:bg-brand-red-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-brand-red-200 hover:text-brand-red-600"
                  }`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null
        }
      />

      {filters.length > 0 && (
        <DashboardCard className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label className="min-w-0 flex-1">
              <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Search
              </span>
              <span className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder={`Search ${title.toLowerCase()}`}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-red-500 focus:ring-4 focus:ring-brand-red-100"
                />
              </span>
            </label>
            <div className="grid flex-[2] grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {filters.map((filter) => (
                <label key={filter.label}>
                  <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                    {filter.label}
                  </span>
                  <select className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-brand-red-500 focus:ring-4 focus:ring-brand-red-100">
                    {filter.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        </DashboardCard>
      )}

      {children ?? (
        <DashboardEmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={Icon}
        />
      )}
    </div>
  );
}
