export const singleshot = <T extends (...args: any) => any>(run: T): T => {
    let hasRunned = false;
    let result: ReturnType<T> = null as never;
    const fn = (...args: any) => {
        if (!hasRunned) {
            result = run(...args);
        }
        return result;
    };
    return fn as T;
};

export default singleshot;
