import Dimension from '../model/Dimension';

/**
 * Creates a constraint manager that allows for memoization of computed dimensions.
 *
 * @returns The constraint manager object.
 */
export const createConstraintManager = () => {
  const cache = new Map<string, Dimension>();
  /**
   * Memoizes the result of a computation based on a given column.
   *
   * @param column - The column name to memoize the result for.
   * @param compute - The computation function that calculates the result.
   * @returns The memoized result for the given column.
   */
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
  /**
   * Configuration object.
   *
   * @typedef {Object} Config
   * @property memoize - The memoize function.
   * @property clear - The clear function.
   */
  return {
    memoize,
    clear,
  };
};

export type ConstraintManager = ReturnType<typeof createConstraintManager>;

export default createConstraintManager;
