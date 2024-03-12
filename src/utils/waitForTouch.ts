import Source from './rx/Source';

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
 * @param {Function} fn - The function to be called when a touch event occurs.
 */
export const waitForTouch = (fn: () => void) => {
    return touchSource.connect(fn);
};

export default waitForTouch;
