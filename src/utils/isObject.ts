export const isObject = (obj: any) => {
    const type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

export default isObject;
