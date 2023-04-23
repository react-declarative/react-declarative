import TObserver from "../../../model/TObserver";

import Source from "../Source";

import take from "./take";

const NEVER_VALUE = Symbol('never');

export const liveness = <T = any>(fallbackfn: () => void, waitFor = 5_000) => (target: TObserver<T>): TObserver<T> => {
    let isOk = true;
    const stream = Source.merge([
        Source.fromInterval(waitFor)
            .filter(() => {
                const isOkPrev = isOk;
                isOk = false;
                return !isOkPrev;
            })
            .operator(take(1))
            .tap(fallbackfn)
            .map(() => NEVER_VALUE),
        target.tap(() => {
            isOk = true;
        })
    ]);
    return stream.filter((value) => value !== NEVER_VALUE) as TObserver<T>;
};

export default liveness;
