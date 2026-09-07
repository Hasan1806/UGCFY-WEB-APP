"use client";

import dynamic from 'next/dynamic';

const ClientLandingPage = dynamic(() => import('@/components/landing/LandingPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FCF6F6]">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function ClientPage() {
  return <ClientLandingPage />;
}
