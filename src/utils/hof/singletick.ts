import singleshot from "./singleshot";

export interface IClearable {
    clear: () => void;
}

/**
 * Wraps a function with a single event loop ticking behavior.
 *
 * @param run - The function to be wrapped.
 * @returns A wrapped function that executes with a single ticking behavior.
 */
export const singletick = <T extends (...args: any[]) => any>(run: T): T & IClearable => {
    let timeout: NodeJS.Timer | null = null;
    const singleshotFn = singleshot(run);
    const wrappedFn = (...args: any[]) => {
        const result = singleshotFn(...args);
        timeout !== null && clearTimeout(timeout);
        timeout = setTimeout(() => {
            singleshotFn.clear();
            timeout = null;
        }, singletick.delay);
        return result;
    };
    return wrappedFn as T & IClearable;
};

singletick.delay = 0;

export default singletick;
