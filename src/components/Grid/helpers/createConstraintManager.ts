import Dimension from '../model/Dimension';

/**
 * Creates a constraint manager that allows for memoization of computed dimensions.
 *
 * @returns The constraint manager object.
 */
export const createConstraintManager = () => {
  const cache = new Map<string, Dimension>();
  const memoize = (column: string, compute: () => Dimension) => {
    if (!cache.has(column)) {
      const value = compute();
      cache.set(column, value);
      return value;
    }
    return cache.get(column);
  };
  const clear = () => {
    cache.clear();
  };
  return {
    memoize,
    clear,
  };
};

export type ConstraintManager = ReturnType<typeof createConstraintManager>;

export default createConstraintManager;
