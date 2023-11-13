import { createMemoryHistory } from "history";
import { useMemo } from "react";
import useReloadTrigger from "./useReloadTrigger";

interface IParams {
  pathname: string;
}

export const useLocalHistory = ({ pathname = "/" }: Partial<IParams> = {}) => {
  const { reloadTrigger, doReload } = useReloadTrigger();
  const history = useMemo(() => {
    return createMemoryHistory({
      initialEntries: [pathname],
    });
  }, [reloadTrigger]);
  return {
    history,
    reload: doReload,
  };
};

export default useLocalHistory;
