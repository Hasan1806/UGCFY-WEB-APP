import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: "About UGC FY — Creator Marketing Infrastructure for Brands",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
