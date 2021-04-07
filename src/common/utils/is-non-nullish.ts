export function isNonNullish<T>(value?: T | null): value is NonNullable<T> {
  return value !== undefined && value !== null
}
