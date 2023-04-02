import Subject from "./Subject";

import TCancelableSubject from "../../model/TCancelableSubject";
import { TObservable } from "../../model/TObserver";

type Fn = (...args: any[]) => void;

class PromiseSubject<Data = any> extends Subject<Data> implements TCancelableSubject<Data>, TObservable<Data> {

    constructor(public readonly cancel: Fn) { 
        super();
    };

};

export const fromPromise = <Data = any>(callbackfn: (() => Promise<Data>) | Promise<Data>, fallbackfn?: (e: Error) => void): PromiseSubject<Data> => {
    let isCanceled = false;
    const subject = new PromiseSubject(() => {
        isCanceled = true;
    });
    const process = async () => {
        try {
            const result = typeof callbackfn === 'function'
                ? await callbackfn()
                : await callbackfn;
            if (!isCanceled) {
                subject.next(result);
            }
        } catch (e: any) {
            if (fallbackfn) {
                fallbackfn(e);
            } else {
                throw e;
            }
        }
    };
    process();
    return subject;
};

export default PromiseSubject;
