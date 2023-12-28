import * as React from 'react';

import { SxProps } from "@mui/material";

import IFeatureGroup from "./IFeatureGroup";
import TSubject from '../../../model/TSubject';

export interface IFeatureViewProps {
    changeSubject?: TSubject<any>;
    data?: string[] | null;
    outlinePaper?: boolean;
    onChange?: (data: string[]) => void;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps;
    readonly?: boolean;
    features: IFeatureGroup[];
    expandAll?: boolean;
}

export default IFeatureViewProps;
