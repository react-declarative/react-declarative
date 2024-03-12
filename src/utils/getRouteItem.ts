import { Key, pathToRegexp } from "path-to-regexp";

import { ISwitchItem } from './getRouteParams';

/**
 * Finds a route item that matches the given pathname from the provided routes array.
 *
 * @param routes - An array of switch items.
 * @param pathname - The pathname to match against the route items.
 * @return - The matched route item, or null if no match is found.
 */
export const getRouteItem = <T extends ISwitchItem = ISwitchItem>(routes: T[], pathname: string): T | null => {
    for (const route of routes) {
        const { path = "/" } = route;
        const keys: Key[] = [];
        const reg = pathToRegexp(path, keys);
        const match = reg.test(pathname);
        if (match) {
            return route;
        }
    }
    return null;
};

export default getRouteItem;
