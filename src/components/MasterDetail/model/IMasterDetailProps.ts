import IMasterDetailOption from "./IMasterDetailOption";
import MasterDetailMode from "./MasterDetailMode";
import React from "react";
import { SxProps } from "@mui/system";

export interface IMasterDetailProps<Payload = any> {
    mode?: MasterDetailMode;
    title?: string;
    children: React.ReactNode;
    Loader?: React.ComponentType<any>;
    Error?: React.ComponentType<any>;
    activeOption?: string;
    onActiveOptionChange?: (activeOption: string, initial: boolean) => void;
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
