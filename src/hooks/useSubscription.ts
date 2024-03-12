import { useEffect } from "react";

/**
 * Subscribes to a function and triggers it as a side effect.
 *
 * @param fn - The function to be subscribed to.
 */
export const useSubscription = (fn: () => () => void) => {
    useEffect(fn, []);
};

export default useSubscription;
