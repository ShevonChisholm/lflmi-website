export interface CalendarEventData {
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
}

const toGoogleCalendarDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
};

const escapeIcsText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

const toIcsDateTime = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
};

const getDefaultEndDate = (startDate: string) =>
  new Date(new Date(startDate).getTime() + 60 * 60 * 1000).toISOString();

export const getGoogleCalendarUrl = (event: CalendarEventData) => {
  const start = toGoogleCalendarDate(event.startDate);
  const end = toGoogleCalendarDate(event.endDate || getDefaultEndDate(event.startDate));
  const details = [event.description?.trim(), "Added from Liberty For Living Ministries website"].filter(Boolean).join("\n\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details,
    location: event.location ?? "",
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const getCalendarIcsUrl = (event: CalendarEventData) => {
  const start = toIcsDateTime(event.startDate);
  const end = toIcsDateTime(event.endDate || getDefaultEndDate(event.startDate));
  const description = [event.description?.trim(), "Added from Liberty For Living Ministries website"]
    .filter(Boolean)
    .join("\\n\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Liberty For Living Ministries International//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${encodeURIComponent(event.title)}-${start}`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(event.location ?? "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines)}`;
};
