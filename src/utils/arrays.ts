const NUMBER_EXPR = /^\d+$/;

const hasNumberKey = (root: any) => Object.keys(root).find((key) => NUMBER_EXPR.test(key));

/**
 * Converts nested object properties to arrays.
 *
 * @param root - The root object to convert.
 * @param [forceArray=false] - Optional parameter to force conversion to arrays even if no numeric keys are present.
 * @returns - The converted object with nested properties converted to arrays.
 */
export const arrays = (root: any, forceArray = false) => {
    let result = root;
    const process = (entry: any, change = (arr: any[]) => result = arr) => {
        if (typeof entry === 'object' && entry !== null) {
            if (hasNumberKey(entry) || forceArray) {
                const values = Object.values(entry);
                values.forEach((e, idx) =>
                    process(e, (arr) => values[idx] = arr)
                );
                change(values);
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

export default arrays;
