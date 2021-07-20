export interface IMenuOption {
    name?: string;
    label: string;
    icon?: string;
    bold?: boolean;
    disabled?: boolean;
}

export interface IMenuGroup extends IMenuOption {
    options?: IMenuGroup[];
}

export default IMenuGroup;
