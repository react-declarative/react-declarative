export const compose = (...funcs: Function[][] | Function[]) => {
    funcs = funcs.flat();
    if (funcs.length === 0) {
        return <T>(arg: T) => arg
    }
    if (funcs.length === 1) {
        return funcs[0]
    }
    return funcs.reduce(
        (a, b) =>
            (...args: any) =>
                a(b(...args))
    );
};

export default compose;
