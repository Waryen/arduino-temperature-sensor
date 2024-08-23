export function isBetween(a: number, b: number, c: number) {
  if (c < a) {
    return false;
  }

  return c <= b;
}
