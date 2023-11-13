export const createSsManager = <T = Record<string, any>>(STORAGE_KEY: string) => new class {

    getValue = (): T | null => {
        try {
            return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
        } catch {
            return null;
        }
    };

    setValue = (value: T) => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value, null, 2));
    };

    clear = () => {
        sessionStorage.removeItem(STORAGE_KEY)
    };

};

export default createSsManager;
