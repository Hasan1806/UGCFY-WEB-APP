"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const GlobalChatWidget = dynamic(() => import("@/components/GlobalChatWidget"), {
  ssr: false,
});

export default function ClientChatWrapper() {
  const pathname = usePathname();
  const isAuthenticatedAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/settings");

  if (isAuthenticatedAppRoute) {
    return null;
  }

  return <GlobalChatWidget />;
}
