import reloadPage from "./reloadPage";

/**
 * A utility class for managing session storage values.
 *
 * @param {string} STORAGE_KEY - The key used to store the value in session storage.
 * @returns {object} - An instance of the class with methods for getting, setting, and clearing the value.
 *
 * @template T - The type of the value stored in session storage.
 */
export const createSsManager = <T = Record<string, any>>(STORAGE_KEY: string) => new class {

    getValue = (): T | null => {
        try {
            return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
        } catch {
            return null;
        }
    };

    setValue = (value: T) => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value, null, 2));
        } catch (error) {
            if (error instanceof DOMException) {
                console.log('react-declarative createSsManager exceeded the quota');
                sessionStorage.clear();
                reloadPage();
            }
        }
    };

    clear = () => {
        sessionStorage.removeItem(STORAGE_KEY)
    };

};

export default createSsManager;
