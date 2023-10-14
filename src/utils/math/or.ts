type Value = number | boolean;

export const or = <T = Promise<Value>>(...args: T[]): T => {
    if (args.some((arg) => arg instanceof Promise)) {
        return new Promise<boolean>(async (res, rej) => {
            try {
                const items = await Promise.all(args);
                const result = items.reduce<boolean>((acm, cur) => Boolean(acm || cur), false);
                res(result);
            } catch {
                rej(false);
            }
        }) as unknown as T;
    }
    return args.reduce<boolean>((acm, cur) => Boolean(acm || cur), false) as unknown as T;
}

export default or;
