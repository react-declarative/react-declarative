export interface IClearable {
    clear: () => void;
    flush: () => void;
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
  
    const wrappedFn = (...args: any[]) => {
      clearTimeout(timeout);
      const exec = () => {
        lastRun = null;
        run(...args);
      };
      lastRun = exec;
      timeout = setTimeout(exec, delay);
    };

    wrappedFn.clear = () => {
      clearTimeout(timeout);
      lastRun = null;
    };

    wrappedFn.flush = () => {
      clearTimeout(timeout);
      lastRun && lastRun();
    };

    return wrappedFn as T & IClearable;
};

export default debounce;
