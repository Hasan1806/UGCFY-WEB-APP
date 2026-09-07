import { redirect } from "next/navigation";

export default function LegacyBrandKycPage() {
  redirect("/dashboard/verification");
}
