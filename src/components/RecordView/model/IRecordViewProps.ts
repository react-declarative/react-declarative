import { GridSize, BoxProps } from "@mui/material";

import IData from './IData';

export interface IRecordViewProps<Data = IData> extends BoxProps {
    data: Data;
    keyWidth?: GridSize;
    valueWidth?: GridSize;
    totalWidth?: number;
    withExpandAll?: boolean;
    withExpandRoot?: boolean;
    formatValue?: (
        key: string,
        value: boolean | number | string | null,
        path: string,
    ) => React.ReactNode;
}

export default IRecordViewProps;
