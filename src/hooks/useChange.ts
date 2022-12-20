import { useEffect, useRef, useMemo } from 'react';

const Destructor = () => undefined;

export const useChange = (
  effect: React.EffectCallback,
  deps: React.DependencyList = [],
  stopWatchByDefault = false,
) => {
  const initialChange = useRef(true);
  const stopWatch = useRef(stopWatchByDefault);

  useEffect(() => {
    if (initialChange.current) {
      initialChange.current = false;
      return Destructor;
    }
    if (stopWatch.current) {
      return Destructor;
    }
    return effect() || Destructor;
  }, deps);

  return useMemo(
    () => ({
      resetWatcher: () => {
        initialChange.current = true;
      },
      beginWatch: () => {
        initialChange.current = false;
        stopWatch.current = false;
      },
      stopWatch: () => {
        stopWatch.current = true;
      },
    }),
    [],
  );
};

export default useChange;
