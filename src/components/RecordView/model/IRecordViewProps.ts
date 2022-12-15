import { GridSize, BoxProps } from "@mui/material";

import IData from './IData';

export interface IRecordViewProps<Data extends IData = IData> extends BoxProps {
    data: Data;
    keyWidth?: GridSize;
    valueWidth?: GridSize;
    totalWidth?: number;
    withExpandAll?: boolean;
    formatValue?: (
        key: string,
        value: boolean | number | string | null
    ) => React.ReactNode;
}

export default IRecordViewProps;
