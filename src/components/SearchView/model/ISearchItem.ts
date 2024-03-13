import IAnything from "../../../model/IAnything";

/**
 * Represents a search item.
 * @interface
 * @template T - The type of additional data associated with the search item.
 */
export interface ISearchItem<T extends IAnything = IAnything> {
    label: string;
    value: string;
    data?: T;
}

export default ISearchItem;
