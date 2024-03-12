/**
 * Checks if an object is empty.
 *
 * @param obj - The object to check for emptiness.
 * @returns - Returns true if the object is empty, otherwise returns false.
 */
export function isEmpty(obj: Record<string | symbol, any>) {
    if (Object.getOwnPropertySymbols(obj).length !== 0) {
        return false;
    }
    if (Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
    }
    return true;
};

export default isEmpty;
