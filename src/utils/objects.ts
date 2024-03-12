/**
 * Recursively processes an object and its nested properties.
 *
 * @param {any} root - The root object to be processed.
 * @returns {any} - The processed object.
 */
export const objects = (root: any) => {
    let result = root;
    const process = (entry: any, change = (obj: any) => result = obj) => {
        if (typeof entry === 'object' && entry !== null) {
            if (Array.isArray(entry)) {
                entry.forEach((e, idx) =>
                    process(e, (obj) => entry[idx] = obj)
                );
                change({...entry});
            } else {
                Object.entries(entry).forEach(([k, v]) => 
                    process(v, (arr) => entry[k] = arr)
                );
            }
        }
    };
    process(root);
    return result;
};
export default objects;
