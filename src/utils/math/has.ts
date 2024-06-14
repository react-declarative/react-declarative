export const has = <T = unknown>(arr: T | T[] | Set<T> | Map<T, unknown> | null | undefined, value: T) => {
    if (arr instanceof Array) {
        return arr.includes(value);
    }
    if (arr instanceof Set) {
        return arr.has(value);
    }
    if (arr instanceof Map) {
        return arr.has(value);
    }
    if (arr) {
        return arr === value;
    }
    return false;
}

export default has;
