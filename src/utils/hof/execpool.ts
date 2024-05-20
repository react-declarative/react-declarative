import { IAwaiter, createAwaiter } from '../createAwaiter';

import sleep from '../sleep';
import singlerun from './singlerun';

type Run<T extends any = any, P extends any[] = any> = {
    args: P;
    awaiter: IAwaiter<T>;
}

/**
 * Represents a wrapped function that returns a promise.
 * @template T - The type of the result of the wrapped function.
 * @template P - The types of the parameters of the wrapped function.
 */
export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T>;
    clear(): void;
};

interface IConfig {
    maxExec: number;
    delay: number;
}

export const execpool = <T extends any = any, P extends any[] = any[]>(run: (...args: P) => Promise<T>, {
    maxExec = 3,
    delay = 10,
}: Partial<IConfig> = {}): IWrappedFn<T, P> => {

    const execSet = new Set<Promise<T>>();
    const execStack: Run<T, P>[] = [];

    const execute = (awaiter: IAwaiter<T>, ...args: P) => {
        const exec = run(...args);
        execSet.add(exec);
        exec.finally(() => {
            execSet.delete(exec);
        });
        awaiter.resolve(exec);
    };

    const initLoop = singlerun(async () => {
        while (execStack.length) {
            if (execSet.size) {
                await Promise.race(execSet);
            }
            if (execSet.size >= maxExec) {
                await sleep(delay);
                continue;
            }
            const { args, awaiter } = execStack.pop()!;
            execute(awaiter, ...args);
        }
    });

    const wrappedFn: IWrappedFn<T, P> = async (...args: P): Promise<T> => {
        const [result, awaiter] = createAwaiter<T>();
        if (execSet.size < maxExec) {
            execute(awaiter, ...args);
        } else {
            execStack.unshift({
                awaiter,
                args,
            });
            initLoop();
        }
        return await result;
    };

    wrappedFn.clear = () => {
        while (execStack.length) {
            execStack.pop();
        }
        execSet.clear();
        initLoop.clear();
    };

    return wrappedFn;
};

export default execpool;
