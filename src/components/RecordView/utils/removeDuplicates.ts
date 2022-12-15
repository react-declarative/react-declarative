export const removeDuplicates = (paths: Array<string>) => {
  const result: Array<string> = [];
  const set = new Set(paths);
  set.forEach((path) => result.push(path));
  return result;
};

export default removeDuplicates;
