import { Key, pathToRegexp } from "path-to-regexp";

/**
 * Represents an item that can be switched.
 *
 * @interface ISwitchItem
 */
export interface ISwitchItem {
    path: string;
}

/**
 * Retrieves the route parameters from a given pathname based on a set of routes.
 *
 * @template T - The type of object to return as the parameters.
 * @param routes - The array of route objects to search through.
 * @param pathname - The pathname to extract the parameters from.
 * @returns - The extracted route parameters or null if no match is found.
 */
export const getRouteParams = <T = Record<string, any>>(routes: ISwitchItem[], pathname: string): T | null => {
    for (const { path } of routes) {
        const params = {} as T;
        const keys: Key[] = [];
        const reg = pathToRegexp(path, keys);
        const match = reg.test(pathname);
        if (match) {
            const tokens = reg.exec(pathname);
            tokens && keys.forEach((key, i) => {
                // @ts-ignore
                params[key.name] = tokens[i + 1];
            });
            return params;
        }
    }
    return null;
};

export default getRouteParams;
