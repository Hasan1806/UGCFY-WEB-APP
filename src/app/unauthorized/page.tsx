"use client";

import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090B] p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center backdrop-blur-xl"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-3xl text-red-500">
          🚫
        </div>
        <h1 className="mb-2 text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="mb-8 text-white/60">
          You do not have the required permissions to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-red-500/20 py-3 font-semibold text-red-500 transition hover:bg-red-500/30"
        >
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
