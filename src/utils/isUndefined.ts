/**
 * Checks if a given object is undefined.
 *
 * @param obj - The object to check.
 * @return Returns true if the object is undefined, otherwise returns false.
 */
export const isUndefined = (obj: any) => {
    return typeof obj === 'undefined';
}

export default isUndefined;
