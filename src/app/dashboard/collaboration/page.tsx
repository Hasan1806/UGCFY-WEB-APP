import { redirect } from "next/navigation";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { CollaborationClient } from "./CollaborationClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CollaborationHubPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <DashboardPageHeader
        title="Collaboration Hub"
        description="Chat with creators, coordinate campaign details, and keep collaboration history in one workspace."
      />
      <CollaborationClient />
    </div>
  );
}
