export const first = <T = any>(arr: T[]): T | null => {
    if (Array.isArray(arr)) {
        const [first] = arr;
        return first || null;
    }
    return arr as never;
}

export default first;
