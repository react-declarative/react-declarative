import * as React from "react";
import { GridSize, BoxProps } from "@mui/material";

import IData from './IData';
import IAnything from "../../../model/IAnything";

/**
 * Interface for the props of the RecordView component.
 *
 * @template Data - The type of the data.
 * @template Payload - The type of the payload.
 * @extends BoxProps - Props for the Box component.
 */
export interface IRecordViewProps<Data = IData, Payload = IAnything> extends BoxProps {
    background?: string;
    data: Data;
    search?: string;
    keyWidth?: GridSize;
    valueWidth?: GridSize;
    totalWidth?: number;
    withExpandAll?: boolean;
    withExpandRoot?: boolean;
    expandList?: Array<string>;
    withExpandLevel?: number;
    EmptyItem?: React.ComponentType<any>;
    formatValue?: (
        key: string,
        value: boolean | number | string | null,
        path: string,
    ) => React.ReactNode;
    formatKey?: (
        key: string,
        path: string,
    ) => React.ReactNode;
    formatSearch?: (
        key: string,
        value: boolean | number | string | null,
        path: string,
    ) => string;
    onSearchChanged?: (search: string) => void;
    BeforeSearch?: React.ComponentType<any>;
    AfterSearch?: React.ComponentType<any>;
    BeforeCollapseLabel?: React.ComponentType<{ payload: Payload; path: string; }>;
    AfterCollapseLabel?: React.ComponentType<{ payload: Payload; path: string; }>;
    payload?: Payload;
}

export default IRecordViewProps;
