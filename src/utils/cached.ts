
import singleshot, { IClearable } from './singleshot';

const NEVER_VALUE = Symbol('never');

export const cached = <T extends (args?: any[]) => any>(run: T): T & IClearable => {

    let lastArgs: any = NEVER_VALUE;
    
    const wrappedFn = singleshot(run);

    const clear = () => {
        lastArgs = NEVER_VALUE;
        wrappedFn.clear();
    };

    const patch = (args: any[]) => {
        lastArgs = args;
        wrappedFn.clear();
    };

    const executeFn = (...args: any[]) => {
        if (lastArgs === NEVER_VALUE) {
            patch(args);
            return wrappedFn(...args);
        } else if (args.length !== lastArgs.length) {
            patch(args);
            return wrappedFn(...args);
        } else {
            let isOk = true;
            args.forEach((arg, idx) => {
                isOk = isOk && arg === lastArgs[idx];
            });
            if (isOk) {
                return wrappedFn(...args);
            } else {
                patch(args);
                return wrappedFn(...args);
            }
        }
    };

    executeFn.clear = clear;

    return executeFn as T & IClearable;
};

export default cached;
