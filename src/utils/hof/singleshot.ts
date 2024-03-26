
/**
 * @interface IClearable
 * @description An interface representing an object that can be cleared.
 */
export interface IClearable {
    clear: () => void;
}

/**
 * Creates a function that is only executed once, and then memoizes and returns the result.
 *
 * @template T - The type of the function to be executed once.
 * @param run - The function to be executed once.
 * @returns - The executed function with additional "clear" method to reset the execution state.
 */
export const singleshot = <T extends (...args: any[]) => any>(run: T): T & IClearable => {
    let hasRunned = false;
    let result: ReturnType<T> = null as never;
    /**
     * Runs a function once and caches the result for subsequent calls.
     *
     * @param args - Arguments passed to the function.
     * @returns - The result of the function.
     */
    const fn = (...args: any) => {
        if (!hasRunned) {
            hasRunned = true;
            result = run(...args);
        }
        return result;
    };
    /**
     * Clears the given array or object by removing all its properties or elements.
     *
     * @param target - The array or object to be cleared.
     * @throws {TypeError} If the target is not an array or an object.
     *
     */
    fn.clear = () => {
        hasRunned = false;
    };
    return fn as T & IClearable;
};

export default singleshot;
