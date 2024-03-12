type Value = number | boolean;

/**
 * Performs a logical AND operation on multiple values.
 *
 * @template T - The type of the values
 * @param {T[]} args - The values to perform the logical AND operation on
 * @returns {T} - The result of the logical AND operation
 */
export const and = <T = Promise<Value>>(...args: T[]): T => {
    if (args.some((arg) => arg instanceof Promise)) {
        return new Promise<boolean>(async (res, rej) => {
            try {
                const items = await Promise.all(args);
                const result = items.reduce<boolean>((acm, cur) => Boolean(acm && cur), true);
                res(result);
            } catch (error) {
                rej(error);
            }
        }) as unknown as T;
    }
    return args.reduce<boolean>((acm, cur) => Boolean(acm && cur), true) as unknown as T;
}

export default and;
