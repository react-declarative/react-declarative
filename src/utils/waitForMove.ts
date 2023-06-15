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

const moveSource = Source.unicast(() =>
    Source.merge([
        mouseSource,
        touchSource,
        scrollSource,
    ])
    .share()
);

export const waitForMove = (fn: () => void) => {
    let count = 0;
    return moveSource.connect(() => {
        if (count !== MOVE_DELTA) {
            count = count + 1;
            return;
        }
        count = 0;
        fn();
    });
};

export default waitForMove;
