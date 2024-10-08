import React from "react";
import { SxProps } from "@mui/material";
import History from "../../../model/History";
import IAnything from "../../../model/IAnything";
import IOutletViewProps from "../../OutletView/model/IOutletViewProps";
import ITabsOutlet, { OtherProps } from "./ITabsOutlet";
import ITabsStep from "./ITabsStep";
import { MemoryHistory } from "history";

/**
 * Represents the props for the ITabsView component.
 *
 * @template Data - The data type.
 * @template Payload - The payload type.
 */
export interface ITabsViewProps<Data extends {} = IAnything, Payload = IAnything, Params = IAnything> extends Omit<IOutletViewProps<Data, Payload, Params, Partial<OtherProps>>, keyof {
    history: never;
    routes: never;
}> {
    fullScreen?: boolean;
    transparentHeader?: boolean;
    BeforeTabs?: React.ComponentType<any>;
    AfterTabs?: React.ComponentType<any>;
    className?: string;
    outlinePaper?: boolean;
    transparentPaper?: boolean;
    style?: React.CSSProperties;
    sx?: SxProps<any>;
    onTabChange: (id: string, history: MemoryHistory, payload: Payload) => void;
    routes: ITabsOutlet<Data, Payload>[];
    tabs: ITabsStep<Payload>[];
    history?: History;
    pathname?: string;
}

export default ITabsViewProps;
