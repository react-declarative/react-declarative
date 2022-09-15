import EventEmitter from "./EventEmitter";

const SUBJECT_EVENT = Symbol('react-declarative-subject');

type Function = (...args: any[]) => void;

export class Subject<Data = any> {

    private _emitter = new EventEmitter();

    public subscribe = (callback: Function) => {
        this._emitter.subscribe(SUBJECT_EVENT, callback);
        return () => {
            this._emitter.unsubscribe(SUBJECT_EVENT, callback);
        }
    };

    public once = (callback: Function) => {
        return this._emitter.once(SUBJECT_EVENT, callback);
    };

    public next = (data: Data) => {
        this._emitter.emit(SUBJECT_EVENT, data);
    };

};

export default Subject;
