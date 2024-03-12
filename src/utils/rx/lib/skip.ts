import TObserver from "../../../model/TObserver";

const NEVER_VALUE = Symbol('never');

/**
 * Skips the first n elements emitted by an observer.
 *
 * @typeparam T - The type of elements emitted by the observer.
 * @param the - The number of elements to skip.
 * @returns A new observer that skips the first n elements of the original observer.
 */
export const skip = <T = any>(the: number) => (target: TObserver<T>): TObserver<T> => {
  return target
    .reduce<{
      value: T;
      idx: number;
    }>((acm, cur) => ({
      value: cur,
      idx: acm.idx + 1,
    }), {
      value: NEVER_VALUE as never,
      idx: 0
    })
    .filter(({ idx }) => idx > the)
    .map(({ value }) => value);
};

export default skip;
