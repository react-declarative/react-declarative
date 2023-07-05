type Value = number | boolean;

export const and = <T = Promise<Value>>(...args: T[]): T => {
    if (args.some((arg) => arg instanceof Promise)) {
        return new Promise<boolean>(async (res) => {
            const items = await Promise.all(args);
            const result = items.reduce<boolean>((acm, cur) => Boolean(acm && cur), true);
            res(result);
        }) as unknown as T;
    }
    return args.reduce<boolean>((acm, cur) => Boolean(acm && cur), true) as unknown as T;
}

export default and;
