/**
 * A function that flattens a given array to a single level.
 *
 * @param arr - The array(s) to be flattened.
 * @returns - The flattened array.
 * @template T
 */
export const flatArray = <T = any>(...arr: any[]): T[] => {
    return arr.flat(Infinity);
}

export default flatArray;
