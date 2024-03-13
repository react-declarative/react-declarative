import IAnything from "../../../model/IAnything";
import ISearchItem from "./ISearchItem";

/**
 * Represents the properties for a search item.
 *
 * @template T - The data type for the search item.
 */
export interface ISearchItemProps<T extends IAnything = IAnything> extends Omit<ISearchItem, keyof {
    data: never;
}> {
    disabled: boolean;
    payload: IAnything;
    data: T;
}

export default ISearchItemProps;
