import isObject from './isObject';

/**
 * Creates a deep clone of the given object.
 *
 * @param {*} src - The source object to be cloned.
 * @returns {*} The deep cloned object.
 */
export const deepClone = (src: any) => {
    const target: any = {};
    for (const prop in (src as any)) {
        if (src.hasOwnProperty(prop)) {
            if (Array.isArray(src[prop])) {
                /* TODO: нет поддержки копирования массивов объектов */
                target[prop] = src[prop].slice(0);
            } else if (isObject(src[prop])) {
                target[prop] = deepClone(src[prop]);
            } else {
                target[prop] = src[prop];
            }
        }
    }
    return target;
}

export default deepClone;
