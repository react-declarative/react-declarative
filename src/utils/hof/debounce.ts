export interface IClearable {
    clear: () => void;
    flush: () => void;
}

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
