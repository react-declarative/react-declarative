
import { SxProps } from "@mui/material";
import History from "../../../model/History";
import IAnything from "../../../model/IAnything";
import IOutletViewProps from "../../OutletView/model/IOutletViewProps";
import ITabsOutlet, { OtherProps } from "./ITabsOutlet";
import ITabsStep from "./ITabsStep";
import { MemoryHistory } from "history";

export interface ITabsViewProps<Data extends {} = IAnything, Payload = IAnything> extends Omit<IOutletViewProps<Data, Payload, OtherProps>, keyof {
    history: never;
    routes: never;
}> {
    className?: string;
    outlinePaper?: boolean;
    style?: React.CSSProperties;
    sx?: SxProps;
    onTabChange: (id: string, history: MemoryHistory, payload: Payload) => void;
    routes: ITabsOutlet<Data, Payload>[];
    tabs: ITabsStep[];
    history?: History;
    pathname?: string;
}

export default ITabsViewProps;
