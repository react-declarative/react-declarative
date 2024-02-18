import Source from './rx/Source';

const tabSource = Source.unicast(() =>
    Source.create<void>((handler) => {
        return Source.fromEvent('keydown').connect((e: any) => {
            if (e.code === "Tab") {
                handler();
            }
        })
    })
    .share()
);

export const waitForTab = (fn: () => void) => {
    return tabSource.connect(fn);
};

export default waitForTab;
