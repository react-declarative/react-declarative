import { useEffect, useRef, useState } from "react";

import useSearchParams, { Value } from "./useSearchParams";

import isObject from "../utils/isObject";
import queued from "../utils/hof/queued";
import sleep from "../utils/sleep";

const DEFAULT_UPDATE_DELAY = 500;

/**
 * Represents the configuration for the search state.
 * @interface
 */
interface ISearchStateConfig {
  prefix?: string;
  updateDelay?: number;
  noCleanupOnLeave?: boolean;
  noCleanupExtra?: boolean;
}

/**
 * Represents the interface for state dispatch.
 *
 * @interface
 */
interface IStateDispatch {
  state: Record<string, Value>;
  action: "update" | "unmount";
}

/**
 * Dispatches the state for a given action.
 *
 * @param state - The state object containing state and action properties.
 * @param config - The configuration object containing prefix, noCleanupExtra, and noCleanupOnLeave properties.
 */
const dispatchState = queued(
  async (
    { state, action }: IStateDispatch,
    {
      prefix = "",
      updateDelay = DEFAULT_UPDATE_DELAY,
      noCleanupExtra = false,
      noCleanupOnLeave = false,
    }: ISearchStateConfig,
    mountRef: React.RefObject<boolean>,
  ) => {
    await sleep(updateDelay);
    if (!mountRef.current) {
      return;
    }
    if (action === "update") {
      const url = new URL(window.location.href, window.location.origin);
      Object.entries(state).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          url.searchParams.set(`${prefix}_${key}`, JSON.stringify(value));
          return;
        }
        if (isObject(value)) {
          url.searchParams.set(`${prefix}_${key}`, JSON.stringify(value));
          return;
        }
        url.searchParams.set(`${prefix}_${key}`, String(value));
      });
      if (!noCleanupExtra) {
        for (const key of [...url.searchParams.keys()]) {
          if (!key.startsWith(`${prefix}_`)) {
            url.searchParams.delete(key);
          }
        }
      }
      window.history.pushState(null, "", url.toString());
    }
    if (action === "unmount") {
      const url = new URL(window.location.href, window.location.origin);
      if (noCleanupOnLeave) {
        return;
      }
      for (const key of [...url.searchParams.keys()]) {
        url.searchParams.delete(key);
      }
      if (!noCleanupExtra) {
        for (const key of [...url.searchParams.keys()]) {
          if (!key.startsWith(`${prefix}_`)) {
            url.searchParams.delete(key);
          }
        }
      }
      window.history.pushState(null, "", url.toString());
    }
  }
);

/**
 * Custom hook useSearchState for managing search state in the URL.
 *
 * @template T - Type of the search state object.
 * @param defaultValues - Default values for the search state object.
 * @param config - The config for search state behaviour
 * @returns - An array containing the search state object and a function to update the search state.
 */
export const useSearchState = <T extends Record<string, Value>>(
  defaultValues: Partial<T> | (() => Partial<T>) = {},
  {
    prefix = "",
    updateDelay = DEFAULT_UPDATE_DELAY,
    noCleanupExtra = false,
    noCleanupOnLeave = false,
  }: ISearchStateConfig = {}
) => {
  const initialValue = useSearchParams(defaultValues, prefix);
  const [state, setState] = useState(initialValue);
  const mountRef = useRef(true);
  useEffect(() => {
    dispatchState(
      {
        action: "update",
        state,
      },
      {
        prefix,
        updateDelay,
        noCleanupExtra,
        noCleanupOnLeave,
      },
      mountRef
    );
  }, [state]);
  useEffect(
    () => () => {
      dispatchState(
        {
          action: "unmount",
          state,
        },
        {
          prefix,
          updateDelay,
          noCleanupExtra,
          noCleanupOnLeave,
        },
        mountRef
      );
      mountRef.current = false;
    },
    []
  );
  return [state, setState] as const;
};

export default useSearchState;
