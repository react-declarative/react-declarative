/**
 * Deep flattens an array hierarchy, preserving the order of the entries.
 *
 * @param arr - The array to be deep flattened.
 * @returns - The deep flattened array.
 */
export const deepFlat = <T = any>(arr: T[] = []) => {
    const result: T[] = [];
    /**
     * Recursively processes an array of entries.
     *
     * @param entries - The array of entries to be processed.
     */
    const process = (entries: any[] = []) => entries.forEach((entry) => {
        const child = entry['child'] || [];
        process(child);
        result.push(entry);
    });
    process(arr);
    return result;
};

export default deepFlat;
