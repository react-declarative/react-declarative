export const deepFlat = <T = any>(arr: T[] = [], fieldName = 'fields') => {
    const result: T[] = [];
    const process = (entries: T[] = []) => entries.forEach((entry) => {
        if (Array.isArray(entry[fieldName])) {
            process(entry[fieldName])
        }
        result.push(entry);
    });
    process(arr);
    return result;
};

export default deepFlat;