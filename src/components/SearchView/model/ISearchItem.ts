import IAnything from "../../../model/IAnything";

export interface ISearchItem<T extends IAnything = IAnything> {
    label: string;
    value: string;
    data?: T;
}

export default ISearchItem;
