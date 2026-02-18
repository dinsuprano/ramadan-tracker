import { eachDayOfInterval, format } from "date-fns";

// Ramadan 2026 ≈ 19 Feb – 20 Mar (1447 Hijri)
// Adjust these if actual sighting differs.
export const RAMADAN_START = new Date("2026-02-19");
export const RAMADAN_END = new Date("2026-03-20"); // 30 days

export const RAMADAN_DAYS = eachDayOfInterval({
  start: RAMADAN_START,
  end: RAMADAN_END,
});

export function dateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}
