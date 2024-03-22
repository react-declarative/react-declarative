/**
 * Removes duplicates from an array of paths.
 *
 * @param paths - The array of paths containing duplicates.
 * @returns - The array of paths with duplicates removed.
 */
export const removeDuplicates = (paths: Array<string>) => {
  const result: Array<string> = [];
  const set = new Set(paths);
  set.forEach((path) => result.push(path));
  return result;
};

export default removeDuplicates;
