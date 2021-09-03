export interface ISwitchItem {
    path: string;
    component: React.ComponentType<any>;
    guard?: () => boolean;
}

export default ISwitchItem;
