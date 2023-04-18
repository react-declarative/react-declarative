import TObserver from "../../../model/TObserver";

const NEVER_VALUE = Symbol('never');

export const distinct = <T = any>() => (target: TObserver<T>): TObserver<T> => {
  let prevValue: T = NEVER_VALUE as never;
  return target
    .filter((value) => value !== prevValue)
    .tap((value) => prevValue = value);
};

export default distinct;
