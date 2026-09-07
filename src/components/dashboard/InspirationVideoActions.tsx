"use client";

import { ReactNode, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  InspirationActionState,
  shortlistCreatorFromInspiration,
} from "@/app/dashboard/inspiration/actions";

interface InspirationVideoActionsProps {
  videoId: string;
  creatorId: string | null;
  saveIcon: ReactNode;
  shortlistIcon: ReactNode;
  campaignIcon: ReactNode;
}

const initialState: InspirationActionState = {
  status: "idle",
  message: null,
};

export function InspirationVideoActions({
  videoId,
  creatorId,
  saveIcon,
  shortlistIcon,
  campaignIcon,
}: InspirationVideoActionsProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(shortlistCreatorFromInspiration, initialState);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          disabled
          title="Save inspiration will be enabled once a saved-inspiration table is connected."
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-400"
        >
          {saveIcon}
          Save
        </button>

        <form action={formAction}>
          <input type="hidden" name="creatorId" value={creatorId ?? ""} />
          <input type="hidden" name="videoId" value={videoId} />
          <button
            type="submit"
            disabled={isPending || !creatorId}
            className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 transition hover:border-brand-red-200 hover:text-brand-red-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          >
            {shortlistIcon}
            {isPending ? "Saving..." : "Shortlist"}
          </button>
        </form>

        <button
          type="button"
          disabled
          title="Campaign reference creation is coming soon."
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-3 text-xs font-extrabold text-slate-400"
        >
          {campaignIcon}
          Use
        </button>
      </div>

      {state.message && (
        <p
          className={`rounded-2xl px-3 py-2 text-xs font-bold ${
            state.status === "success"
              ? "border border-brand-red-100 bg-brand-red-50 text-brand-red-600"
              : "border border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
