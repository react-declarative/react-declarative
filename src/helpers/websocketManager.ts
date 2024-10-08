import Subject from "../utils/rx/Subject";

/**
 * WebSocket manager for handling WebSocket disconnect event
 */
export const websocketManager = new class {

    /**
     * Subject for handling WebSocket close events.
     * @type The subject for close events.
     * @private
     */
    readonly _closeSubject = new Subject<CloseEvent>();

    /**
     * Initializes the WebSocket manager by overriding the native WebSocket class.
     */
    init = () => {
        const self = this;
        const OriginalWebSocket = window.WebSocket;
        /**
         * Custom WebSocket class that extends the original WebSocket class to intercept close events.
         * @class
         */
        const ManagedWebSocket = class extends OriginalWebSocket {
            /**
             * Creates an instance of ManagedWebSocket.
             * @param args - Arguments to pass to the original WebSocket constructor.
             */
            constructor(...args: ConstructorParameters<typeof OriginalWebSocket>) {
                super(...args);
                this.addEventListener('close', (e) => {
                    self._closeSubject.next(e);
                });
                this.addEventListener('error', (e: any) => {
                    self._closeSubject.next(e);
                });
            }
        };
        /**
         * Replace the original WebSocket with the managed WebSocket
         */
        (window as any).WebSocket = ManagedWebSocket;
    };

    /**
     * Subscribes to WebSocket close events.
     * @param fn - The function to call when a WebSocket is closed.
     * @returns An unsubscribe function.
     */
    listenDisconnect = (fn: (e: CloseEvent) => void) => {
        return this._closeSubject.subscribe(fn);
    };

}

export default websocketManager;
