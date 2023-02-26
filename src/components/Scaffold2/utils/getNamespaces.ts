const SEPARATOR_SYMBOL = '.';

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
