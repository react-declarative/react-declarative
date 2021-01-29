export const isObject = (obj: any): boolean => {
    if (typeof obj === 'object' && obj !== null) {
        return Object.getPrototypeOf(obj) === Object.prototype;
    } else {
        return false;
    }
};

export default isObject;
