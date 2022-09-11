
type EventKey = string | symbol;
type Function = (...args: any[]) => void;

export class EventEmitter {

    private events: Record<EventKey, Function[]> = {};

    subscribe = (eventName: EventKey, callback: Function) => {
        !this.events[eventName] && (this.events[eventName] = []);
        this.events[eventName].push(callback);
    };

    unsubscribe = (eventName: EventKey, callback: Function) => {
        this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
    };

    once = (eventName: EventKey, callback: Function) => {
        const subscriber = (...args: any[]) => {
            callback(...args);
            this.unsubscribe(eventName, subscriber);
        };
        this.subscribe(eventName, subscriber);
    };

    emit = (eventName: EventKey, ...args: any[]) => {
        const event = this.events[eventName];
        event && event.forEach(callback => callback(...args));
    };

};

export default EventEmitter;
