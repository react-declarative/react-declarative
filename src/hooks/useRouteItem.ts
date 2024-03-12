import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { BrowserHistory, HashHistory, MemoryHistory } from "history";

import { RouteManager, ISwitchItem } from "../helpers/routeManager";

import useSingleton from "./useSingleton";

/**
 * Returns the current item based on the provided routes and history.
 *
 * @template T - The type of the record for route parameters and data.
 * @template I - The type of the switch item.
 *
 * @param {I[]} routes - An array of switch items representing the different routes.
 * @param {MemoryHistory | BrowserHistory | HashHistory} history - The history object used for navigation.
 *
 * @returns {I} - The current switch item based on the provided routes and history.
 */
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
