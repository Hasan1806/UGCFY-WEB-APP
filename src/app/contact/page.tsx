import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: "Contact UGC FY — Talk to Our Creator Marketing Team",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
