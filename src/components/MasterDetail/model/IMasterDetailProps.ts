import IMasterDetailOption from "./IMasterDetailOption";
import MasterDetailMode from "./MasterDetailMode";
import React from "react";
import { SxProps } from "@mui/material";

/**
 * Props interface for the IMasterDetail component.
 *
 * @template Payload - The type of the payload data.
 *
 * @property [withTransparentTabs=false] - Determines if the tabs should have a transparent background.
 * @property [withMenuCollapse=false] - Determines if the menu should collapse when the detail view is open.
 * @property [withFixedPos=false] - Determines if the component should have a fixed position.
 * @property [fixedPosHeaderAdjust] - The number of pixels to adjust the header when the component has a fixed position.
 * @property [mode] - The mode of the master detail component.
 * @property [title] - The title of the component.
 * @property children - The child components of the master detail component.
 * @property [Loader] - The loader component to use.
 * @property [Error] - The error component to use.
 * @property [activeOption] - The currently active option.
 * @property [onActiveOptionChange] - Callback function called when the active option is changed.
 * @property [className] - The CSS class name for the component.
 * @property [style] - The inline style for the component.
 * @property [sx] - The custom styling props for the component.
 * @property [payload] - The payload data.
 * @property [deps] - The dependencies for the component.
 * @property options - The options for the component.
 * @property [fallback] - The fallback function in case of an error.
 * @property [onLoadStart] - Callback function called when the data loading starts.
 * @property [onLoadEnd] - Callback function called when the data loading ends.
 * @property [throwError=false] - Determines if an error should be thrown.
 */
export interface IMasterDetailProps<Payload = any> {
    withTransparentTabs?: boolean;
    withMenuCollapse?: boolean;
    withFixedPos?: boolean;
    fixedPosHeaderAdjust?: number;
    mode?: MasterDetailMode;
    title?: string;
    children: React.ReactNode;
    Loader?: React.ComponentType<any>;
    Error?: React.ComponentType<any>;
    activeOption?: string;
    onActiveOptionChange?: (activeOption: string, initial: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps<any>;
    payload?: Payload;
    deps?: any[];
    options: IMasterDetailOption<Payload>[];
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
}

export default IMasterDetailProps;
