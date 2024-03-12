/**
 * Check if a given value is an object.
 *
 * @param obj - The value to check.
 * @returns - Returns `true` if the value is an object, else `false`.
 */
export const isObject = (obj: any): boolean => {
    if (typeof obj === 'object' && obj !== null) {
        return Object.getPrototypeOf(obj) === Object.prototype;
    } else {
        return false;
    }
};

export default isObject;
