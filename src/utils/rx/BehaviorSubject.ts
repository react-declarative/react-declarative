import Subject from "./Subject";
import Observer, { LISTEN_CONNECT } from "./Observer";

import TBehaviorSubject from "../../model/TBehaviorSubject";
import TObserver, { TObservable } from "../../model/TObserver";

/**
 * Represents a BehaviorSubject that extends the Subject class and provides the functionality of an observable and an observer.
 *
 * @template Data - The type of the data that the BehaviorSubject holds.
 */
export class BehaviorSubject<Data = any> extends Subject<Data> implements TBehaviorSubject<Data>, TObservable<Data>  {

    constructor(private _data: Data | null = null) {
        super();
    };

    /**
     * Retrieves the data stored in the instance.
     *
     * @return The data stored in the instance.
     */
    get data() {
        return this._data;
    };

    /**
     * Sets the given data and calls the next method of the super class asynchronously.
     *
     * @param data - The data to be set.
     * @return Resolves when super class's next method is called.
     */
    public next = async (data: Data) => {
        this._data = data;
        await super.next(data);
    };

    /**
     * Creates a new observer.
     *
     * @returns The observer instance.
     */
    public toObserver = (): TObserver<Data> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        observer[LISTEN_CONNECT](() => {
            this._data && observer.emit(this._data);
        });
        unsubscribeRef = this.subscribe(observer.emit);
        return observer;
    };

};

export { TBehaviorSubject };

export default BehaviorSubject;
