/** "pain-relief" -> "Pain relief" */
export function formatCategory(slug: string): string {
  const text = slug.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
