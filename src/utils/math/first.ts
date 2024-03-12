/**
 * Returns the first element of an array.
 *
 * @template T - The type of array elements.
 * @param arr - The input array.
 * @returns - The first element of the array, or null if the array is null or empty.
 */
export const first = <T = any>(arr: T[] | null | undefined): T | null => {
    if (Array.isArray(arr)) {
        const [first] = arr;
        return first || null;
    }
    return null;
}

export default first;
