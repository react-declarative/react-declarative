import EventEmitter from "./EventEmitter";

const SUBJECT_EVENT = Symbol('react-declarative-subject');

export class Subject<Data = any> {

    private emitter = new EventEmitter();

    subscribe = (handler: Function) => {
        this.emitter.subscribe(SUBJECT_EVENT, handler);
        return () => {
            this.emitter.unsubscribe(SUBJECT_EVENT, handler);
        }
    };

    next = (data: Data) => {
        this.emitter.emit(SUBJECT_EVENT, data);
    };

};

export default Subject;
