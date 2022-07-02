export interface IClearable {
    clear: () => void;
}

export const debounce = <T extends (...args: any) => any>(run: T, delay = 1_000): T & IClearable => {
    let timeout: NodeJS.Timeout;
    
    const wrappedFn = (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => run(...args), delay);
    };

    wrappedFn.clear = () => clearTimeout(timeout);

    return wrappedFn as T & IClearable;
};

export default debounce;
