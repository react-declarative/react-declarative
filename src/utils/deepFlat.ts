import IAnything from "../model/IAnything";

export const deepFlat = (arr: IAnything[] = [], fieldName = 'fields') => {
    const result: IAnything[] = [];
    const process = (entries: IAnything[] = []) => entries.forEach((entry) => {
        if (Array.isArray(entry[fieldName])) {
            process(entry[fieldName])
        }
        result.push(entry);
    });
    process(arr);
    return result;
};

export default deepFlat;