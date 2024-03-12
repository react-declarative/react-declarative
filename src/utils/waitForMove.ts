import Source from './rx/Source';

const MOVE_DELTA = 20;

const mouseSource = Source.create((handler) => {
    document.addEventListener('mousemove', handler);
    return () => document.removeEventListener('mousemove', handler);
});

const touchSource = Source.create((handler) => {
    document.addEventListener('touchmove', handler);
    return () => document.removeEventListener('touchmove', handler);
});

const scrollSource = Source.create((handler) => {
    document.addEventListener('scroll', handler);
    return () => document.removeEventListener('scroll', handler);
});

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
 * @param {Function} fn - The function to be executed when a move occurs.
 * @returns {void}
 */
export const waitForMove = (fn: () => void) => {
    return moveSource.connect(fn);
};

export default waitForMove;
