/**
 * Retrieves a value from an object using a given path.
 *
 * @param object - The object from which to retrieve the value.
 * @param path - The path to the desired value, either as an array or dot-separated string.
 * @returns - The value at the specified path, or undefined if it does not exist.
 */
export const get = (object: any, path: any) => {
    const pathArray = Array.isArray(path) ? path : path.split('.').filter((key: any) => key);
    const pathArrayFlat = pathArray.flatMap((part: any) => typeof part === 'string' ? part.split('.') : part);
    return pathArrayFlat.reduce((obj: any, key: any) => obj && obj[key], object);
}

export default get;
