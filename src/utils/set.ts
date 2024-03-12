/**
 * Updates the value of a nested object property using a specific path.
 *
 * @param object - The object to update.
 * @param path - The path to the property. Can be either a dot-separated string or an array of strings.
 * @param value - The new value to set for the property.
 * @returns - Returns true if the property was successfully updated, false otherwise.
 */
export const set = (object: any, path: any, value: any) => {
    const pathArray = Array.isArray(path) ? path : path.split('.').filter((key: any) => key);
    const pathArrayFlat = pathArray.flatMap((part: any) => typeof part === 'string' ? part.split('.') : part);
    const parentPath = pathArrayFlat.slice(0, pathArrayFlat.length - 1);
    const parent = parentPath.reduce((obj: any, key: any) => obj && obj[key], object);
    const [name] = pathArrayFlat.reverse();
    try {
        parent[name] = value;
        return true;
    } catch {
        return false;
    }
};

export default set;
