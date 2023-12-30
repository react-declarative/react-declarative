import { SxProps } from "@mui/material";
import IAnything from "../../../model/IAnything";
import IBoardColumn from "./IBoardColumn";
import IBoardItem from "./IBoardItem";

export interface IKanbanViewProps<Payload = IAnything> {
    withUpdateOrder?: boolean;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps;
    payload?: (() => Payload) | Payload;
    disabled?: boolean;
    items: IBoardItem[];
    columns: IBoardColumn<Payload>[];
    bufferSize?: number;
    minRowHeight?: number;
    onChangeColumn: (id: string, column: string, payload: IAnything) => Promise<void>;
    onCardLabelClick?: (id: string, payload: IAnything) => void;
    onLabelClick?: (id: string, payload: IAnything) => void;
    AfterCardContent?: React.ComponentType<{ id: string; payload: IAnything }>;
    BeforeColumnTitle?: React.ComponentType<{ column: string; payload: IAnything }>;
    AfterColumnTitle?: React.ComponentType<{ column: string; payload: IAnything }>;
}

export default IKanbanViewProps;
