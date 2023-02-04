import isEmpty from "../isEmpty";

type EventKey = string | symbol;
type Function = (...args: any[]) => void;

export class EventEmitter {

    private _events: Record<EventKey, Function[]> = {};

    get hasListeners() {
        return !isEmpty(this._events);
    };

    subscribe = (eventName: EventKey, callback: Function) => {
        !this._events[eventName] && (this._events[eventName] = []);
        this._events[eventName].push(callback);
    };

    unsubscribe = (eventName: EventKey, callback: Function) => {
        !this._events[eventName] && (this._events[eventName] = []);
        this._events[eventName] = this._events[eventName].filter(eventCallback => callback !== eventCallback);
    };

    unsubscribeAll = () => {
        this._events = {};
    };

    once = (eventName: EventKey, callback: Function) => {
        const subscriber = (...args: any[]) => {
            callback(...args);
            this.unsubscribe(eventName, subscriber);
        };
        this.subscribe(eventName, subscriber);
        return () => {
            this.unsubscribe(eventName, subscriber);
        };
    };

    emit = (eventName: EventKey, ...args: any[]) => {
        const event = this._events[eventName];
        event && event.forEach(callback => callback(...args));
    };

};

export default EventEmitter;
