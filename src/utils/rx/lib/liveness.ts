import TObserver from "../../../model/TObserver";

import Source from "../Source";

import take from "./take";

const NEVER_VALUE = Symbol('never');

/**
 * Adds liveness functionality to a given observer stream.
 *
 * @template T - The type of values in the observer stream.
 * @param {() => void} fallbackfn - The fallback function to be called when liveness times out.
 * @param {number} waitFor - The time period in milliseconds to wait for liveness before calling the fallback function. Default is 5000 milliseconds.
 * @param {TObserver<T>} target - The observer stream to add liveness functionality to.
 * @returns {TObserver<T>} - The modified observer stream with liveness functionality.
 */
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
