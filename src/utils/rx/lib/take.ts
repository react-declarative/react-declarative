import TObserver from "../../../model/TObserver";

const NEVER_VALUE = Symbol('never');

/**
 * Takes a count number as an input and returns a higher-order function
 * that accepts a target TObserver. The higher-order function returns a TObserver
 * that filters the values emitted by the target TObserver based on the count.
 * Only values with an index less than or equal to the count will be emitted.
 *
 * @typeparam T - The type of values emitted by the target TObserver.
 * @param count - The maximum index of values to be emitted.
 * @returns A higher-order function that accepts a target TObserver and returns
 * a TObserver that filters values based on the count.
 */
export const take = <T = any>(count: number) => (target: TObserver<T>): TObserver<T> => {
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
    .filter(({ idx }) => idx <= count)
    .map(({ value }) => value);
};

export default take;
