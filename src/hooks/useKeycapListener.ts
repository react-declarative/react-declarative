import { useEffect } from "react";

import useActualCallback from "./useActualCallback";

const createPressHandler = (callback: () => void, ...codes: string[]) => {
  const pressed = new Set();
  let skip = false;
  const check = (code: string) => {
    if (skip) {
      return;
    }
    pressed.add(code);
    for (const code of codes) {
      if (!pressed.has(code)) {
        return;
      }
    }
    skip = true;
    setTimeout(() => (skip = false), 900);
    pressed.clear();
    callback();
  };

  const handleCheck = (event: KeyboardEvent) => {
    event.preventDefault();
    check(event.code);
  };

  const handlePress = (event: KeyboardEvent) => {
    pressed.delete(event.code);
  };

  document.addEventListener("keydown", handleCheck);
  document.addEventListener("keyup", handlePress);

  return () => {
    document.removeEventListener("keydown", handleCheck);
    document.removeEventListener("keyup", handlePress);
  };
};

export const useKeycapListener = (callback: () => void, ...codes: string[]) => {
  const callback$ = useActualCallback(callback);
  useEffect(createPressHandler(callback$, ...codes), [...codes]);
};

export const useSaveShortcut = (callback: () => void) =>
    useKeycapListener(callback, "ControlLeft", "KeyS");

export default useKeycapListener;
