import { createMemoryHistory } from "history";
import { useMemo } from "react";

interface IParams {
    pathname: string;
}

export const useLocalHistory = ({
    pathname = "/",
}: IParams) => useMemo(() => {
    return createMemoryHistory({
        initialEntries: [pathname],
    });
}, []);

export default useLocalHistory;
