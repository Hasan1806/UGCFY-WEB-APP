"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-[#E11D48] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-700">Completing secure authentication...</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
