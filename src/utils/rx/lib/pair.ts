import TObserver from "../../../model/TObserver";

export const pair = <T = any>(by = 2) => (target: TObserver<T>): TObserver<[T, T]> => {
  return target
    .reduce<T[]>((acm, cur) => [...acm, cur].slice(-by), [])
    .filter((acm) => acm.length === by) as TObserver<[T, T]>;
};

export default pair;
