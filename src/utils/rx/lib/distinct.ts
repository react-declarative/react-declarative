import TObserver from "../../../model/TObserver";

const NEVER_VALUE = Symbol('never');

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
