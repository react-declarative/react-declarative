import Source from './rx/Source';

const MOVE_DELTA = 20;

/**
 * Represents a source of mouse events.
 *
 * @typedef MouseSource
 * @property create - Creates a mouse source.
 */
const mouseSource = Source.create((handler) => {
    document.addEventListener('mousemove', handler);
    return () => document.removeEventListener('mousemove', handler);
});

/**
 * Creates a touch event source.
 *
 * @param handler - The event handler function to be called when touchmove event occurs.
 * @returns cleanup - A cleanup function that removes the event listener when called.
 */
const touchSource = Source.create((handler) => {
    document.addEventListener('touchmove', handler);
    return () => document.removeEventListener('touchmove', handler);
});

/**
 * Represents a source for the scroll event.
 *
 * @typedef ScrollSource
 * @property create - Creates a new scroll source.
 */
const scrollSource = Source.create((handler) => {
    document.addEventListener('scroll', handler);
    return () => document.removeEventListener('scroll', handler);
});

/**
 * [Description of the variable]
 *
 * The moveSource variable represents a unicast Source that combines multiple input sources (mouse, touch, and scroll) to track movement events.
 *
 * @type {Source}
 * @private
 */
const moveSource = Source.unicast(() => {
    let count = 0;
    return Source.merge([
        mouseSource,
        touchSource,
        scrollSource,
    ])
    .filter(() => {
        if (count !== MOVE_DELTA) {
            count = count + 1;
            return false;
        }
        return true;
    })
    .tap(() => {
        count = 0;
    })
    .share()
});

/**
 * Waits for a move to occur and executes the provided function.
 *
 * @param fn - The function to be executed when a move occurs.
 * @returns
 */
export const waitForMove = (fn: () => void) => {
    return moveSource.connect(fn);
};

export default waitForMove;
