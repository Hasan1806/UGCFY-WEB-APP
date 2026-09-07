import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "UGC FY — AI-Powered Influencer Marketing Platform",
  description:
    "UGC FY helps brands discover creators, manage UGC campaigns, review content, track performance, and scale influencer marketing with AI-powered workflows.",
  alternates: {
    canonical: "/",
  },
};

import ClientPage from './ClientPage';
import { JsonLd } from '@/components/seo/JsonLd';

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UGC FY",
  url: "https://www.ugcfy.com",
  logo: "https://www.ugcfy.com/android-chrome-512x512.png",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "UGC FY",
  url: "https://www.ugcfy.com",
  description:
    "UGC FY helps brands discover creators, manage UGC campaigns, review content, track performance, and scale influencer marketing with AI-powered workflows.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  // Production Google OAuth rescue: if Supabase redirects to homepage with a code,
  // push it to the correct callback route immediately.
  if (searchParams?.code) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      const val = Array.isArray(value) ? value[0] : value;
      if (val) params.append(key, val);
    }
    redirect(`/auth/callback?${params.toString()}`);
  }

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <ClientPage />
    </>
  );
}
