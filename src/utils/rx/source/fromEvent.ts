import Observer, { TObserver, LISTEN_CONNECT } from "../Observer";

/**
 * Creates an observer that emits events from a specified event on the document.
 *
 * @param {keyof DocumentEventMap} event - The event to listen for.
 * @returns {TObserver<DocumentEventMap[typeof event]>} - The observer instance.
 */
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
