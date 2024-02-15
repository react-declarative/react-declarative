import Observer, { TObserver, LISTEN_CONNECT } from "../Observer";

export const fromEvent = (event: keyof DocumentEventMap): TObserver<DocumentEventMap[typeof event]> => {
    const observer = new Observer<DocumentEventMap[typeof event]>(() => {
        document.removeEventListener(event, observer.emit);
    });
    const process = () => {
        document.addEventListener(event, observer.emit);
    };
    observer[LISTEN_CONNECT](() => {
        process();
    });
    return observer;
};

export default fromEvent;
