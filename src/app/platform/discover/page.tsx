import React, { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InstagramDiscoverExperience from "@/components/discover/InstagramDiscoverExperience";
import CreatorSkeleton from "@/components/discover/CreatorSkeleton";

export const metadata = {
  title: "Discover Instagram Creators | UGC FY",
  description:
    "Find and filter high-performing Indian Instagram creators for your brand campaigns by niche, follower count, location, and engagement rate.",
};

export default async function PlatformDiscoverPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login?next=/platform/discover");
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col antialiased selection:bg-[#111111] selection:text-white">
      {/* Top Navbar */}
      <Navbar theme="dark" />

      {/* Main Discover Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <Suspense
          fallback={
            <div className="space-y-6 pt-6">
              <div className="h-16 w-full max-w-md rounded-xl bg-[#EFEFEF] animate-pulse" />
              <div className="h-12 w-full max-w-2xl rounded-xl bg-[#EFEFEF] animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-4">
                <CreatorSkeleton count={6} />
              </div>
            </div>
          }
        >
          <InstagramDiscoverExperience />
        </Suspense>
      </main>

      {/* Platform Footer */}
      <Footer />
    </div>
  );
}
