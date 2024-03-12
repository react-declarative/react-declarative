import TObserver from "../../../model/TObserver";

/**
 * Applies a pairwise transformation to an observer.
 *
 * @template T - The type of value observed by the original observer.
 * @param [by=2] - The number of values in each pair.
 * @returns - A function that takes an observer and returns a new observer that emits pairs of values.
 */
export const pair = <T = any>(by = 2) => (target: TObserver<T>): TObserver<[T, T]> => {
  return target
    .reduce<T[]>((acm, cur) => [...acm, cur].slice(-by), [])
    .filter((acm) => acm.length === by) as TObserver<[T, T]>;
};

export default pair;
