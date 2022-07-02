
type EventKey = string | symbol;

export class EventEmitter {

    private events: Record<EventKey, Function[]> = {};

    subscribe = (eventName: EventKey, callback: Function) => {
        !this.events[eventName] && (this.events[eventName] = []);
        this.events[eventName].push(callback);
    };

    unsubscribe = (eventName: EventKey, callback: Function) => {
        this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
    };

    emit = (eventName: EventKey, ...args: any[]) => {
        const event = this.events[eventName];
        event && event.forEach(callback => callback.call(null, ...args));
    };

};

export default EventEmitter;
