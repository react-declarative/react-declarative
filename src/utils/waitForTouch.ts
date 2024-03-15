import Source from './rx/Source';

/**
 * Represents a touch event source that listens for touchstart and mousedown events.
 *
 * @returns An observable that emits touch or click events.
 *
 * @param event - The touch or click event object.
 *
 * @returns A function to unsubscribe from the event source.
 */
const touchSource = Source.unicast(() =>
    Source.create((handler) => {
        document.addEventListener('touchstart', handler, {
            passive: false,
        });
        document.addEventListener('mousedown', handler);
        return () => {
            document.removeEventListener('touchstart', handler);
            document.removeEventListener('mousedown', handler);
        };
    })
    .share()
);

/**
 * Waits for a touch event and calls the provided function.
 *
 * @param fn - The function to be called when a touch event occurs.
 */
export const waitForTouch = (fn: () => void) => {
    return touchSource.connect(fn);
};

export default waitForTouch;
