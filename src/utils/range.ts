/**
 * Creates an array of numbers in a specified range.
 *
 * @param start - The start of the range (inclusive).
 * @param end - The end of the range (exclusive).
 * @param [length=end-start] - Optional. The length of the array. Defaults to the difference between `end` and `start`.
 * @returns An array of numbers in the specified range.
 */
export const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export default range;
