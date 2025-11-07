export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ") // normaliza espacios múltiples
    .replace(/[^\x20-\x7E]/g, ""); // elimina caracteres no ASCII
}
