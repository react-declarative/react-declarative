import Observer, { TObserver, LISTEN_CONNECT } from "../Observer";

/**
 * Creates an observer that emits a value after a specified delay.
 *
 * @param delay - The delay in milliseconds.
 * @returns - The observer that emits values after the specified delay.
 */
export const fromInterval = (delay: number): TObserver<number> => {
    let timeout: NodeJS.Timer;
    let iterationIdx = 0;
    const observer = new Observer<number>(() => {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
    });
    const process = () => {
        observer.emit(iterationIdx);
        iterationIdx++;
        timeout = setTimeout(process, delay);
    };
    observer[LISTEN_CONNECT](() => {
        process();
    });
    return observer;
};

export default fromInterval;
