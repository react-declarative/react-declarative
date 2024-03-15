import isEmpty from "../isEmpty";

type EventKey = string | symbol;
type Function = (...args: any[]) => void;

/**
 * Class representing an event emitter.
 * @class
 */
export class EventEmitter {

    private _events: Record<EventKey, Function[]> = {};

    /**
     * Check if the object has any listeners attached to it.
     *
     * @return True if the object has listeners, false otherwise.
     */
    get hasListeners() {
        return !isEmpty(this._events);
    };

    /**
     * Retrieves the listeners associated with the given event key.
     *
     * @param key - The event key to retrieve the listeners for.
     * @returns An array of listeners associated with the given event key.
     */
    public getListeners = (key: EventKey) => {
        return this._events[key] || [];
    };

    /**
     * Subscribes a callback function to the specified event name.
     *
     * @param eventName - The key of the event.
     * @param callback - The callback function to be executed when the event is triggered.
     * @returns
     */
    public subscribe = (eventName: EventKey, callback: Function) => {
        !this._events[eventName] && (this._events[eventName] = []);
        this._events[eventName].push(callback);
    };

    /**
     * Removes a callback function from the list of event listeners for the specified event.
     *
     * @param eventName - The key of the event to unsubscribe from.
     * @param callback - The callback function to remove from the event listeners.
     * @returns
     */
    public unsubscribe = (eventName: EventKey, callback: Function) => {
        !this._events[eventName] && (this._events[eventName] = []);
        this._events[eventName] = this._events[eventName].filter(eventCallback => callback !== eventCallback);
    };

    /**
     * Clears all event handlers registered for the current object.
     * @function
     * @memberof unsubscribeAll
     * @returns
     */
    public unsubscribeAll = () => {
        this._events = {};
    };

    /**
     * Subscribes a callback function to the given event name. The callback function will be triggered only once when the event is emitted.
     *
     * @param eventName - The name of the event to subscribe to.
     * @param callback - The callback function to be executed when the event is emitted.
     * @returns - A function that can be called to unsubscribe the callback function from the event.
     */
    public once = (eventName: EventKey, callback: Function) => {
        const subscriber = async (...args: any[]) => {
            await callback(...args);
            this.unsubscribe(eventName, subscriber);
        };
        this.subscribe(eventName, subscriber);
        return () => {
            this.unsubscribe(eventName, subscriber);
        };
    };

    /**
     * Emits the given event with the specified arguments.
     *
     * @param eventName - The name of the event to emit.
     * @param args - The arguments to pass to the event listeners.
     * @returns - A promise that resolves when all event listeners have completed.
     */
    public emit = async (eventName: EventKey, ...args: any[]) => {
        const event = [...this._events && this._events[eventName] || []];
        for (let i = 0; i !== event.length; i++) {
            await event[i](...args);
        }
    };

};

export default EventEmitter;
