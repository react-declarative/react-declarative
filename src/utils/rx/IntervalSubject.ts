import Subject from "./Subject";

import TCancelableSubject from "../../model/TCancelableSubject";
import { TObservable } from "../../model/TObserver";

type Fn = (...args: any[]) => void;

class IntervalSubject extends Subject<number> implements TCancelableSubject<number>, TObservable<number> {

    constructor(public readonly cancel: Fn) { 
        super();
    };

};

export const fromInterval = (delay: number): IntervalSubject => {
    let timeout: NodeJS.Timer;
    let iterationIdx = 0;
    const subject = new IntervalSubject(() => {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
    });
    const process = () => {
        subject.next(iterationIdx);
        iterationIdx++;
        timeout = setTimeout(process, delay);
    };
    process();
    return subject;
};

export default IntervalSubject;
