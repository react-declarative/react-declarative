type Value = number | boolean;

/**
 * Applies the logical negation operator to the given argument.
 * If the argument is a Promise, it returns a new Promise that resolves to the negation of the resolved value of the argument Promise.
 * If the argument is not a Promise, it returns the negation of the argument.
 *
 * @template T - The type of the argument and the return value.
 * @param arg - The argument to apply the logical negation operator.
 * @returns - The result of apply the logical negation operator to the argument.
 */
export const not = <T = Promise<Value>>(arg: T): T => {
    if (arg instanceof Promise) {
        return new Promise(async (res, rej) => {
            try {
                const result = await arg;
                res(!result);
            } catch (error) {
                rej(error);
            }
        }) as unknown as T;
    }
    return !arg as unknown as T;
}

export default not;
