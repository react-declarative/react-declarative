export interface ISwitchItem {
    path: string;
    element?: React.ComponentType<any>;
    guard?: () => boolean | Promise<boolean>;
    redirect?: string;
}

export default ISwitchItem;
