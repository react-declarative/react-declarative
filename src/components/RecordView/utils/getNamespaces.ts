const SEPARATOR_SYMBOL = '.';

/**
 * Retrieves all parent namespaces of a given path.
 *
 * @param originalPath - The original path to retrieve parent namespaces from.
 * @returns - An array of parent namespaces, including the original path.
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
