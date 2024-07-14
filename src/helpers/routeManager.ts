import { BrowserHistory, HashHistory, MemoryHistory } from "history";

import getRouteItem from "../utils/getRouteItem";
import getRouteParams from "../utils/getRouteParams";

import type { ISwitchItem } from "../utils/getRouteParams";

import Subject from "../utils/rx/Subject";

/**
 * Class representing a RouteManager.
 *
 * @template T - Type for the route parameters.
 * @template I - Type for the route items.
 */
export class RouteManager<T extends Record<string, any> = Record<string, any>, I extends ISwitchItem = ISwitchItem> extends Subject<void> {

    private _item: I | null = null;
    private _params: T | null = null;
    private _unsubscribe: () => void;

    /**
     * Returns the value of the params property.
     *
     * @returns The value of the params property, which can be of type T or null.
     */
    get params(): T | null {
        return this._params;
    };

    /**
     * Retrieves the value of the item.
     *
     * @return The value of the item. Returns null if item is not set.
     */
    get item(): I | null {
        return this._item;
    }

    constructor(routes: I[], history: MemoryHistory | BrowserHistory | HashHistory) {
        super();
        this._unsubscribe = history.listen(({ location }) => {
            this._params = getRouteParams<T>(routes, location.pathname);
            this._item = getRouteItem<I>(routes, location.pathname);
            this.next();
        });
        this._params = getRouteParams<T>(routes, location.pathname);
        this._item = getRouteItem<I>(routes, location.pathname);
    };

    /**
     * Disposes of the current object by unsubscribing from any subscriptions.
     * @function
     * @memberof Object
     * @name dispose
     * @returns
     */
    dispose = () => {
        this._unsubscribe();
    };

};

/**
 * Creates a route parameters manager.
 *
 * @template T - The type of the route parameters object.
 * @extends {Record<string, any>}
 * @template I - The type of the switch item object.
 * @extends {ISwitchItem}
 *
 * @param routes - The list of routes.
 * @param history - The history object.
 *
 * @returns - The function that returns the current route parameters object.
 */
export const createRouteParamsManager = <T extends Record<string, any> = Record<string, any>, I extends ISwitchItem = ISwitchItem>(routes: I[], history: MemoryHistory | BrowserHistory | HashHistory) => {
    const routeManager = new RouteManager<T, I>(routes, history);
    const fn = () => routeManager.params;
    fn.clear = routeManager.dispose();
    return fn;
};

/**
 * A function that creates a route item manager.
 *
 * @param routes - An array of switch items representing routes.
 * @param history - The history object to be used for navigation.
 *
 * @returns - A function that returns the current route item.
 */
export const createRouteItemManager = <T extends Record<string, any> = Record<string, any>, I extends ISwitchItem = ISwitchItem>(routes: I[], history: MemoryHistory | BrowserHistory | HashHistory) => {
    const routeManager = new RouteManager<T, I>(routes, history);
    const fn = () => routeManager.item;
    fn.clear = routeManager.dispose();
    return fn;
};

export { ISwitchItem };

export default RouteManager;
