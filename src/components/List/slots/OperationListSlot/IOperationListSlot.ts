import IListOperation from "../../../../model/IListOperation";

/**
 * A interface representing a list of operations in a slot.
 *
 * @interface
 */
export interface IOperationListSlot {
    className?: string;
    style?: React.CSSProperties;
    operations: IListOperation[];
    width: number;
}

export default IOperationListSlot;
