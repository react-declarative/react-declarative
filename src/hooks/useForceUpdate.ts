import { useCallback, useState } from "react"

/**
 * A custom hook that returns a function for force updating a component.
 *
 * @returns {function} The function to be used for force updating.
 * @example
 * useForceUpdate();
 */
export const useForceUpdate = () => {
    const [, setState] = useState(true)
    return useCallback(() => {
      setState(s => !s)
    }, []);
}

export default useForceUpdate;
