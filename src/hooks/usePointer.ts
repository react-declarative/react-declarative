import { useMemo } from "react";

import createPointer from "../utils/oop/Pointer";

/**
 * Creates a pointer using the given reference.
 *
 * @template T - The type of the reference object.
 * @param ref - The reference object.
 * @returns - The pointer object.
 */
export const usePointer = <T extends object>(ref?: T) => {
    return useMemo(() => createPointer(ref), []);
};

export default usePointer;
