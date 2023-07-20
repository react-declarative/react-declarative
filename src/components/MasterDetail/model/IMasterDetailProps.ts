import React from "react";
import { SxProps } from "@mui/system";

import IMasterDetailOption from "./IMasterDetailOption";
import MasterDetailMode from "./MasterDetailMode";

export interface IMasterDetailProps<Payload = any> {
    mode?: MasterDetailMode;
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
