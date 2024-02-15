import Source from './rx/Source';

const touchSource = Source.unicast(() =>
    Source.create((handler) => {
        document.addEventListener('touchstart', handler, {
            passive: false,
        });
        return () => document.removeEventListener('touchstart', handler);
    })
    .share()
);

export const waitForTouch = (fn: () => void) => {
    return touchSource.connect(fn);
};

export default waitForTouch;
