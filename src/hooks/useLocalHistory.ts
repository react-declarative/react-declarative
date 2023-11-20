import { useEffect, useMemo } from "react";
import { createMemoryHistory } from "history";

import History from "../model/History";

interface IParams {
  history?: History;
  pathname: string;
}

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
