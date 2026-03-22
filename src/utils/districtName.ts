/** Прибираємо «район» у кінці для підписів на карті та в текстах. */
export function normalizeDistrictDisplayName(name: string): string {
  return name
    .replace(/\s+район\s*$/iu, '')
    .replace(/\s+Район\s*$/u, '')
    .trim()
}
