import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BrandShell } from "@/components/brand/BrandShell";

export const metadata: Metadata = {
  title: "UGCFY Brand Dashboard",
  description: "Brand dashboard for UGCFY premium creator marketplace.",
};

export default function BrandLayout({ children }: { children: ReactNode }) {
  return <BrandShell>{children}</BrandShell>;
}
