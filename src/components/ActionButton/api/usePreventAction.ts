import { useState } from "react";

interface IParams {
  disabled?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
}

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
