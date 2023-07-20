import React from "react";
import IMasterDetailOption from "./IMasterDetailOption";
import { SxProps } from "@mui/system";

export interface IMasterDetailProps<Payload = any> {
    title?: string;
    children: React.ReactNode;
    Loader?: React.ComponentType<any>;
    Error?: React.ComponentType<any>;
    activeOption?: string;
    onActiveOptionChange?: (activeOption: string) => void;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps;
    payload?: Payload;
    deps?: any[];
    options: IMasterDetailOption<Payload>[];
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
}

export default IMasterDetailProps;
