import { useCallback, useState } from "react"

/**
 * A custom hook that returns a function for force updating a component.
 *
 * @returns The function to be used for force updating.
 */
export const useForceUpdate = () => {
    const [, setState] = useState(true)
    return useCallback(() => {
      setState(s => !s)
    }, []);
}

export default useForceUpdate;
