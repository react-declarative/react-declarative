import { IAwaiter, createAwaiter } from '../createAwaiter';
import sleep from '../sleep';
import singlerun from './singlerun';

/**
 * Represents a task in the execution pool.
 * 
 * @template T - The type of the result of the task.
 * @template P - The types of the parameters of the task.
 * 
 * @typedef Run
 * @property args - The arguments for the task.
 * @property awaiter - The awaiter for the task.
 */
type Run<T extends any = any, P extends any[] = any> = {
    args: P;
    awaiter: IAwaiter<T>;
}


/**
 * Represents the configuration options for the execution pool.
 * 
 * @interface
 * @property maxExec - The maximum number of executions allowed concurrently.
 * @property delay - The delay in milliseconds between executions.
 */
interface IConfig {
    maxExec: number;
    delay: number;
}

/**
 * Represents a wrapped function that returns a promise.
 * 
 * @template T - The type of the result of the wrapped function.
 * @template P - The types of the parameters of the wrapped function.
 * 
 * @interface
 * @function
 * @param args - The arguments to pass to the wrapped function.
 * @returns A promise that resolves with the result of the wrapped function.
 * @function clear - Clears all pending executions in the execution pool.
 */
export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T>;
    clear(): void;
}

/**
 * Creates an execution pool for asynchronous functions with a limited concurrency.
 * 
 * @template T - The type of the result of the wrapped function.
 * @template P - The types of the parameters of the wrapped function.
 * 
 * @function
 * @param run - The function to be executed in the pool.
 * @param options - Optional configuration options for the execution pool.
 * @returns A wrapped function that executes asynchronously within the execution pool.
 */
export const execpool = <T extends any = any, P extends any[] = any[]>(run: (...args: P) => Promise<T>, {
    maxExec = 3,
    delay = 10,
}: Partial<IConfig> = {}): IWrappedFn<T, P> => {

    const execSet = new Set<Promise<T>>();
    const execStack: Run<T, P>[] = [];

    /**
     * Executes a function with arguments and adds it to the execution pool.
     * 
     * @function
     * @param awaiter - The awaiter to resolve the function execution.
     * @param args - The arguments to pass to the function.
     */
    const execute = (awaiter: IAwaiter<T>, ...args: P) => {
        const exec = run(...args);
        execSet.add(exec);
        exec.finally(() => {
            execSet.delete(exec);
        });
        awaiter.resolve(exec);
    };

    /**
     * Initializes the execution loop for the execution pool.
     * 
     * @function
     */
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

    /**
     * The wrapped function that executes within the execution pool.
     * 
     * @function
     * @param args - The arguments to pass to the wrapped function.
     * @returns A promise that resolves with the result of the wrapped function.
     */
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

    /**
     * Clears all pending executions in the execution pool.
     * 
     * @function
     */
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
