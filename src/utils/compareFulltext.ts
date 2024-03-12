/**
 * Compares the full text in a given data object with a search term.
 *
 * @template T - The generic type for the data object.
 * @param {T} data - The data object to compare.
 * @param {string} search - The search term to compare against the data object.
 * @param {string[]} keys - The keys in the data object to compare against.
 * @returns {boolean} - Returns true if the full text in the data object contains the search term, false otherwise.
 */
export const compareFulltext = <T extends Record<string, any>>(data: T, search: string, ...keys: string[]) => {
  const target = String(search || "")
    .toLowerCase()
    .split(" ");
  const filterFn = (key: string) => {
    const source = String(data[key] || "")
      .toLowerCase()
      .split(" ");
    return target.every(function (term) {
      return source.some((word) => word.includes(term));
    });
  };
  let isOk = false;
  for (const key of keys) {
    isOk = isOk || filterFn(key);
  }
  return isOk;
};

export default compareFulltext;
