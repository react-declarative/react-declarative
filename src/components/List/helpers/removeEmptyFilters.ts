import IAnything from "../../../model/IAnything";

export const removeEmptyFilters = <Data extends {} = IAnything>(data: Data) => {
    const result: Partial<Data> = {};
    for (const key of Object.keys(data || {})) {
        if (data[key] === null) {
            continue;
        }
        if (data[key] === "") {
            continue;
        }
        if (data[key] === false) {
            continue;
        }
        result[key] = data[key];
    }
    return result as Data;
};

export default removeEmptyFilters;
