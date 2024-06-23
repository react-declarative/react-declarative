import createLsManager from "./createLsManager";

export const createLsSet = <T = string>(STORAGE_KEY: string) => {
    const storageManager = createLsManager<T[]>(STORAGE_KEY);
    const accessManager = new Set<T>(storageManager.getValue() || []);
    return {
        has: (value: T) => accessManager.has(value),
        add: (value: T) => {
            accessManager.add(value);
            storageManager.setValue([...accessManager]);
        },
        delete: (value: T) => {
            accessManager.delete(value);
            storageManager.setValue([...accessManager]);
        },
        toSet: () => accessManager,
    };
};

export default createLsSet;
