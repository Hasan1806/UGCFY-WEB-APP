"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Dashboard failed to load</h1>
        <p className="mt-2 text-sm text-slate-500">
          Something went wrong while loading your brand dashboard.
        </p>
        {process.env.NODE_ENV === "development" ? (
          <pre className="mt-4 whitespace-pre-wrap text-xs text-red-600 bg-red-50 p-4 rounded-lg overflow-auto max-h-48">
            {error.message}
          </pre>
        ) : null}
        <button 
          onClick={reset} 
          className="mt-6 w-full bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
