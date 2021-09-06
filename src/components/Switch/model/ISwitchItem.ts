export interface ISwitchItem {
    path: string;
    component?: React.ComponentType<any>;
    guard?: () => boolean;
    redirect?: string;
}

export default ISwitchItem;
