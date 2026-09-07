"use client";

import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PendingApprovalPage() {
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
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 text-3xl text-yellow-500">
          ⏳
        </div>
        <h1 className="mb-2 text-2xl font-bold">Account Under Review</h1>
        <p className="mb-8 text-white/60">
          Your account is currently pending approval. You will gain access once approved by the administrator.
        </p>
        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-white/10 py-3 font-semibold text-white transition hover:bg-white/20"
        >
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
