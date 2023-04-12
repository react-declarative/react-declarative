import isEmpty from "../isEmpty";

type EventKey = string | symbol;
type Function = (...args: any[]) => void;

export class EventEmitter {

    private _events: Record<EventKey, Function[]> = {};

    get hasListeners() {
        return !isEmpty(this._events);
    };

    public getListeners = (key: EventKey) => {
        return this._events[key] || [];
    };

    public subscribe = (eventName: EventKey, callback: Function) => {
        !this._events[eventName] && (this._events[eventName] = []);
        this._events[eventName].push(callback);
    };

    public unsubscribe = (eventName: EventKey, callback: Function) => {
        !this._events[eventName] && (this._events[eventName] = []);
        this._events[eventName] = this._events[eventName].filter(eventCallback => callback !== eventCallback);
    };

    public unsubscribeAll = () => {
        this._events = {};
    };

    public once = (eventName: EventKey, callback: Function) => {
        const subscriber = (...args: any[]) => {
            callback(...args);
            this.unsubscribe(eventName, subscriber);
        };
        this.subscribe(eventName, subscriber);
        return () => {
            this.unsubscribe(eventName, subscriber);
        };
    };

    public emit = (eventName: EventKey, ...args: any[]) => {
        const event = this._events[eventName];
        event && event.forEach(callback => callback(...args));
    };

};

export default EventEmitter;
