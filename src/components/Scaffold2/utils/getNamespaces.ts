const SEPARATOR_SYMBOL = '.';

/**
 * Retrieves all namespaces from a given path.
 *
 * @param originalPath - The original path
 * @returns - An array of namespaces
 */
export const getNamespaces = (originalPath: string) => {
  let currentPath = originalPath;
  const paths = [originalPath];
  while (currentPath.includes(SEPARATOR_SYMBOL)) {
    currentPath = currentPath.slice(
      0,
      currentPath.lastIndexOf(SEPARATOR_SYMBOL),
    );
    paths.push(currentPath);
  }
  return paths;
};

export default getNamespaces;
