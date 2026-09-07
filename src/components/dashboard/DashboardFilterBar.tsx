import { Search } from "lucide-react";

export type DashboardFilterOption = {
  label: string;
  name: string;
  options: string[];
};

interface DashboardFilterBarProps {
  searchValue?: string;
  filters: DashboardFilterOption[];
  values: Record<string, string>;
}

export function DashboardFilterBar({ searchValue = "", filters, values }: DashboardFilterBarProps) {
  return (
    <form action="/dashboard/inspiration" className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <label className="min-w-0 flex-1">
          <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            Search videos
          </span>
          <span className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={searchValue}
              placeholder="Search creator, niche, hook, content type"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-red-500 focus:ring-4 focus:ring-brand-red-500/10"
            />
          </span>
        </label>

        <div className="grid flex-[2] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filters.map((filter) => (
            <label key={filter.name}>
              <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                {filter.label}
              </span>
              <select
                name={filter.name}
                defaultValue={values[filter.name] || "All"}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-brand-red-500 focus:ring-4 focus:ring-brand-red-500/10"
              >
                {filter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="min-h-11 rounded-2xl bg-brand-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-brand-red-700"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
