import { TIMEOUT_SYMBOL } from './timeout';

import createAwaiter from "../createAwaiter";
import sleep from "../sleep";

import { TSubject } from "../rx/Subject";

export const waitForNext = async <T = any>(subject: TSubject<T>, condition: (t: T) => boolean, delay = 0): Promise<T | typeof TIMEOUT_SYMBOL> => {
    let unsubscribeRef: Function | undefined;
    let isFinished = false;
    const [promise, { resolve }] = createAwaiter<T | typeof TIMEOUT_SYMBOL>();
    unsubscribeRef = subject.subscribe((value) => {
        if (condition(value)) {
            unsubscribeRef && unsubscribeRef();
            isFinished = true;
            resolve(value);
        }
    });
    delay && sleep(delay).then(() => {
        if (isFinished) {
            return;
        }
        unsubscribeRef && unsubscribeRef();
        resolve(TIMEOUT_SYMBOL);
    });
    return promise;
};

export default waitForNext;
