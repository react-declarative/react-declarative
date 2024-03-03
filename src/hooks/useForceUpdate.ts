import { useCallback, useState } from "react"

export const useForceUpdate = () => {
    const [, setState] = useState(true)
    return useCallback(() => {
      setState(s => !s)
    }, []);
}

export default useForceUpdate;
