import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { BrowserHistory, HashHistory, MemoryHistory } from "history";

import { RouteManager, ISwitchItem } from "../helpers/routeManager";

import useSingleton from "./useSingleton";

export const useRouteItem = <T extends Record<string, any> = Record<string, any>, I extends ISwitchItem = ISwitchItem>(routes: I[], history: MemoryHistory | BrowserHistory | HashHistory) => {

    const routeManager = useSingleton(() => new RouteManager<T, I>(routes, history));

    const isMounted = useRef(true);

    const [item, setItem] = useState(routeManager.item);

    useEffect(() => routeManager.subscribe(() => {
        isMounted.current && setItem(routeManager.item);
    }), []);

    useEffect(() => () => {
        routeManager.dispose();
    }, []);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    return item;
};

export default useRouteItem;
