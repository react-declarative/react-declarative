/**
 * Replaces placeholders in a string with corresponding values.
 *
 * @param str - The string containing placeholders.
 * @param args - The values to replace the placeholders with.
 * @returns - The string with replaced placeholders.
 */
export const formatStr = (str: string, ...args: string[]) => {
  let i = 0;
  return str.replace(/{}/g, () => {
    return typeof args[i] !== "undefined" ? args[i++] : "";
  });
};

export default formatStr;
