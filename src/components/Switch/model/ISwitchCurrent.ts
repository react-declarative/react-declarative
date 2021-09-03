import ISwitchItem from "./ISwitchItem";

export interface ISwitchCurrent extends ISwitchItem {
    params: Record<string, unknown>;
}

export default ISwitchCurrent;
