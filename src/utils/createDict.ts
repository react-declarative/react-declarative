type Dict = Record<string, any>;

/**
 * Creates a dictionary object from the given record object.
 *
 * @template T - The type of the dictionary object.
 * @param {T} record - The record object to create the dictionary from.
 * @returns {readonly T} - The frozen dictionary object.
 */
export const createDict = <T extends Dict = Dict>(record: T) => {
    const dict = Object.create(null);
    Object.assign(dict, record);
    return Object.freeze(dict);
}

export default createDict;
