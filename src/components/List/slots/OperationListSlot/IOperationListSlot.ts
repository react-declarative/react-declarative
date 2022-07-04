import IListOperation from "../../../../model/IListOperation";

export interface IOperationListSlot {
    className?: string;
    style?: React.CSSProperties;
    operations: IListOperation[];
    width: number;
}

export default IOperationListSlot;
