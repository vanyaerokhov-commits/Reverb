export interface CalendarEvent {
  title: string;
  startDate: string;  // "2026-04-15"
  startTime: string;  // "20:00"
  venue: string;
  city: string;
  country: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toICSDate(dateStr: string, timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(dateStr);
  d.setHours(h, m, 0, 0);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

function addHours(dateStr: string, timeStr: string, hours: number): string {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(dateStr);
  d.setHours(h + hours, m, 0, 0);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

export function downloadCalendar(event: CalendarEvent) {
  const start = toICSDate(event.startDate, event.startTime);
  const end = addHours(event.startDate, event.startTime, 3);   // assume 3-hour show
  const uid = `reverb-${event.title.replace(/\s/g, "")}-${Date.now()}@reverb.app`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Reverb//Concert Tickets//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.venue}\\, ${event.city}\\, ${event.country}`,
    `DESCRIPTION:Concert ticket from Reverb — reverb.app`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
