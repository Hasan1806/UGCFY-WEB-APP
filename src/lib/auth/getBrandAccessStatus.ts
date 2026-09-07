export type BrandAccessStatus =
  | "incomplete"
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "on_hold";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBrandAccessStatus(profile: any): BrandAccessStatus {
  if (!profile) return "incomplete";

  const approvalStatus = (profile.approval_status || "").toLowerCase();
  const kycStatus = (profile.kyc_status || "").toLowerCase();

  const isApproved =
    approvalStatus === "approved" ||
    kycStatus === "approved" ||
    kycStatus === "verified" ||
    kycStatus === "completed";

  if (isApproved) return "approved";

  const isPending =
    approvalStatus === "under_review" ||
    approvalStatus === "pending" ||
    kycStatus === "pending" ||
    kycStatus === "pending_verification" ||
    kycStatus === "submitted" ||
    kycStatus === "under_review";

  if (isPending) return "pending";

  const isRejected =
    approvalStatus === "rejected" ||
    kycStatus === "rejected" ||
    kycStatus === "declined";

  if (isRejected) return "rejected";

  const isOnHold =
    approvalStatus === "blocked" ||
    approvalStatus === "on_hold" ||
    kycStatus === "on_hold" ||
    kycStatus === "needs_changes" ||
    kycStatus === "changes_requested";

  if (isOnHold) return "on_hold";

  if (
    kycStatus === "draft" ||
    kycStatus === "not_started" ||
    kycStatus === "not_submitted"
  ) {
    return "draft";
  }

  return "incomplete";
}
