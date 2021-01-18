export const create = (object, path) => {
    const pathArray = Array.isArray(path) ? path : path.split('.').filter(key => key);
    const pathArrayFlat = pathArray.flatMap(part => typeof part === 'string' ? part.split('.') : part);
    pathArrayFlat.slice(0, pathArrayFlat.length - 1).reduce((obj, key) => obj[key] = obj[key] ? obj[key] : {}, object);
};

export default create;
