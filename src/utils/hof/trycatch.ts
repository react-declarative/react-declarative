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

/**
 * A higher-order function that wraps the provided function with a try-catch block. It catches any errors that occur during the execution of the function and handles them according to
 * the specified configuration.
 *
 * @template T - The type of the function being wrapped
 * @template A - An array of arguments that the function accepts
 * @template V - The type of the value returned by the function
 *
 * @param run - The function to be wrapped
 * @param config - The configuration object
 * @param config.fallback - The fallback function to be called with the caught error (optional)
 * @param config.defaultValue - The default value to be returned if an error occurs (optional, default: null)
 *
 * @returns - The wrapped function that handles errors and returns the result or the default value
 */
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
