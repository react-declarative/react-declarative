import { useEffect, useMemo } from "react";
import { Update, createMemoryHistory } from "history";

import useActualCallback from "./useActualCallback";

import History from "../model/History";

/**
 * Represents the parameters for navigating to a specific pathname in a web application.
 *
 * @interface
 */
interface IParams {
  history?: History;
  pathname: string;
  onNavigate?: (update: Update) => void;
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
  pathname = "/",
  onNavigate = () => undefined,
}: Partial<IParams> = {}) => {

  const onNavigate$ = useActualCallback(onNavigate);

  const history = useMemo(() => {
    return createMemoryHistory({
      initialEntries: [upperHistory?.location.pathname || pathname],
    });
  }, []);

  useEffect(() => upperHistory?.listen((update) => {
    const {
      action,
      location,
    } = update;
    if (action === "PUSH") {
      history.push(location);
    }
    if (action === "REPLACE") {
      history.replace(location);
    }
    onNavigate$(update);
  }), [upperHistory]);

  return {
    history,
  };
};

export default useLocalHistory;
