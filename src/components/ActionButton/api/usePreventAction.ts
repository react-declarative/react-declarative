import { useState } from "react";

/**
 * Represents a set of parameters for a certain functionality.
 *
 * @interface
 */
interface IParams {
  disabled?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
}

/**
 * A hook that allows preventing an action based on loading state.
 * @param [IParams] - The parameters for the hook.
 * @param [onLoadStart] - The function to execute when the loading starts.
 * @param [onLoadEnd] - The function to execute when the loading ends.
 * @param [disabled] - Whether the action is disabled.
 * @returns - An object containing the handleLoadStart, handleLoadEnd, and loading properties.
 */
export const usePreventAction = ({
  onLoadStart,
  onLoadEnd,
  disabled,
}: IParams = {}) => {
  const [loading, setLoading] = useState(0);
  return {
    handleLoadStart: () => {
      onLoadStart && onLoadStart();
      setLoading((loading) => loading + 1);
    },
    handleLoadEnd: (isOk: boolean) => {
      onLoadEnd && onLoadEnd(isOk);
      setLoading((loading) => loading - 1);
    },
    loading: !!loading || disabled,
  } as const;
};

export default usePreventAction;
