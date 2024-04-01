/**
 * Replaces placeholder strings in a given template string with corresponding values from a context object.
 * @param str - The template string with placeholders to be replaced.
 * @param context - The object containing values to replace the placeholders.
 * @returns - The modified string with replaced placeholders.
 */
export const templateStr = (str: string, ...contexts: Record<string, unknown>[]) => {
  const context = contexts.reduce((acm, cur) => ({ ...acm, ...cur }), {});
  return str.replace(/{[a-zA-Z_\-0-9]+}/g, (match) => {
    const key = match.replace(/{|}/g, "")
    return typeof context[key] !== "undefined" ? String(context[key]) : "";
  });
};

export default templateStr;
