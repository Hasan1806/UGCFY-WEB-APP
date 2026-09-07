const dashboardNumberFormatter = new Intl.NumberFormat("en-US");

export function formatDashboardNumber(value: number | null | undefined): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "0";

  return dashboardNumberFormatter.format(value);
}
