export const truely = (arr: (string | null)[]): string[] => {
    return (arr?.filter(v => v) || []) as string[];
}

export default truely;
