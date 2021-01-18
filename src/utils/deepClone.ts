import IAnything from '../model/IAnything';
import isObject from './isObject';

export const deepClone = (src: IAnything) => {
    const target = {};
    for (const prop in src) {
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
    return target as IAnything;
}

export default deepClone;
