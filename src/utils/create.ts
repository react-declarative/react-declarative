export const create = (object: any, path: any) => {
    const pathArray = Array.isArray(path) ? path : path.split('.').filter((key: any) => key);
    const pathArrayFlat = pathArray.flatMap((part: any) => typeof part === 'string' ? part.split('.') : part);
    pathArrayFlat.slice(0, pathArrayFlat.length - 1).reduce((obj: any, key: any) => obj[key] = obj[key] ? obj[key] : {}, object);
};

export default create;
