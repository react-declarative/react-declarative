import TObserver from "../../../model/TObserver";

export const pair = <T = any>() => (target: TObserver<T>): TObserver<[T, T]> => {
  return target
    .reduce<T[]>((acm, cur) => [...acm, cur].slice(-2), [])
    .filter((acm) => acm.length === 2) as TObserver<[T, T]>;
};

export default pair;
