import type TObserver from "../../../model/TObserver";

/**
 * Groups the elements of an array in chunks of a specified size.
 *
 * @template T - The type of the elements in the array, or 'any' if not specified
 * @param by - The size of each group
 * @returns - A function that takes an array and returns a new array with the elements grouped by the specified size
 */
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
