const IGNORE_SET = new Set([
  "@",
  "+",
  "(",
  ")",
  "-",
  "_",
  "!",
  "#",
  "$",
  "%",
  "&",
  "*",
  "/",
  "=",
]);

/**
 * Removes ignored symbols from the given value.
 *
 * @param value - The string to remove ignored symbols from.
 * @returns - The string with ignored symbols removed.
 */
export const ignoreSymbols = (value: string) => {
  let result = "";
  for (const char of value) {
    if (!IGNORE_SET.has(char)) {
      result += char;
    } else {
      result += " ";
    }
  }
  return result
    .split(" ")
    .filter((value) => value)
    .join(" ");
};

export default ignoreSymbols;
