/**
 * Creates a nested object property based on the provided path.
 *
 * @param object - The object to add the property to.
 * @param path - The path to the desired property.
 *                     Can be either an array of keys or a string with keys separated by dots.
 */
export const create = (object: any, path: any) => {
    const pathArray = Array.isArray(path) ? path : path.split('.').filter((key: any) => key);
    const pathArrayFlat = pathArray.flatMap((part: any) => typeof part === 'string' ? part.split('.') : part);
    pathArrayFlat.slice(0, pathArrayFlat.length - 1).reduce((obj: any, key: any) => obj[key] = obj[key] ? obj[key] : {}, object);
};

export default create;
