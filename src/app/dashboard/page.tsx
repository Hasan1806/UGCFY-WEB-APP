import { UnifiedOverview } from "@/components/dashboard/UnifiedOverview";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <UnifiedOverview />
    </div>
  );
}
