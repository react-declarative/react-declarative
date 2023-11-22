export const first = <T = any>(arr: T[] | null | undefined): T | null => {
    if (Array.isArray(arr)) {
        const [first] = arr;
        return first || null;
    }
    return null;
}

export default first;
