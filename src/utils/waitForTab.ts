import Source from './rx/Source';

export const waitForTab = (fn: () => void) => {
    return Source.fromEvent('keydown').connect((e: any) => {
        if (e.code === "Tab") {
            fn();
        }
    });
};

export default waitForTab;
