import createSsManager from "./createSsManager";

export const createSsSet = <T = string>(STORAGE_KEY: string) => {
    const storageManager = createSsManager<T[]>(STORAGE_KEY);
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
        clear: () => {
            accessManager.clear();
            storageManager.setValue([...accessManager]);
        },
    };
};

export default createSsSet;
