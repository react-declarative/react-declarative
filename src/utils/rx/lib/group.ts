import TObserver from "../../../model/TObserver";

export const group = <T = any>(by: number) => (target: TObserver<T>): TObserver<T[]> => {
  return target
    .reduce<T[]>((acm, cur) => {
        if (acm.length === by) {
            return [cur];
        } else {
            return [...acm, cur];
        }
    }, [])
    .filter((acm) => acm.length === by)
};

export default group;
