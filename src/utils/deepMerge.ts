import isObject from './isObject';

/**
 * Merges multiple objects into a single object recursively.
 *
 * @param target - The target object to merge into.
 * @param sources - The source objects to merge from.
 * @returns - The merged object.
 */
export const deepMerge = (target: any, ...sources: any[]): any => {
    if (!sources.length) return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (Array.isArray(source[key])) {
                target[key] = source[key].slice(0);
            } else if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return deepMerge(target, ...sources);
};

export default deepMerge;
