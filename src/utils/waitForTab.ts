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

/**
 * Waits for a tab to be available and then calls the provided callback function.
 *
 * @param fn - The callback function to be executed when the tab is available.
 * @returns
 */
export const waitForTab = (fn: () => void) => {
    return tabSource.connect(fn);
};

export default waitForTab;
