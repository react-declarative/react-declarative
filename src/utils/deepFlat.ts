export const deepFlat = <T = any>(arr: T[] = []) => {
    const result: T[] = [];
    const process = (entries: any[] = []) => entries?.forEach((entry) => {
        const fields = entry['fields'] || [];
        const child = entry['child'] ? [ entry['child'] ] : [];
        process([...fields, ...child]);
        result.push(entry);
    });
    process(arr);
    return result;
};

export default deepFlat;
