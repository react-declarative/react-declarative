/**
 * Checks if a given object is undefined.
 *
 * @param {any} obj - The object to check.
 * @return {boolean} Returns true if the object is undefined, otherwise returns false.
 */
export const isUndefined = (obj: any) => {
    return typeof obj === 'undefined';
}

export default isUndefined;
