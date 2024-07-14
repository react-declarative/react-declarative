import * as React from 'react';

import { SxProps } from "@mui/material";

import IFeatureGroup from "./IFeatureGroup";
import type TSubject from '../../../model/TSubject';

/**
 * Represents the props for the FeatureView component.
 */
export interface IFeatureViewProps {
    changeSubject?: TSubject<any>;
    data?: string[] | null;
    outlinePaper?: boolean;
    transparentPaper?: boolean;
    onChange?: (data: string[]) => void;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps<any>;
    readonly?: boolean;
    features: IFeatureGroup[];
    expandAll?: boolean;
}

export default IFeatureViewProps;
