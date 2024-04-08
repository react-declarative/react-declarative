import reloadPage from "./reloadPage";

/**
 * A utility class for managing local storage values.
 * @template T - The type of the value to be stored in local storage.
 * @param STORAGE_KEY - The key to use when storing the value in local storage.
 * @returns - An instance of the createLsManager class.
 */
export const createLsManager = <T = Record<string, any>>(STORAGE_KEY: string) => new class {

    /**
     * Returns the value stored in localStorage using the specified key.
     *
     * @template T - The type of the value to be returned.
     * @returns - The value stored in localStorage or null if an error occurs during parsing.
     */
    getValue = (): T | null => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        } catch {
            return null;
        }
    };

    /**
     * Sets a value in the local storage.
     *
     * @param value - The value to be stored in the local storage.
     * @throws - If the local storage exceeds the quota.
     */
    setValue = (value: T) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value, null, 2));
        } catch (error) {
            if (error instanceof DOMException) {
                console.log('react-declarative createLsManager exceeded the quota');
                localStorage.clear();
                reloadPage();
            }
        }
    };

    clear = () => {
        localStorage.removeItem(STORAGE_KEY)
    };

};

export default createLsManager;
