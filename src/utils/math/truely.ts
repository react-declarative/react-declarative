export const truely = <T = string>(arr: (T | null)[]): T[] => {
    return (arr?.filter(v => v) || []) as T[];
}

export default truely;
