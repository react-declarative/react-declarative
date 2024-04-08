import IListOperation from "../../../../model/IListOperation";

/**
 * A interface representing a list of operations in a slot.
 *
 * @interface
 */
export interface IOperationListSlot {
    className?: string;
    style?: React.CSSProperties;
    /**
     * Represents a list of operations to perform on an IList.
     *
     * @typedef IListOperation
     * @property name - The name of the operation.
     * @property parameters - The parameters required for the operation.
     */
    operations: IListOperation[];
    width: number;
}

export default IOperationListSlot;
