export const last = <T = any>(arr: T[]): T | null => {
    if (Array.isArray(arr)) {
        const [last] = arr.slice(-1);
        return last || null;
    }
    return arr as never;
}

export default last;
