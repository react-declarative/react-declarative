import singleshot from "./singleshot";

export interface IClearable {
    clear: () => void;
}

export const singletick = <T extends (...args: any[]) => any>(run: T): T & IClearable => {
    let timeout: NodeJS.Timer | null = null;
    const singleshotFn = singleshot(run);
    const wrappedFn = (...args: any[]) => {
        const result = singleshotFn(...args);
        timeout !== null && clearTimeout(timeout);
        timeout = setTimeout(() => {
            result.clear();
            timeout = null;
        }, singletick.delay);
        return result;
    };
    return wrappedFn as T & IClearable;
};

singletick.delay = 0;

export default singletick;
