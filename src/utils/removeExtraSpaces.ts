/**
 * Removes extra spaces from a given string.
 *
 * @param str - The input string to remove extra spaces from.
 * @returns The modified string with extra spaces removed.
 */
export const removeExtraSpaces = (str: string) => {
  let prevLength;
  do {
    prevLength = str.length;
    str = str.split("  ").join(" ");
  } while (prevLength !== str.length);
  return str;
};

export default removeExtraSpaces;
