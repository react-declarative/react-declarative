import React from "react";
import IMasterDetailOption from "./IMasterDetailOption";
import { SxProps } from "@mui/system";

export interface IMasterDetailProps<Payload = any> {
    title?: string;
    children: (id: string, payload: Payload) => (React.ReactNode | Promise<React.ReactNode>);
    Loader?: React.ComponentType<any>;
    activeOption?: string;
    onActiveOptionChange?: (activeOption: string) => void;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps;
    payload?: Payload;
    options: IMasterDetailOption<Payload>[];
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
}

export default IMasterDetailProps;
