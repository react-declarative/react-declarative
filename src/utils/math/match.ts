type Value = number | boolean;

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
