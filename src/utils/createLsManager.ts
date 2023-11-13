export const createLsManager = <T = Record<string, any>>(STORAGE_KEY: string) => new class {

    getValue = (): T | null => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        } catch {
            return null;
        }
    };

    setValue = (value: T) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value, null, 2));
    };

    clear = () => {
        localStorage.removeItem(STORAGE_KEY)
    };

};

export default createLsManager;
