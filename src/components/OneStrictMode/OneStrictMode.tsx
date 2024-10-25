import React, { useRef } from "react";
import { useEffect, useLayoutEffect } from 'react';

import everySecondCall from './utils/everySecondCall';
import sleep from '../../utils/sleep';

import useAsyncValue from '../../hooks/useAsyncValue';

const PROBE_DELAY = 600;

interface IOneStrictModeProps {
    enable: boolean;
    children: React.ReactNode;
}

let useEffectRef = useEffect;
let useLayoutEffectRef = useLayoutEffect;

const useEffectSafe: typeof useEffect  = (fn, deps) => useEffect(everySecondCall(fn), deps); 
const useLayoutEffectSafe: typeof useLayoutEffect  = (fn, deps) => useLayoutEffect(everySecondCall(fn), deps); 

export const OneStrictMode = ({
    enable = false,
    children,
}: IOneStrictModeProps) => {

  const strictModeCounterRef = useRef(0);

  const [ready] = useAsyncValue(async () => {
    await sleep(PROBE_DELAY);
    return true;
  });

  useEffect(() => {
    strictModeCounterRef.current++;
    if (strictModeCounterRef.current === 2 || enable) {
        useEffectRef = useEffectSafe;
        useLayoutEffectRef = useLayoutEffectSafe;
    }
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <>
        {children}
    </>
  );
};

const useEffectWrapped: typeof useEffect = (...args) => useEffectRef(...args);
const useLayoutEffectWrapped: typeof useLayoutEffect = (...args) => useLayoutEffectRef(...args);

OneStrictMode.useEffect = useEffectWrapped;
OneStrictMode.useLayoutEffect = useLayoutEffectWrapped;

OneStrictMode.install = () => {
    Object.assign(React, {
        useEffect: useEffectWrapped,
        useLayoutEffect: useLayoutEffectWrapped,
    });
};

export default OneStrictMode;
