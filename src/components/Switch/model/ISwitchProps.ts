import { BrowserHistory } from "history";
import { ComponentType } from "react";

import ISwitchItem from "./ISwitchItem";

export interface ISwitchProps {
    items: ISwitchItem[];
    history?: BrowserHistory;
    NotFound?: ComponentType;
}

export default ISwitchProps;
