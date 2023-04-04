import Observer, { TObserver, LISTEN_CONNECT } from "../Observer";

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
