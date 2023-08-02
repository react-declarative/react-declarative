export const deepFlat = <T = any>(arr: T[] = []) => {
    const result: T[] = [];
    const process = (entries: any[] = []) => entries.forEach((entry) => {
        const child = entry['child'] || [];
        process(child);
        result.push(entry);
    });
    process(arr);
    return result;
};

export default deepFlat;
