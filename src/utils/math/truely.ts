/**
 * Filters an array and removes null values, casting the resulting array to a specific generic type if specified.
 *
 * @param {Array} arr - The input array containing values of type T or null.
 * @returns {Array} - The filtered array with null values removed.
 *
 * @template T - The generic type of the array elements.
 */
export const truely = <T = string>(arr: (T | null)[]): T[] => {
    return (arr?.filter(v => v) || []) as T[];
}

export default truely;
