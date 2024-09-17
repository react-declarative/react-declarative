/**
 * Interface representing an object that can be cleared and flushed.
 */
export interface IClearable {
    clear: () => void;
    flush: () => void;
    pending: () => boolean;
}

/**
 * Creates a debounced version of a function.
 *
 * @template T - The type of the original function.
 * @param run - The function to debounce.
 * @param [delay=1000] - The delay in milliseconds before executing the debounced function.
 * @returns - The debounced function with additional methods for clearing and flushing.
 */
export const debounce = <T extends (...args: any[]) => any>(run: T, delay = 1_000): T & IClearable => {
    let timeout: any;
    let lastRun: Function | null = null;
  
    /**
     * Wrapper function that delays the execution of a given function
     *
     * @param run - The function to be executed
     * @param delay - The delay in milliseconds
     * @returns
     */
    const wrappedFn = (...args: any[]) => {
      timeout !== null && clearTimeout(timeout);
      const exec = () => {
        lastRun = null;
        timeout = null;
        run(...args);
      };
      lastRun = exec;
      timeout = setTimeout(exec, delay);
    };

    /**
     * Clears the wrapped function from any saved state or implementation.
     *
     * @memberof wrappedFn
     */
    wrappedFn.clear = () => {
      timeout !== null && clearTimeout(timeout);
      timeout = null;
      lastRun = null;
    };

    /**
     * Flushes any queued functions within the wrapped function.
     *
     * @param wrappedFn - The wrapped function that may have queued functions.
     * @returns
     */
    wrappedFn.flush = () => {
      timeout !== null && clearTimeout(timeout);
      lastRun && lastRun();
      timeout = null;
      lastRun = null;
    };

    wrappedFn.pending = () => {
      return !!lastRun;
    };

    return wrappedFn as T & IClearable;
};

export default debounce;
