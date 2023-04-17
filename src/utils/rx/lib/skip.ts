import TObserver from "../../../model/TObserver";

export const skip = <T = any>(the: number) => (target: TObserver<T>): TObserver<T> => {
  return target
    .reduce<{
      value: T;
      idx: number;
    }>((acm, cur) => ({
      value: cur,
      idx: acm.idx + 1,
    }), {
      value: null as never,
      idx: 0
    })
    .filter(({ idx }) => idx > the)
    .map(({ value }) => value);
};

export default skip;
