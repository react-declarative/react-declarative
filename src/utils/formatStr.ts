/**
 * Replaces placeholders in a string with corresponding values.
 *
 * @param str - The string containing placeholders.
 * @param args - The values to replace the placeholders with.
 * @example `formatStr("hello {1} world {0} foo {}", 1,2,3) // hello 2 world 1 foo 3`
 * @returns - The string with replaced placeholders.
 */
export const formatStr = (str: string, ...args: (string | number | boolean)[]) => {
  let i = -1;
  return str.replace(/{\d}|{}/g, (match) => {
    i += 1;
    if (match === "{}") {
        return typeof args[i] !== "undefined" ? String(args[i]) : "";
    }
    const idx = parseInt(match.replace(/{|}/g, ""));
    return typeof args[idx] !== "undefined" ? String(args[idx]) : "";
  });
};

export default formatStr;
