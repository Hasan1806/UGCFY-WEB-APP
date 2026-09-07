const dashboardDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const dashboardDateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function getDashboardDateTimeValue(value: string | Date | null | undefined): number {
  if (!value) return 0;

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return 0;

  return date.getTime();
}

export function formatDashboardDate(value: string | Date | null | undefined): string {
  const timestamp = getDashboardDateTimeValue(value);

  if (!timestamp) return "Not dated";

  return dashboardDateFormatter.format(timestamp);
}

export function formatDashboardDateTime(value: string | Date | null | undefined): string {
  const timestamp = getDashboardDateTimeValue(value);

  if (!timestamp) return "Not dated";

  return dashboardDateTimeFormatter.format(timestamp);
}
