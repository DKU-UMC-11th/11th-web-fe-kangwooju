export function parsePage(value: unknown) {
  const page = typeof value === 'string' || typeof value === 'number' ? Number(value) : NaN
  return Number.isInteger(page) && page >= 1 && page <= 500 ? page : 1
}
