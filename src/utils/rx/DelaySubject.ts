import Subject from "./Subject";

import TCancelableSubject from "../../model/TCancelableSubject";
import { TObservable } from "../../model/TObserver";

type Fn = (...args: any[]) => void;

class DelaySubject extends Subject<void> implements TCancelableSubject<void>, TObservable<void> {

    constructor(public readonly cancel: Fn) { 
        super();
    };

};

export const fromDelay = (delay: number): DelaySubject => {
    let timeout: NodeJS.Timer | undefined;
    const subject = new DelaySubject(() => {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
    });
    const process = () => {
        timeout = undefined;
        subject.next();
    };
    setTimeout(process, delay);
    return subject;
};

export default DelaySubject;
