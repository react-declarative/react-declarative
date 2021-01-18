import isObject from './isObject';

export const deepCompare = (obj1, obj2) => {
    if (obj1 === obj2) {
        return true;
    } else if (isObject(obj1) && isObject(obj2)) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) { 
            return false;
        }
        for (const prop in obj1) {
            if (!deepCompare(obj1[prop], obj2[prop])) {
                return false;
            }
        }
        return true;
    }
}

export default deepCompare;
