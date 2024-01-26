import IAnything from "../../../model/IAnything";
import ISearchItem from "./ISearchItem";

export interface ISearchItemProps<T extends IAnything = IAnything> extends Omit<ISearchItem, keyof {
    data: never;
}> {
    disabled: boolean;
    payload: IAnything;
    data: T;
}

export default ISearchItemProps;
