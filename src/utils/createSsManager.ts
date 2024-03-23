import reloadPage from "./reloadPage";

/**
 * A utility class for managing session storage values.
 *
 * @param STORAGE_KEY - The key used to store the value in session storage.
 * @returns - An instance of the class with methods for getting, setting, and clearing the value.
 *
 * @template T - The type of the value stored in session storage.
 */
export const createSsManager = <T = Record<string, any>>(STORAGE_KEY: string) => new class {

    /**
     * Retrieves the value from the sessionStorage.
     *
     * @returns The value retrieved from sessionStorage, or null if an error occurred while parsing or the value is not found.
     */
    getValue = (): T | null => {
        try {
            return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
        } catch {
            return null;
        }
    };

    /**
     * Sets the value in the session storage.
     *
     * @param value - The value to be set.
     * @returns
     */
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
