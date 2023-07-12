import { useEffect } from "react";

export const useSubscription = (fn: () => () => void) => {
    useEffect(fn, []);
};

export default useSubscription;
