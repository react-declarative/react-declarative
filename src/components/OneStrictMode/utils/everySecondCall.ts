export const everySecondCall = <T extends (...args: any) => any>(callback: T): T => {
    let callCount = 0;
    let lastValue: ReturnType<T>;
    const wrappedFn = (...args: Parameters<T>): ReturnType<T> => { 
        callCount++;
        if (callCount % 2 === 1) {
            lastValue = callback(...args);
        }
        if (typeof lastValue === 'function') {
            return (() => {
                if (callCount % 2 === 0) {
                    lastValue();
                }
                return;
            }) as unknown as ReturnType<T>;
        }
        return lastValue;
    };
    return wrappedFn as T;
}

export default everySecondCall;
