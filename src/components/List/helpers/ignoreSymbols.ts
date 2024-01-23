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
