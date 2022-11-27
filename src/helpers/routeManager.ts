import { BrowserHistory, HashHistory, MemoryHistory } from "history";
import getRouteParams, { ISwitchItem } from "../utils/getRouteParams";

export class RouteManager<T = Record<string, any>> {

    private _params: T | null = null;
    private _unsubscribe: () => void;

    get params(): T | null {
        return this._params;
    };

    constructor(routes: ISwitchItem[], history: MemoryHistory | BrowserHistory | HashHistory) {
        this._unsubscribe = history.listen(({ location }) => {
            this._params = getRouteParams(routes, location.pathname);
        });
    };

    dispose = () => {
        this._unsubscribe;
    };

};

export const createRouteManager = <T = Record<string, any>>(routes: ISwitchItem[], history: MemoryHistory | BrowserHistory | HashHistory) => {
    const routeManager = new RouteManager<T>(routes, history);
    const fn = () => routeManager.params;
    fn.clear = routeManager.dispose;
    return fn;
};

export default RouteManager;
