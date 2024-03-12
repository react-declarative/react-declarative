const compareFn = (a: any, b: any) => {
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    } else if (typeof a === 'boolean' && typeof b === 'boolean') {
        return  (a ? 1 : 0) - (b ? 1 : 0);
    } else if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
    } else {
        return 0;
    }
};

/**
 * Compares two arrays and determines if they are equal.
 *
 * @param {Array} a_arr - The first array to compare.
 * @param {Array} b_arr - The second array to compare.
 * @returns {boolean} - Returns `true` if the arrays are equal, otherwise `false`.
 */
export const compareArray = (a_arr: any, b_arr: any) => {
    if (Array.isArray(a_arr) && Array.isArray(b_arr)) {
        if (a_arr.length !== b_arr.length) {
            return false;
        }
        const a_sort = [...a_arr].sort(compareFn);
        const b_sort = [...b_arr].sort(compareFn);
        return a_sort.every((value, index) => value === b_sort[index]);
    }
    return false;
};

export default compareArray;
