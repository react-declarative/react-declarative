/**
 * Replaces all occurrences of a substring in a given string with a new substring.
 *
 * @param str - The original string to be modified.
 * @param from - The substring to be replaced.
 * @param to - The new substring to replace with.
 * @returns The modified string with all occurrences of the substring replaced.
 */
export const replaceString = (str: string, from: string, to: string) =>
  str.split(from).join(to);

export default replaceString;
