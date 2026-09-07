import React from "react";

type StatusType = "success" | "warning" | "danger" | "neutral" | "info";

interface Props {
  status: string;
  type?: StatusType;
}

import { normalizeStatus } from "@/lib/dashboard/dashboardSafety";

export function DashboardStatusBadge({ status, type = "neutral" }: Props) {
  const styles: Record<StatusType, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    neutral: "bg-gray-100 text-gray-600 border-gray-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  // Auto-detect common statuses
  let actualType = type;
  if (type === "neutral") {
    const lowerStatus = normalizeStatus(status, "neutral");
    if (lowerStatus === "active" || lowerStatus === "completed" || lowerStatus === "approved") actualType = "success";
    if (lowerStatus === "draft" || lowerStatus === "pending") actualType = "warning";
    if (lowerStatus === "rejected" || lowerStatus === "cancelled") actualType = "danger";
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[actualType]}`}>
      {status}
    </span>
  );
}
