import Subject from "./Subject";
import Observer, { LISTEN_CONNECT } from "./Observer";

import TBehaviorSubject from "../../model/TBehaviorSubject";
import TObserver, { TObservable } from "../../model/TObserver";

export class BehaviorSubject<Data = any> extends Subject<Data> implements TBehaviorSubject<Data>, TObservable<Data>  {

    constructor(private _data: Data | null = null) {
        super();
    };

    get data() {
        return this._data;
    };

    public next = async (data: Data) => {
        this._data = data;
        await super.next(data);
    };

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
