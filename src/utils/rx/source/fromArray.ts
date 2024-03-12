import Observer, { TObserver, LISTEN_CONNECT } from "../Observer";

/**
 * Creates an observer that emits a flattened and filtered array of data.
 *
 * @template Data - The type of data being observed.
 * @param {Data} data - The data to observe.
 * @returns {TObserver<ReadonlyArray<FlatArray<Data[], 20>>>} - The observer that emits the flattened and filtered array of data.
 */
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
