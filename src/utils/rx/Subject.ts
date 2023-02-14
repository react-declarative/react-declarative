import EventEmitter from "./EventEmitter";

import TSubject from "../../model/TSubject";

export const SUBJECT_EVENT = Symbol('react-declarative-subject');

type Function = (...args: any[]) => void;

export class Subject<Data = any> implements TSubject<Data> {

    private _emitter = new EventEmitter();

    constructor() {
        this.next = this.next.bind(this);
    };

    public subscribe = (callback: Function) => {
        this._emitter.subscribe(SUBJECT_EVENT, callback);
        return () => {
            this._emitter.unsubscribe(SUBJECT_EVENT, callback);
        }
    };

    unsubscribeAll = () => {
        this._emitter.unsubscribeAll();
    };

    public once = (callback: Function) => {
        return this._emitter.once(SUBJECT_EVENT, callback);
    };

    public next(data: Data) {
        this._emitter.emit(SUBJECT_EVENT, data);
    };

};

export { TSubject };

export default Subject;
