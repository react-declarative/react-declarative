export const isNullOrUndefined = (obj: any) => {
    return typeof obj === 'undefined' || obj === null;
};

export default isNullOrUndefined;
