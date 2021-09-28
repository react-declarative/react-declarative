import { BrowserHistory } from "history";
import { ComponentType } from "react";

import ISwitchItem from "./ISwitchItem";

export interface ISwitchProps {
    items: ISwitchItem[];
    fallback?: (e: Error) => void;
    history?: BrowserHistory;
    Forbidden?: ComponentType<any>;
    NotFound?: ComponentType<any>;
    Loading?: ComponentType<any>;
}

export default ISwitchProps;
