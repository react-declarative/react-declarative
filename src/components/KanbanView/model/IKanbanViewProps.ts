import { SxProps } from "@mui/material";
import IAnything from "../../../model/IAnything";
import IBoardColumn from "./IBoardColumn";
import IBoardItem from "./IBoardItem";

export interface IKanbanViewProps<Data = IAnything, Payload = IAnything> {
    withUpdateOrder?: boolean;
    className?: string;
    rowTtl?: number;
    style?: React.CSSProperties;
    sx?: SxProps;
    payload?: (() => Payload) | Payload;
    disabled?: boolean;
    items: IBoardItem<Data>[];
    columns: IBoardColumn<Data, Payload>[];
    bufferSize?: number;
    minRowHeight?: number;
    onChangeColumn?: (id: string, column: string, data: Data, payload: IAnything) => (void | Promise<void>);
    onCardLabelClick?: (id: string, data: Data, payload: IAnything) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    throwError?: boolean;
    AfterCardContent?: React.ComponentType<{ id: string; data: Data; payload: IAnything }>;
    BeforeColumnTitle?: React.ComponentType<{ column: string; payload: IAnything }>;
    AfterColumnTitle?: React.ComponentType<{ column: string; payload: IAnything }>;
}

export default IKanbanViewProps;
