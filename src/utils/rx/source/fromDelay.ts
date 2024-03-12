import Observer, { TObserver, LISTEN_CONNECT } from "../Observer";

/**
 * Creates a delayed observer that emits a void value after a specified delay.
 *
 * @param delay - The delay in milliseconds before emitting the value.
 * @returns - The delayed observer instance.
 */
export const fromDelay = (delay: number): TObserver<void> => {
    let timeout: NodeJS.Timer | undefined;
    const observer = new Observer<void>(() => {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
    });
    const process = () => {
        timeout = undefined;
        observer.emit();
    };
    observer[LISTEN_CONNECT](() => {
        setTimeout(process, delay);
    });
    return observer;
};

export default fromDelay;
