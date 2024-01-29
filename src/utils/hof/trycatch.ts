interface IConfig {
    fallback?: (error: Error) => void
    defaultValue: null | false;
}

const awaiter = async <V extends any>(value: Promise<V>, { fallback, defaultValue }: IConfig) => {
    try {
        return await value;
    } catch (error) {
        fallback && fallback(error as Error);
        return defaultValue;
    }
};

export const trycatch = <T extends (...args: A) => any, A extends any[], V extends any>(run: T, {
    fallback,
    defaultValue = null,
}: Partial<IConfig> = {}): (...args: A) => ReturnType<T> | null => {
    return (...args) => {
        try {
            const result = run(...args);
            if (result instanceof Promise) {
                return awaiter<V>(result, { fallback, defaultValue });
            }
            return result;
        } catch (error) {
            fallback && fallback(error as Error);
            return defaultValue;
        }
    };
}

export default trycatch;
