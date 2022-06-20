
interface IClearable {
    clear: () => void;
}

export const singleshot = <T extends (...args: any) => any>(run: T): T & IClearable => {
    let hasRunned = false;
    let result: ReturnType<T> = null as never;
    const fn = (...args: any) => {
        if (!hasRunned) {
            result = run(...args);
        }
        return result;
    };
    fn.clear = () => {
        hasRunned = false;
    };
    return fn as T & IClearable;
};

export default singleshot;
