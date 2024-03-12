/**
 * Joins multiple arrays into a single array, removing duplicates and filtering out null values.
 *
 * @param {...(T | T[] | null)[] | (T | T[] | null)[][]} arr - The arrays to join.
 * @returns {T[]} - The joined array.
 *
 * @template T - The type of values in the array.
 */
export const join = <T = string>(...arr: (T | T[] | null)[] | (T | T[] | null)[][]): T[] => {
    arr = arr.flat(1) as typeof arr;
    return [...new Set(arr.flatMap((item) => {
        if (Array.isArray(item)) {
            return join(item as T[]);
        }
        return item
    }).filter(Boolean))] as T[];
};

export default join;
