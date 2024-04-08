import { useState, useEffect, useRef } from "react";

import { MemoryHistory, BrowserHistory, HashHistory } from "history";

import useConfirm from "../../../hooks/useConfirm";

import compose from "../../../utils/compose";

const LEAVE_MESSAGE = "The form contains unsaved changes. Continue?";

/**
 * Represents the parameters for a specific operation.
 *
 * @interface IParams
 */
interface IParams {
  history: MemoryHistory | BrowserHistory | HashHistory;
  withConfirm?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
}

/**
 * Prevents navigation, displays confirmation prompt if specified,
 * and handles loading state changes.
 *
 * @param history - The history object from react-router-dom.
 * @param withConfirm - Determines if a confirmation prompt should be displayed before navigating.
 * @param onLoadStart - Callback function invoked when loading starts.
 * @param onLoadEnd - Callback function invoked when loading ends.
 * @returns Object containing methods and state for preventing navigation and handling loading state.
 */
export const usePreventNavigate = ({
  history,
  withConfirm = false,
  onLoadStart,
  onLoadEnd,
}: IParams) => {
  const [loading, setLoading] = useState(0);
  const [unblocked, setUnblocked] = useState(false);

  const unsubscribeRef = useRef<Function | null>(null);

  const pickConfirm = useConfirm({
    title: "Continue?",
    msg: LEAVE_MESSAGE,
  });

  useEffect(() => {
    /**
     * Handle navigation logic
     *
     * @param retry - Function to retry navigation
     */
    const handleNavigate = (retry: () => void) => {
      if (withConfirm) {
        pickConfirm().then((result) => {
          if (result) {
            unsubscribeRef.current && unsubscribeRef.current();
            retry();
          }
        });
      }
    };

    /**
     * Creates a router blocker function which is used to block navigation in the history.
     *
     * @returns A blocker function that calls the handleNavigate function when navigation is blocked.
     */
    const createRouterBlocker = () =>
      history.block(({ retry }) => handleNavigate(retry));

    const createUnloadBlocker = () => {
      const handler = (e: any) => {
        e.preventDefault();
        return LEAVE_MESSAGE;
      };
      window.addEventListener("beforeunload", handler);
      return () => {
        window.removeEventListener("beforeunload", handler);
      };
    };

    if (loading && !unblocked) {
      unsubscribeRef.current && unsubscribeRef.current();
      unsubscribeRef.current = compose(
        createRouterBlocker(),
        createUnloadBlocker()
      );
    }
    return () => {
      unsubscribeRef.current && unsubscribeRef.current();
    };
  }, [loading, unblocked, withConfirm]);

  /**
   * Configuration for handling loading state and blocking/unblocking functionality.
   * @typedef Config
   * @property handleLoadStart - Function called when load starts. Increases loading count and calls onLoadStart if defined.
   * @property handleLoadEnd - Function called when load ends. Decreases loading count and calls onLoadEnd if defined.
   * @property unblock - Function to unblock the configuration. Calls the unsubscribeRef if defined and sets unblocked to true.
   * @property block - Function to block the configuration. Sets unblocked to false.
   * @property loading - Indicates whether the configuration is currently loading.
   */
  return {
    handleLoadStart: () => {
      onLoadStart && onLoadStart();
      setLoading((loading) => loading + 1);
    },
    handleLoadEnd: (isOk: boolean) => {
      onLoadEnd && onLoadEnd(isOk);
      setLoading((loading) => loading - 1);
    },
    unblock: () => {
      unsubscribeRef.current && unsubscribeRef.current();
      setUnblocked(true);
    },
    block: () => {
      setUnblocked(false);
    },
    loading: !!loading,
  } as const;
};

export default usePreventNavigate;
