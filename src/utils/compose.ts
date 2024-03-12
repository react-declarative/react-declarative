export type Function = (...args: any[]) => any;

/**
 * Compose multiple functions together to create a new function that applies the given functions from right to left.
 * If no functions are given, the composed function will simply return the input argument.
 * If only one function is given, the composed function will simply return the output of that function.
 *
 * @param funcs - The functions to be composed.
 * @returns - The composed function.
 */
export const compose = (...funcs: Function[]) => {
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
