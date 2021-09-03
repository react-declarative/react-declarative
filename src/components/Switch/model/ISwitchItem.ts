export interface ISwitchItem {
    path: string;
    component: React.ComponentType;
    guard?: () => boolean;
}

export default ISwitchItem;
