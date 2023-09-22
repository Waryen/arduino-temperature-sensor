/**
 * Checks if a number is between two other numbers (inclusive).
 *
 * @param {number} a - The lower bound.
 * @param {number} b - The upper bound.
 * @param {number} c - The number to check.
 * @returns {boolean} True if `c` is between `a` and `b` (inclusive), false otherwise.
 */
function isBetween(a, b, c) {
  if (c < a) {
    return false;
  }

  if (c > b) {
    return false;
  }

  return true;
}

module.exports = {
  isBetween,
};
