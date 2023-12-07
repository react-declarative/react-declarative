import first from "../math/first";
import BehaviorSubject from "../rx/BehaviorSubject";
import queued, { IWrappedFn as IWrappedFnInternal } from "./queued";

interface IWrappedFn<T extends any = any, P extends any[] = any> extends IWrappedFnInternal<T, P> {
    begin(): void;
    end(): Promise<void>;
}

const NEVER_VALUE = Symbol('never');

export const lock = <T extends any = any, P extends any[] = any[]>(promise: (...args: P) => Promise<T>): IWrappedFn<T, P> => {

    let lockCount = 0;
    let lockSubject = new BehaviorSubject(lockCount);

    const waitForUnlock = () => new Promise<void>((resolve) => {
        const handler = () => {
            if (lockSubject.data === 0) {
                resolve();
                return;
            }
            lockSubject.once(handler);
        }
        handler();
    });

    const executeFn = queued(async (...args: P) => {
        await waitForUnlock();
        if (first(args) === NEVER_VALUE) {
            return null as never;
        }
        return await promise(...args);
    });

    const wrappedFn = async (...args: P) => {
        return await executeFn(...args);
    };

    wrappedFn.clear = () => {
        lockSubject.next(0);
        lockCount = 0;
        lockSubject = new BehaviorSubject(lockCount);
        executeFn.clear();
    };

    wrappedFn.begin = () => {
        lockCount += 1;
        lockSubject.next(lockCount);
    };

    wrappedFn.end = async () => {
        lockCount = Math.max(lockCount - 1, 0);
        lockSubject.next(lockCount);
        await (executeFn as Function)(NEVER_VALUE);
    };

    return wrappedFn;
};

export default lock;
