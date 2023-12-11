import { useState, useCallback } from 'react';

export const useForceUpdate = () => {
  const [, setState] = useState(true);
  const forceUpdate = useCallback(() => {
    setState((s) => !s);
  }, []);

  return forceUpdate;
};

export default useForceUpdate;
