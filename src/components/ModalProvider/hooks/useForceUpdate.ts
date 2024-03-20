import { useState, useCallback } from 'react';

/**
 * Returns a function that can be used to force a component re-render.
 *
 * @returns The forceUpdate function.
 */
export const useForceUpdate = () => {
  const [, setState] = useState(true);
  const forceUpdate = useCallback(() => {
    setState((s) => !s);
  }, []);

  return forceUpdate;
};

export default useForceUpdate;
