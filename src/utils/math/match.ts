type Value = number | boolean;

/**
 * Executes conditional branching based on the provided conditions and returns the appropriate value.
 *
 * @template A - Type of the condition value.
 * @template T - Type of the run value.
 * @template E - Type of the not value.
 *
 * @param {Object} params - The parameters object.
 * @param {A | (() => A)} params.condition - The condition value or a function that returns the condition value.
 * @param {T | (() => T)} params.run - The run value or a function that returns the run value.
 * @param {E | (() => E)} [params.not=false] - The not value or a function that returns the not value. Defaults to false.
 *
 * @returns {A | T | E} - The result of executing the condition and returning the appropriate value.
 */
export const match = <A = Promise<Value>, T = Promise<Value>, E = false>({
    condition,
    run,
    not = false as unknown as E
}: {
    condition: A | (() => A);
    run: T | (() => T);
    not?: E | (() => E);
}): A | T | E => {
    const check = typeof condition === 'function' ? (condition as Function)() : condition;
    const result = typeof run === 'function' ? (run as Function)() : run;
    const fallback = typeof not === 'function' ? (not as Function) : not;
    if (result instanceof Promise || check instanceof Promise || fallback instanceof Promise) {
        return new Promise(async (res, rej) => {
            try {
                if (await check) {
                    res(await result);
                    return;
                }
                res(await fallback);
            } catch (error) {
                rej(error);
            }
        }) as unknown as T;
    }
    if (check) {
        return result as unknown as T;
    }
    return fallback as unknown as T;
}

export default match;
