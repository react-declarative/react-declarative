export interface ISwitchItem {
    path: string;
    component?: React.ComponentType<any>;
    guard?: () => boolean | Promise<boolean>;
    redirect?: string;
}

export default ISwitchItem;
