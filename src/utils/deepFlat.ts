/**
 * A utility function to deep flatten an array of objects.
 *
 * @param {Array<any>} arr - The input array to be deep flattened.
 * @returns {Array<any>} - The deep flattened array.
 * @template T - The type of elements in the input array.
 */
export const deepFlat = <T = any>(arr: T[] = []) => {
    const result: T[] = [];
    const process = (entries: any[] = []) => entries?.forEach((entry) => {
        const fields = entry['fields'] || [];
        const child = entry['child'] ? [ entry['child'] ] : [];
        process([...fields, ...child]);
        result.push(entry);
    });
    process(arr);
    return result;
};

export default deepFlat;
