import { Source as SourceBase } from "functools-kit";
import type { TObserver } from "functools-kit";

/**
 * The Source class provides utility functions for creating and manipulating Observers.
 * Everything is inherited from functools-kit except the DOM-specific `fromEvent`.
 */
export class Source extends SourceBase {
    /**
     * Creates an observer that emits events from a specified event on the document.
     * The listener is attached lazily on the first subscription and detached on unsubscribe.
     *
     * @param event - The event to listen for.
     * @returns - The observer instance.
     */
    public static fromEvent = <K extends keyof DocumentEventMap>(event: K): TObserver<DocumentEventMap[K]> => {
        return SourceBase.create<DocumentEventMap[K]>((next) => {
            if (!("document" in globalThis)) {
                return;
            }
            document.addEventListener(event, next);
            return () => document.removeEventListener(event, next);
        });
    };
}

export default Source;
