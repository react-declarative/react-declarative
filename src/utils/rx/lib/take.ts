import TObserver from "../../../model/TObserver";

const NEVER_VALUE = Symbol('never');

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
