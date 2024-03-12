import TObserver from "../../../model/TObserver";

const NEVER_VALUE = Symbol('never');

export interface ICounted<T> {
  value: T;
  count: number;
}

/**
 * Counts the occurrences of each value emitted by the target observer.
 *
 * @template T - The type of values emitted by the target observer.
 * @param {TObserver<T>} target - The target observer to count the occurrences for.
 * @returns {TObserver<ICounted<T>>} - An observer that emits {@link ICounted} objects containing the value and count.
 */
export const count = <T = any>() => (target: TObserver<T>): TObserver<ICounted<T>> => {
  return target
  .reduce<{
    value: T;
    count: number;
  }>((acm, cur) => {
    if (acm.value === cur) {
      return {
        value: cur,
        count: acm.count + 1,
      };
    }
    return {
      value: cur,
      count: 0,
    };
  }, {
    value: NEVER_VALUE as never,
    count: 0,
  })
};

export default count;
