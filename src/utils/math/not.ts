type Value = number | boolean;

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
