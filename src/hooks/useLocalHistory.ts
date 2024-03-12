import { useEffect, useMemo } from "react";
import { createMemoryHistory } from "history";

import History from "../model/History";

interface IParams {
  history?: History;
  pathname: string;
}

/**
 * Initializes and manages a local history object.
 *
 * @param options - The options for the local history.
 * @param options.history - The upper history object to sync with.
 * @param [options.pathname="/"] - The initial pathname for the history.
 *
 * @return - The local history object.
 */
export const useLocalHistory = ({
  history: upperHistory,
  pathname = "/"
}: Partial<IParams> = {}) => {
  const history = useMemo(() => {
    return createMemoryHistory({
      initialEntries: [upperHistory?.location.pathname || pathname],
    });
  }, []);

  useEffect(() => upperHistory?.listen(({
    action,
    location,
  }) => {
    if (action === "PUSH") {
      history.push(location);
    }
    if (action === "REPLACE") {
      history.replace(location);
    }
  }), [upperHistory]);

  return {
    history,
  };
};

export default useLocalHistory;
