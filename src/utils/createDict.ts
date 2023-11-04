type Dict = Record<string, any>;

export const createDict = <T extends Dict = Dict>(record: T) => {
    const dict = Object.create(null);
    Object.assign(dict, record);
    return Object.freeze(dict);
}

export default createDict;
