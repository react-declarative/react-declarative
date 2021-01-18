export const get = (object: any, path: any) => {
    const pathArray = Array.isArray(path) ? path : path.split('.').filter((key: any) => key);
    const pathArrayFlat = pathArray.flatMap((part: any) => typeof part === 'string' ? part.split('.') : part);
    return pathArrayFlat.reduce((obj: any, key: any) => obj && obj[key], object);
}

export default get;
