/**
 * Counts the number of dots in a given string.
 *
 * @param str - The input string to count dots from.
 * @returns - The total number of dots found in the string.
 */
export const countDots = (str: string) => str.match(/\./g)?.length || 0;

export default countDots;
