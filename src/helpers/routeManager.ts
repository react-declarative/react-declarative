import { BrowserHistory, HashHistory, MemoryHistory } from "history";

import getRouteItem from "../utils/getRouteItem";
import getRouteParams, { ISwitchItem } from "../utils/getRouteParams";

import Subject from "../utils/rx/Subject";

export class RouteManager<T extends Record<string, any> = Record<string, any>, I extends ISwitchItem = ISwitchItem> extends Subject<void> {

    private _item: I | null = null;
    private _params: T | null = null;
    private _unsubscribe: () => void;

    get params(): T | null {
        return this._params;
    };

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

    dispose = () => {
        this._unsubscribe();
    };

};

export const createRouteParamsManager = <T extends Record<string, any> = Record<string, any>, I extends ISwitchItem = ISwitchItem>(routes: I[], history: MemoryHistory | BrowserHistory | HashHistory) => {
    const routeManager = new RouteManager<T, I>(routes, history);
    const fn = () => routeManager.params;
    fn.clear = routeManager.dispose();
    return fn;
};

export const createRouteItemManager = <T extends Record<string, any> = Record<string, any>, I extends ISwitchItem = ISwitchItem>(routes: I[], history: MemoryHistory | BrowserHistory | HashHistory) => {
    const routeManager = new RouteManager<T, I>(routes, history);
    const fn = () => routeManager.item;
    fn.clear = routeManager.dispose();
    return fn;
};

export { ISwitchItem };

export default RouteManager;
