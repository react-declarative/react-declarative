import { SxProps } from "@mui/material";
import IAnything from "../../../model/IAnything";
import IBoardColumn from "./IBoardColumn";
import IBoardItem from "./IBoardItem";
import type TSubject from "../../../model/TSubject";

/**
 * Represents the properties for the KanbanView component.
 *
 * @template Data - The type of data associated with each item.
 * @template Payload - The type of payload associated with each item.
 * @template ColumnType - The type of column associated with each item.
 */
export interface IKanbanViewProps<Data = IAnything, Payload = IAnything, ColumnType = IAnything> {
    reloadSubject?: TSubject<void>;
    ref?: React.Ref<HTMLDivElement | undefined>;
    deps?: any[];
    withUpdateOrder?: boolean;
    withGoBack?: boolean;
    withHeaderTooltip?: boolean;
    className?: string;
    rowTtl?: number;
    style?: React.CSSProperties;
    sx?: SxProps<any>;
    payload?: (() => Payload) | Payload;
    disabled?: boolean;
    items: IBoardItem<Data, Payload, ColumnType>[];
    columns: IBoardColumn<Data, Payload, ColumnType>[];
    bufferSize?: number;
    minRowHeight?: number;
    cardLabel?: React.ReactNode | ((id: string, data: Data, payload: Payload) => (React.ReactNode | Promise<React.ReactNode>));
    onChangeColumn?: (id: string, column: ColumnType, data: Data, payload: IAnything) => (void | Promise<void>);
    onCardLabelClick?: (id: string, data: Data, payload: IAnything) => void;
    onDataRequest?: (initial: boolean) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    filterFn?: (item: IBoardItem<Data, Payload, ColumnType>) => boolean;
    throwError?: boolean;
    AfterCardContent?: React.ComponentType<{ id: string; data: Data; payload: IAnything }>;
    BeforeColumnTitle?: React.ComponentType<{ column: ColumnType; payload: IAnything }>;
    AfterColumnTitle?: React.ComponentType<{ column: ColumnType; payload: IAnything }>;
}

export default IKanbanViewProps;
