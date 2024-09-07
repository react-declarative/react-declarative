import IAnything from "../../../model/IAnything";

/**
 * Removes empty filters from the given data object.
 *
 * @param data - The data object to remove empty filters from.
 * @returns - The data object with empty filters removed.
 *
 * @template Data - The type of data object.
 */
export const removeEmptyFilters = <Data extends {} = IAnything>(data: Data) => {
    const result: Partial<Data> = {};
    for (const key of Object.keys(data || {})) {
        // @ts-ignore
        if (data[key] === null) {
            continue;
        }
        // @ts-ignore
        if (data[key] === "") {
            continue;
        }
        // @ts-ignore
        if (data[key] === false) {
            continue;
        }
        // @ts-ignore
        result[key] = data[key];
    }
    return result as Data;
};

export default removeEmptyFilters;
