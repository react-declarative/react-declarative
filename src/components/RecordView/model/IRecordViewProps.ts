import * as React from "react";
import { GridSize, BoxProps } from "@mui/material";

import IData from './IData';
import IAnything from "../../../model/IAnything";

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
    formatValue?: (
        key: string,
        value: boolean | number | string | null,
        path: string,
    ) => React.ReactNode;
    formatKey?: (
        key: string,
        path: string,
    ) => React.ReactNode;
    onSearchChanged?: (search: string) => void;
    BeforeSearch?: React.ComponentType<any>;
    AfterSearch?: React.ComponentType<any>;
    payload?: Payload;
}

export default IRecordViewProps;
