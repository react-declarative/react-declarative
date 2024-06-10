import { useMemo } from "react";

import useActualCallback from "./useActualCallback";

import singleshot, { IClearable } from "../utils/hof/singleshot";

export const useSingleshot = <T extends (...args: any[]) => any>(run: T) => {
    const run$ = useActualCallback(run);
    return useMemo((): T & IClearable => singleshot<T>(run$), []);
}

export default useSingleshot;
