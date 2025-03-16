export function normalizeTypeString(typeStr: string): string {
  return typeStr.replace(/\s+/g, ' ').trim();
} 