import { useCallback, useMemo } from "react";

import useActualState from "./useActualState";

import singlerun from "../utils/hof/singlerun";
import sleep from "../utils/sleep";

const CHANGE_DELAY = 750;

export const useChangeDelay = (delay = CHANGE_DELAY) => {
    const [delay$, setDelay] = useActualState(false);
    const emitDelay = useMemo(() => singlerun(async () => {
        await sleep(delay);
        setDelay(false);
    }), []);
    const doDelay = useCallback(async () => {
        setDelay(true);
        await emitDelay();
    }, []);
    return {
        delay$,
        doDelay,
    };
};

export default useChangeDelay;
