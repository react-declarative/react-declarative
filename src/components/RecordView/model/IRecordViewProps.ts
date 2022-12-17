import { GridSize, BoxProps } from "@mui/material";

import IData from './IData';

export interface IRecordViewProps<Data = IData> extends BoxProps {
    background?: string;
    data: Data;
    search?: string;
    keyWidth?: GridSize;
    valueWidth?: GridSize;
    totalWidth?: number;
    withExpandAll?: boolean;
    withExpandRoot?: boolean;
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
}

export default IRecordViewProps;
