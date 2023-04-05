import Observer, { TObserver, LISTEN_CONNECT } from "../Observer";

export const fromArray = <Data = any>(data: Data): TObserver<ReadonlyArray<FlatArray<Data[], 20>>> => {
    const observer = new Observer<any>(() => undefined);
    const process = () => {
        if (Array.isArray(data)) {
            data.flat(Number.POSITIVE_INFINITY).forEach((item) => {
                observer.emit(item);
            });
        } else {
            observer.emit(data);
        }
    };
    observer[LISTEN_CONNECT](() => {
        process();
    });
    return observer;
};

export default fromArray;
