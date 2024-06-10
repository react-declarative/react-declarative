import { useMemo } from "react";

import useActualCallback from "./useActualCallback";

import singleshot from "../utils/hof/singleshot";

export const useSingleshot = <T extends (...args: any[]) => any>(run: T) => {
    const run$ = useActualCallback(run);
    return useMemo(() => singleshot<T>(run$), []);
}

export default useSingleshot;
