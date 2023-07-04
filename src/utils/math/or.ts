type Value = number | boolean;

export const or = <T = Promise<Value>>(...args: T[]): T => {
    if (args[0] instanceof Promise) {
        return new Promise<boolean>(async (res) => {
            const items = await Promise.all(args);
            const result = items.reduce<boolean>((acm, cur) => Boolean(acm || cur), false);
            res(result);
        }) as unknown as T;
    }
    return args.reduce<boolean>((acm, cur) => Boolean(acm || cur), false) as unknown as T;
}

export default or;
