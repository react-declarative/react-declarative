export function isEmpty(obj: Record<string | symbol, any>) {
    if (Object.getOwnPropertySymbols(obj).length !== 0) {
        return false;
    }
    if (Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
    }
    return true;
};

export default isEmpty;
