export const last = <T = any>(arr: T[] | null | undefined): T | null => {
    if (Array.isArray(arr)) {
        const [last] = arr.slice(-1);
        return last || null;
    }
    return null;
}

export default last;
