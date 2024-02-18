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

export const waitForTouch = (fn: () => void) => {
    return touchSource.connect(fn);
};

export default waitForTouch;
