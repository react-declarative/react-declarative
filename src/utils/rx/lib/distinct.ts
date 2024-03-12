import TObserver from "../../../model/TObserver";

const NEVER_VALUE = Symbol('never');

/**
 * Filters out duplicate values in an observable stream based on a specified compare value.
 *
 * @template T - The type of the values in the observable stream.
 * @template V - The type of the compare value.
 * @param {Function} getCompareValue - A function that takes a value of type T and returns its compare value of type V.
 * @param {Observable} target - The observable stream to filter.
 * @returns {Observable} - An observable stream with distinct values.
 */
export const distinct = <T = any, V = any>(getCompareValue = (value: T): V => value as unknown as V) => (target: TObserver<T>): TObserver<T> => {
  let prevValue: V = NEVER_VALUE as never;
  return target
    .map((value) => ({
      value,
      compare: getCompareValue(value)
    }))
    .filter(({ compare: value }) => value !== prevValue)
    .tap(({ compare }) => prevValue = compare)
    .map(({ value }) => value);
};

export default distinct;
