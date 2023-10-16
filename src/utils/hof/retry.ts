export const retry = <T extends (...args: any[]) => Promise<any>>(run: T, count = 5): T => {
    const wrappedFn = async (...args: any) => {
        let total = count;        
        const call = async (): Promise<any> => {
            try {
                return await run(...args);
            } catch (error) {
                if (--total === 0) {
                    throw error;
                }
                return await call();
            }
        };
        return await call();
    };
    return wrappedFn as unknown as T;
};

export default retry;
