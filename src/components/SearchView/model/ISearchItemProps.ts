import IAnything from "../../../model/IAnything";
import ISearchItem from "./ISearchItem";

export interface ISearchItemProps<T extends IAnything = IAnything> extends Omit<ISearchItem, keyof {
    data: never;
}> {
    payload: IAnything;
    data: T;
    onClick: () => void;
}

export default ISearchItemProps;
