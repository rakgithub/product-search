import type { Pagination } from "../types";

/** "Showing 1–10 of 12 results"; empty string when there are no results. */
export function formatResultRange({ page, pageSize, total }: Pagination): string {
  if (total === 0) return "";
  const noun = total === 1 ? "result" : "results";
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const range = start === end ? `${start}` : `${start}–${end}`;
  return `Showing ${range} of ${total} ${noun}`;
}
