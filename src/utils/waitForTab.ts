import Source from './rx/Source';

/**
 * The tabSource variable represents a unicast source of keydown events for the "Tab" key.
 *
 * @property unicast - A function that creates a new unicast source.
 * @property create - A function that creates a new source.
 * @property fromEvent - A function that creates a new source from a specified event.
 * @property connect - A function that connects the source to an event handler function.
 * @property share - A function that shares the source with multiple subscribers.
 * @returns - The unicast source of keydown events for the "Tab" key.
 */
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
