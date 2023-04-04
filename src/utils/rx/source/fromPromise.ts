import Observer, { TObserver, LISTEN_CONNECT } from "../Observer";

export const fromPromise = <Data = any>(callbackfn: () => Promise<Data>, fallbackfn?: (e: Error) => void): TObserver<Data> => {
    let isCanceled = false;
    const observer = new Observer(() => {
        isCanceled = true;
    });
    const process = async () => {
        try {
            const result = await callbackfn();
            if (!isCanceled) {
                observer.emit(result);
            }
        } catch (e: any) {
            if (fallbackfn) {
                fallbackfn(e);
            } else {
                throw e;
            }
        }
    };
    observer[LISTEN_CONNECT](() => {
        process();
    });
    return observer;
};

export default fromPromise;
